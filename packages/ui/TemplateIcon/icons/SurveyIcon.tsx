import React from "react";

export const WorkflowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <path
      fill="#455a64"
      d="M36 4H26c0 1.1-.9 2-2 2s-2-.9-2-2H12C9.8 4 8 5.8 8 8v32c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V8c0-2.2-1.8-4-4-4"
    />
    <path fill="#fff" d="M36 41H12c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1h24c.6 0 1 .4 1 1v32c0 .6-.4 1-1 1" />
    <g fill="#90a4ae">
      <path d="M26 4c0 1.1-.9 2-2 2s-2-.9-2-2h-7v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4z" />
      <path d="M24 0c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2" />
    </g>
    <path fill="#cfd8dc" d="M21 20h12v2H21zm-6-1h4v4h-4z" />
    <path fill="#03a9f4" d="M21 29h12v2H21zm-6-1h4v4h-4z" />
  </svg>
);
