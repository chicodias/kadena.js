import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoScore = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="mono"
    viewBox="0 0 24 24"
    fontSize="1.5em"
    fill="currentColor"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 2h1.5v3l2-3h1.7l-2 3 2 3h-1.7l-2-3v3H12zM7 7.25h2.5V6.5H7V5h4v3.75H8.5v.75H11V11H7zM19 13l-6 6-4-4-4 4v-2.5l4-4 4 4 6-6z" />
  </svg>
);
export default MonoScore;
