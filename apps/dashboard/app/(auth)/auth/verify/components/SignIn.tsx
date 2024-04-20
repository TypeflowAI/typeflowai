"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

export const SignIn = ({ token }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (token) {
      signIn("token", { token, callbackUrl: `/` });
    }
  }, [token]);

  useEffect(() => {
    if (status === "authenticated") {
      capturePosthogEvent("EmailConfirmed", { email: session.user.email });
    }
  }, [status, session]);

  return <></>;
};
