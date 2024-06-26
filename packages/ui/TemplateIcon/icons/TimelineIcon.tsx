import React from "react";

export const TimelineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <path fill="#ec5b5b" d="M6 15h6v2H6zm6-8h6v2h-6zm-3 4h6v2H9z" />
    <path
      fill="#ec5b5b"
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14z"
    />
  </svg>
);
