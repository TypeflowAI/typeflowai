import React from "react";

export const BrandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048">
    <path
      fill="#ca4eaf"
      d="M0 128h2048v1664H0zm768 1024h512V768H768zM640 768H128v384h512zm768 384h512V768h-512z"
    />
  </svg>
);
