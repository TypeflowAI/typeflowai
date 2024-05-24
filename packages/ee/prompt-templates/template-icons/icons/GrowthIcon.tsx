import React from "react";

export const GrowthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <path fill="#00bcd4" d="M37 18h6v24h-6zm-8 8h6v16h-6zm-8-4h6v20h-6zm-8 10h6v10h-6zm-8-4h6v14H5z" />
    <g fill="#3f51b5">
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="18" r="3" />
      <circle cx="24" cy="11" r="3" />
      <circle cx="32" cy="13" r="3" />
      <circle cx="40" cy="9" r="3" />
      <path d="m39.1 7.2l-7.3 3.7l-8.3-2.1l-8 7l-7-1.7l-1 3.8l9 2.3l8-7l7.7 1.9l8.7-4.3z" />
    </g>
  </svg>
);
