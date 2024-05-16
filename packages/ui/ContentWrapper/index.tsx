import { cn } from "@typeflowai/lib/cn";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentWrapper = ({ children, className }: ContentWrapperProps) => {
  return <div className={cn("mx-auto max-w-7xl p-6", className)}>{children}</div>;
};
