"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

import { trackEvent } from "@typeflowai/ui/PostHogClient";

export const SignIn = ({ token }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (token) {
      signIn("credentials", { token, callbackUrl: `/` });
    }
  }, [token]);

  useEffect(() => {
    if (status === "authenticated") {
      trackEvent("EmailConfirmed", { email: session.user.email });
    }
  }, [status, session]);

  return <></>;
};
