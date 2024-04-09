"use client";

import type { Session } from "next-auth";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

import { env } from "@typeflowai/lib/env.mjs";

const posthogEnabled = env.NEXT_PUBLIC_POSTHOG_API_KEY && env.NEXT_PUBLIC_POSTHOG_API_HOST;

export default function PosthogIdentify({ session }: { session: Session }) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthogEnabled && session.user && posthog) {
      posthog.identify(session.user.id, { name: session.user.name, email: session.user.email });
    }
  }, [session, posthog]);

  return null;
}
