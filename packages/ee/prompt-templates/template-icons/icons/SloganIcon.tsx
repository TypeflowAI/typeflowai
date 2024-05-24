import React from "react";

export const SloganIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="#268c28"
      d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"
    />
    <circle cx="16" cy="10" r="0" fill="#268c28">
      <animate
        attributeName="r"
        begin=".67"
        calcMode="spline"
        dur="1.5s"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
        repeatCount="indefinite"
        values="0;1.75;0;0"
      />
    </circle>
    <circle cx="12" cy="10" r="0" fill="#268c28">
      <animate
        attributeName="r"
        begin=".33"
        calcMode="spline"
        dur="1.5s"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
        repeatCount="indefinite"
        values="0;1.75;0;0"
      />
    </circle>
    <circle cx="8" cy="10" r="0" fill="#268c28">
      <animate
        attributeName="r"
        begin="0"
        calcMode="spline"
        dur="1.5s"
        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
        repeatCount="indefinite"
        values="0;1.75;0;0"
      />
    </circle>
  </svg>
);
