"use client";

import { usePathname } from "next/navigation";

import { cn } from "@typeflowai/lib/cn";
import { TEnvironment } from "@typeflowai/types/environment";

interface EnvironmentAlertProps {
  environment: TEnvironment;
  className?: string;
}

export default function EnvironmentAlert({ environment, className }: EnvironmentAlertProps) {
  const pathname = usePathname();

  if (pathname?.includes("/edit")) return null;

  return (
    <>
      {environment?.type === "development" && (
        <div className={cn("h-6 bg-[#A33700] p-0.5 text-center text-sm text-white", className)}>
          You&apos;re in development mode. Use it to test workflows, actions and attributes.
        </div>
      )}
    </>
  );
}
