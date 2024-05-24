import React from "react";

export const ComparisonChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <g fill="#3f51b5">
      <circle cx="8" cy="38" r="3" />
      <circle cx="16" cy="40" r="3" />
      <circle cx="24" cy="33" r="3" />
      <circle cx="32" cy="35" r="3" />
      <circle cx="40" cy="31" r="3" />
      <path d="m39.1 29.2l-7.3 3.7l-8.3-2.1l-8 7l-7-1.7l-1 3.8l9 2.3l8-7l7.7 1.9l8.7-4.3z" />
    </g>
    <g fill="#00bcd4">
      <circle cx="8" cy="20" r="3" />
      <circle cx="16" cy="22" r="3" />
      <circle cx="24" cy="15" r="3" />
      <circle cx="32" cy="20" r="3" />
      <circle cx="40" cy="8" r="3" />
      <path d="M38.3 6.9c-2.1 3.2-5.3 8-6.9 10.4c-1.2-.7-3.1-2-6.4-4l-1.3-.8l-8.3 7.3l-7-1.7l-1 3.9l9 2.3l7.7-6.7c2.6 1.6 5.8 3.6 6.5 4.1l.5.5l.9-.1c1.1-.1 1.1-.1 9.5-12.9z" />
    </g>
  </svg>
);
