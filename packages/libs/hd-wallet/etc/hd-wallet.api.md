## API Report File for "@kadena/hd-wallet"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { EncryptedString as EncryptedString_2 } from '../utils/kadenaEncryption.js';

// @public (undocumented)
export type EncryptedString = string & {
    _brand: 'EncryptedString';
};

// Warning: (ae-forgotten-export) The symbol "BinaryLike" needs to be exported by the entry point index.d.ts
//
// @public
export function kadenaChangePassword<TEncode extends 'base64' | 'buffer' = 'base64', TReturn = TEncode extends 'base64' ? EncryptedString : Uint8Array>(password: BinaryLike, encryptedData: BinaryLike, newPassword: string, encode?: TEncode): Promise<TReturn>;

// @public
export function kadenaDecrypt(password: BinaryLike, encryptedData: BinaryLike): Promise<Uint8Array>;

// @public
export function kadenaEncrypt<TEncode extends 'base64' | 'buffer' = 'base64', TReturn = TEncode extends 'base64' ? EncryptedString : Uint8Array>(password: BinaryLike, message: BinaryLike, encode?: TEncode): Promise<TReturn>;

// @public
export const kadenaEntropyToMnemonic: (entropy: Uint8Array) => string;

// @public (undocumented)
export function kadenaGenKeypairFromSeed(password: BinaryLike, seed: EncryptedString, index: number, derivationPathTemplate?: string): Promise<[string, EncryptedString]>;

// @public (undocumented)
export function kadenaGenKeypairFromSeed(password: BinaryLike, seed: EncryptedString, indexRange: [number, number], derivationPathTemplate?: string): Promise<Array<[string, EncryptedString]>>;

// @public
export function kadenaGenMnemonic(): string;

// @public (undocumented)
export function kadenaGetPublic(password: BinaryLike, seed: BinaryLike, index: number, derivationPathTemplate?: string): Promise<string>;

// @public (undocumented)
export function kadenaGetPublic(password: BinaryLike, seed: BinaryLike, indexRange: [number, number], derivationPathTemplate?: string): Promise<string[]>;

// @public
export function kadenaKeyPairsFromRandom(count?: number): {
    publicKey: string;
    secretKey: string;
}[];

// @public
export function kadenaMnemonicToSeed<TEncode extends 'base64' | 'buffer' = 'base64'>(password: BinaryLike, mnemonic: string, encode?: TEncode): Promise<TEncode extends "base64" ? EncryptedString_2 : Uint8Array>;

// Warning: (ae-forgotten-export) The symbol "ISignatureWithPublicKey" needs to be exported by the entry point index.d.ts
//
// @public
export function kadenaSignWithKeyPair(password: BinaryLike, publicKey: string, encryptedPrivateKey: EncryptedString): (hash: string) => Promise<ISignatureWithPublicKey>;

// @public
export function kadenaSignWithSeed(password: BinaryLike, seed: BinaryLike, index: number, derivationPathTemplate?: string): (hash: string) => Promise<ISignatureWithPublicKey>;

// @public
export function kadenaSignWithSeed(password: BinaryLike, seed: BinaryLike, indexRange: number[], derivationPathTemplate?: string): (hash: string) => Promise<ISignatureWithPublicKey[]>;

// @public
export function kadenaVerify(message: BinaryLike, publicKey: string, signature: string): boolean;

// @public (undocumented)
export const randomBytes: (size: number) => Uint8Array;

// (No @packageDocumentation comment for this package)

```
