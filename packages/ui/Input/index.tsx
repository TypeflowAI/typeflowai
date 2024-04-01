import * as React from "react";

import { cn } from "@typeflowai/lib/cn";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "crossOrigin" | "dangerouslySetInnerHTML"> {
  crossOrigin?: "" | "anonymous" | "use-credentials" | undefined;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
  isInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "focus:border-brand flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none  focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
        props.isInvalid && "border border-red-600 focus:border-red-600"
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
