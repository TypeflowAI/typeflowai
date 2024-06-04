import { Button } from "@react-email/components";
import React from "react";

interface EmailButtonProps {
  label: string;
  href: string;
}

export const EmailButton = ({ label, href }: EmailButtonProps) => {
  return (
    <Button className="rounded-md bg-violet-950 p-4 text-white" href={href}>
      {label}
    </Button>
  );
};
