import React from "react";

export const TrendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <g fill="none" stroke="#000" strokeLinejoin="round" strokeWidth="4">
      <path strokeLinecap="round" d="M4 44H44" />
      <path fill="#e19751" d="M4 26L12 28V38H4V26Z" />
      <path fill="#e19751" d="M20 24L28 20V38H20V24Z" />
      <path fill="#e19751" d="M36 16L44 12V38H36V16Z" />
      <path strokeLinecap="round" d="M4 18L12 20L44 4H34" />
    </g>
  </svg>
);
