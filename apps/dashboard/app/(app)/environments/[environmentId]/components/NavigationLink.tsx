import Link from "next/link";
import React from "react";

import { cn } from "@typeflowai/lib/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@typeflowai/ui/Tooltip";

interface NavigationLinkProps {
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  children: React.ReactNode;
  linkText: string;
  isTextVisible: boolean;
}

export const NavigationLink = ({
  href,
  isActive,
  isCollapsed = false,
  children,
  linkText,
  isTextVisible = true,
}: NavigationLinkProps) => {
  const activeClass = "bg-violet-900 text-lime-300 border-r-4 border-lime-400 font-semibold hover:text-white";
  const inactiveClass =
    "border-r-4 border-transparent text-gray-300 hover:bg-violet-900 hover:text-white transition-all duration-150 ease-in-out";

  return (
    <>
      {isCollapsed ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={cn(
                  "mb-1 ml-2 rounded-l-md py-2 pl-2 text-sm text-slate-700 hover:text-slate-900",
                  isActive ? activeClass : inactiveClass
                )}>
                <Link href={href} className="flex items-center">
                  {children}
                </Link>
              </li>
            </TooltipTrigger>
            <TooltipContent side="right">{linkText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <li
          className={cn(
            "mb-1 rounded-l-md py-2 pl-5 text-sm text-slate-600 hover:text-slate-900",
            isActive ? activeClass : inactiveClass
          )}>
          <Link href={href} className="flex items-center">
            {children}
            <span
              className={cn(
                "ml-2 transition-opacity duration-100",
                isTextVisible ? "opacity-0" : "opacity-100"
              )}>
              {linkText}
            </span>
          </Link>
        </li>
      )}
    </>
  );
};
