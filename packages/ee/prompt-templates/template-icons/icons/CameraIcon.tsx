import React from "react";

export const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36">
    <path fill="#31373d" d="M0 10s0-4 4-4h28s4 0 4 4v18s0 4-4 4H4s-4 0-4-4z" />
    <circle cx="21" cy="19" r="10" fill="#ccd6dd" />
    <circle cx="21" cy="19" r="8" fill="#31373d" />
    <circle cx="21" cy="19" r="5" fill="#3b88c3" />
    <circle cx="32.5" cy="9.5" r="1.5" fill="#fff" />
    <path fill="#ffac33" d="m16 9l3-6l-6 2l-4-5l-2 5l-6-1l4 6l-5 4h6l-2 6l6-3l6 5l-1-8l6-1z" />
    <path fill="#fff" d="m10 14l-3 2l1-3l-3-1l3-2l-3-3h4l1-3l2 3l3-1l-2 3l3 3l-3 1l1 4z" />
  </svg>
);
