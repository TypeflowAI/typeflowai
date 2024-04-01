import clsx from "clsx";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div className={clsx("mx-auto max-w-7xl p-6", className)}>{children}</div>;
}
