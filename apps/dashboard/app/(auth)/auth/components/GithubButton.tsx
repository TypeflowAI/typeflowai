"use client";

import { signIn } from "next-auth/react";

import { Button } from "@typeflowai/ui/Button";
import { GithubIcon } from "@typeflowai/ui/icons";

export const GithubButton = ({
  text = "Continue with Github",
  inviteUrl,
}: {
  text?: string;
  inviteUrl?: string | null;
}) => {
  const handleLogin = async () => {
    await signIn("github", {
      redirect: true,
      callbackUrl: inviteUrl ? inviteUrl : "/", // redirect after login to /
    });
  };

  return (
    <Button
      type="button"
      EndIcon={GithubIcon}
      startIconClassName="ml-2"
      onClick={handleLogin}
      variant="secondary"
      className="w-full justify-center">
      {text}
    </Button>
  );
};
