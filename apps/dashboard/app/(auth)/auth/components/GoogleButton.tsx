"use client";

import { signIn } from "next-auth/react";

import { Button } from "@typeflowai/ui/Button";
import { GoogleIcon } from "@typeflowai/ui/Icons";

export const GoogleButton = ({
  text = "Continue with Google",
  inviteUrl,
}: {
  text?: string;
  inviteUrl?: string | null;
}) => {
  const handleLogin = async () => {
    await signIn("google", {
      redirect: true,
      callbackUrl: inviteUrl ? inviteUrl : "/", // redirect after login to /
    });
  };

  return (
    <Button
      type="button"
      EndIcon={GoogleIcon}
      startIconClassName="ml-3"
      onClick={handleLogin}
      variant="secondary"
      className="w-full justify-center">
      {text}
    </Button>
  );
};
