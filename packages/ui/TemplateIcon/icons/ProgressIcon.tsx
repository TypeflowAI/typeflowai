import React from "react";

export const ProgressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
    <path
      fill="#54db1a"
      d="M18 5H2C.9 5 0 5.9 0 7v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 8H2V7h16zM7 8H3v4h4zm5 0H8v4h4z"
    />
  </svg>
);
