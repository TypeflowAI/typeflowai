import React from "react";

export const EmpathyMapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <g fill="none" stroke="#5767b7" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
      <circle cx="24" cy="16" r="6" fill="#ff8c2e" />
      <path d="M36 36C36 29.3726 30.6274 24 24 24C17.3726 24 12 29.3726 12 36" />
      <path d="M36 4H44V12" />
      <path d="M12 4H4V12" />
      <path d="M36 44H44V36" />
      <path d="M12 44H4V36" />
    </g>
  </svg>
);
