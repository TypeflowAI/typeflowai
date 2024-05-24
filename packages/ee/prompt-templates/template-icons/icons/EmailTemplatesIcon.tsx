import React from "react";

export const EmailTemplatesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <defs>
      <mask id="ipTPageTemplate0">
        <path
          fill="#555"
          stroke="#fff"
          stroke-linejoin="round"
          stroke-width="4"
          d="M23 4H4v22h19zm21 30H4v9h40zm0-30H31v8h13zm0 14H31v8h13z"
        />
      </mask>
    </defs>
    <path fill="#f033e9" d="M0 0h48v48H0z" mask="url(#ipTPageTemplate0)" />
  </svg>
);
