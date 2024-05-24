import React from "react";

export const ListingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <g fill="none" stroke-linejoin="round" stroke-width="4">
      <rect width="36" height="36" x="6" y="6" fill="#4b94d8" stroke="#000" rx="3" />
      <rect width="8" height="8" x="13" y="13" fill="#43ccf8" stroke="#fff" />
      <rect width="8" height="8" x="13" y="27" fill="#43ccf8" stroke="#fff" />
      <path stroke="#fff" stroke-linecap="round" d="M27 28L35 28" />
      <path stroke="#fff" stroke-linecap="round" d="M27 35H35" />
      <path stroke="#fff" stroke-linecap="round" d="M27 13L35 13" />
      <path stroke="#fff" stroke-linecap="round" d="M27 20L35 20" />
    </g>
  </svg>
);
