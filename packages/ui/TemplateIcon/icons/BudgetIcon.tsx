import React from "react";

export const BudgetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
    <circle
      cx="24"
      cy="24"
      r="21.5"
      fill="none"
      stroke="#dfd134"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="24"
      cy="24"
      r="12.5"
      fill="none"
      stroke="#dfd134"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fill="none"
      stroke="#dfd134"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.794 29.31a3.138 3.138 0 0 0 3.062 1.49h2.013a4.263 4.263 0 0 0 4.015-3.4h0a2.752 2.752 0 0 0-2.772-3.4h-2.224a2.752 2.752 0 0 1-2.772-3.4h0a4.263 4.263 0 0 1 4.015-3.4h2.013a3.138 3.138 0 0 1 3.062 1.49m-3.963-1.49l.311-1.7m-3.108 17l.311-1.7M24 36.5v8.999M13.194 17.716l-7.779-4.524m29.449 4.626l7.822-4.451"
    />
  </svg>
);
