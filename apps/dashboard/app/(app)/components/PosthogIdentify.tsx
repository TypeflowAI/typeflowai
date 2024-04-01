"use client";

import { Session } from "@supabase/supabase-js";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

import { env } from "@typeflowai/lib/env.mjs";

const posthogEnabled = env.NEXT_PUBLIC_POSTHOG_API_KEY && env.NEXT_PUBLIC_POSTHOG_API_HOST;

export default function PosthogIdentify({ session, userDetails }: { session: Session; userDetails: any }) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthogEnabled && session.user && posthog) {
      posthog.identify(session.user.id, { name: userDetails.name, email: userDetails.email });
    }
  }, [session, posthog]);

  return null;
}
