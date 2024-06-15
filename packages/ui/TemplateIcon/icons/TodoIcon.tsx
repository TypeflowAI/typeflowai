import React from "react";

export const TodoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <path
      fill="#3f51b5"
      d="m17.8 18.1l-7.4 7.3l-4.2-4.1L4 23.5l6.4 6.4l9.6-9.6zm0-13l-7.4 7.3l-4.2-4.1L4 10.5l6.4 6.4L20 7.3zm0 26l-7.4 7.3l-4.2-4.1L4 36.5l6.4 6.4l9.6-9.6z"
    />
    <path fill="#90caf9" d="M24 22h20v4H24zm0-13h20v4H24zm0 26h20v4H24z" />
  </svg>
);
