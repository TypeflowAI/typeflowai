import React from "react";

export const TaskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
    <path fill="#5173d6" d="m14 20.18l-3.59-3.59L9 18l5 5l9-9l-1.41-1.42z" />
    <path
      fill="#5173d6"
      d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"
    />
  </svg>
);
