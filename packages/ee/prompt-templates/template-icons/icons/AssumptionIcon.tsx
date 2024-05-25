import React from "react";

export const AssumptionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <defs>
      <mask id="ipTFileQuestion0">
        <g fill="none">
          <path
            fill="#555"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2"
          />
          <path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="m30 4l10 10M24 31v-3c2.21 0 4-2.015 4-4.5S26.21 19 24 19s-4 2.015-4 4.5"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M24 39a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"
            clipRule="evenodd"
          />
        </g>
      </mask>
    </defs>
    <path fill="#db9e1a" d="M0 0h48v48H0z" mask="url(#ipTFileQuestion0)" />
  </svg>
);
