import React from "react";

export const JobIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048">
    <path
      fill="#854123"
      d="M2048 384v1280H0V384h640V256q0-27 10-50t27-40t41-28t50-10h512q27 0 50 10t40 27t28 41t10 50v128zm-1280 0h512V256H768zM128 512v185l640 319V896h512v120l640-319V512zm768 512v128h256v-128zm1024 512V839l-640 321v120H768v-120L128 839v697z"
    />
  </svg>
);
