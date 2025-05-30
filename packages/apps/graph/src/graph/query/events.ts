import { prismaClient } from '@db/prisma-client';
import type { Event } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import {
  createBlockDepthMap,
  getConditionForMinimumDepth,
} from '@services/depth-service';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { parsePrismaJsonColumn } from '@utils/prisma-json-columns';
import { ZodError } from 'zod';
import { builder } from '../builder';

const generateEventsFilter = async (args: {
  qualifiedEventName: string;
  chainId?: string | null | undefined;
  parametersFilter?: string | null | undefined;
  blockHash?: string | null | undefined;
  orderIndex?: number | null | undefined;
  requestKey?: string | null | undefined;
  minimumDepth?: number | null | undefined;
  minHeight?: number | null | undefined;
  maxHeight?: number | null | undefined;
}): Promise<Prisma.EventWhereInput> => {
  const conditionsForHeight = (args: {
    minHeight?: number | null | undefined;
    maxHeight?: number | null | undefined;
  }): Prisma.EventWhereInput => {
    const conditions: Prisma.EventWhereInput[] = [];

    if (args.minHeight) {
      conditions.push({ height: { gte: args.minHeight } });
    }

    if (args.maxHeight) {
      conditions.push({ height: { lte: args.maxHeight } });
    }

    return { AND: conditions };
  };
  return {
    qualifiedName: args.qualifiedEventName,
    requestKey: {
      not: 'cb',
    },
    ...(args.parametersFilter && {
      parameters: parsePrismaJsonColumn<'Event'>(args.parametersFilter, {
        query: 'events',
        queryParameter: 'parametersFilter',
        column: 'parameters',
      }),
    }),
    ...(args.chainId && { chainId: parseInt(args.chainId) }),
    ...(args.blockHash && { blockHash: args.blockHash }),
    ...(args.orderIndex && { orderIndex: args.orderIndex }),
    ...(args.requestKey && { requestKey: args.requestKey }),
    ...(args.minimumDepth && {
      OR: await getConditionForMinimumDepth(
        args.minimumDepth,
        args.chainId ? [args.chainId] : undefined,
      ),
    }),
    ...((args.minHeight || args.maxHeight) && conditionsForHeight(args)),
  };
};

builder.queryField('events', (t) =>
  t.prismaConnection({
    description: `Retrieve events by qualifiedName (e.g. \`coin.TRANSFER\`). Default page size is ${dotenv.DEFAULT_PAGE_SIZE}.

      The parametersFilter is a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.

      An example of such a filter parameter value: \`events(parametersFilter: "{\\"array_starts_with\\": \\"k:abcdefg\\"}")\``,
    edgesNullable: false,
    args: {
      qualifiedEventName: t.arg.string({
        required: true,
        validate: {
          minLength: 1,
        },
      }),
      chainId: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      parametersFilter: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      blockHash: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      orderIndex: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
      requestKey: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      minimumDepth: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
      minHeight: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
      maxHeight: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
    },
    type: Prisma.ModelName.Event,
    cursor: 'blockHash_orderIndex_requestKey',
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        withRelations: true,
        first: args.first,
        last: args.last,
        minimumDepth: args.minimumDepth,
      }),
    }),
    async totalCount(__parent, args) {
      try {
        return await prismaClient.event.count({
          where: await generateEventsFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async resolve(query, __parent, args) {
      try {
        if (
          args.minHeight &&
          args.maxHeight &&
          args.minHeight > args.maxHeight
        ) {
          throw new ZodError([
            {
              code: 'custom',
              message: 'minHeight must be lower than maxHeight',
              path: ['events'],
            },
          ]);
        }
        let events: Event[] = [];
        let skip = 0;
        const take = query.take;

        while (events.length < take) {
          const remaining = take - events.length;
          const fetchedEvents = await prismaClient.event.findMany({
            ...query,
            where: await generateEventsFilter(args),
            orderBy: [
              { height: 'desc' },
              { requestKey: 'desc' },
              { orderIndex: 'desc' },
            ],
            take: remaining,
            skip,
          });

          if (fetchedEvents.length === 0) {
            break;
          }

          if (args.minimumDepth) {
            const blockHashToDepth = await createBlockDepthMap(
              fetchedEvents,
              'blockHash',
            );

            const filteredEvents = fetchedEvents.filter(
              (event) =>
                blockHashToDepth[event.blockHash] >=
                (args.minimumDepth as number) + 1,
            );

            events = [...events, ...filteredEvents];
          } else {
            events = [...events, ...fetchedEvents];
          }

          skip += remaining;
        }

        return events.slice(0, take);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
