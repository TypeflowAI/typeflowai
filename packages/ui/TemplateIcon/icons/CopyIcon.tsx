import React from "react";

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g fill="none" stroke="#050505" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path
        fill="#050505"
        fillOpacity="0"
        strokeDasharray="62"
        strokeDashoffset="62"
        d="M20 6V5C20 4.45 19.55 4 19 4H5C4.45 4 4 4.45 4 5V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19z">
        <animate fill="freeze" attributeName="strokeDashoffset" dur="0.6s" values="62;124" />
        <animate fill="freeze" attributeName="fillOpacity" begin="1.3s" dur="0.15s" values="0;0.3" />
      </path>
      <g strokeDasharray="10" strokeDashoffset="10">
        <path d="M8 8h8">
          <animate fill="freeze" attributeName="strokeDashoffset" begin="0.7s" dur="0.2s" values="10;0" />
        </path>
        <path d="M8 12h8">
          <animate fill="freeze" attributeName="strokeDashoffset" begin="0.9s" dur="0.2s" values="10;0" />
        </path>
      </g>
      <path strokeDasharray="7" strokeDashoffset="7" d="M8 16h5">
        <animate fill="freeze" attributeName="strokeDashoffset" begin="1.1s" dur="0.2s" values="7;0" />
      </path>
    </g>
  </svg>
);
