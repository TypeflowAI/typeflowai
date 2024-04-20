"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

export const SignIn = ({ token }) => {
  useEffect(() => {
    if (token) {
      capturePosthogEvent("EmailConfirmed");
      signIn("token", {
        token: token,
        callbackUrl: `/`,
      });
    }
  }, [token]);

  return <></>;
};
