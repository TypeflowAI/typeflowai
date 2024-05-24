import React from "react";

export const RejectionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
      <path
        fill="#e15151"
        stroke="#000"
        d="M38 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V6C40 4.89543 39.1046 4 38 4Z"
      />
      <path stroke="#fff" d="M17 30L31 30" />
      <path stroke="#fff" d="M17 36H24" />
      <path stroke="#fff" d="M20 21L28 13" />
      <path stroke="#fff" d="M28 21L20 13" />
    </g>
  </svg>
);
