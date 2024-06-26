import React from "react";

export const CpaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <defs>
      <mask id="ipTSalesReport0">
        <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
          <path fill="#555" d="M41 14L24 4L7 14v20l17 10l17-10z" />
          <path strokeLinecap="round" d="M24 22v8m8-12v12m-16-4v4" />
        </g>
      </mask>
    </defs>
    <path fill="#43b69a" d="M0 0h48v48H0z" mask="url(#ipTSalesReport0)" />
  </svg>
);
