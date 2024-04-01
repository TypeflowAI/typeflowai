"use client";

import { typeflowaiEnabled } from "@/app/lib/typeflowai";
import { useEffect } from "react";

import typeflowai from "@typeflowai/js";
import { env } from "@typeflowai/lib/env.mjs";

type UsageAttributesUpdaterProps = {
  numWorkflows: number;
};

export default function TypeflowAIClient({ session }) {
  useEffect(() => {
    if (typeflowaiEnabled && session?.user && typeflowai) {
      typeflowai.init({
        environmentId: env.NEXT_PUBLIC_TYPEFLOWAI_ENVIRONMENT_ID || "",
        apiHost: env.NEXT_PUBLIC_TYPEFLOWAI_API_HOST || "",
        userId: session.user.id,
      });
      typeflowai.setEmail(session.user.email);
    }
  }, [session]);
  return null;
}

const updateUsageAttributes = (numWorkflows) => {
  if (!typeflowaiEnabled) return;

  if (numWorkflows >= 3) {
    typeflowai.setAttribute("HasThreeWorkflows", "true");
  }
};

export function UsageAttributesUpdater({ numWorkflows }: UsageAttributesUpdaterProps) {
  useEffect(() => {
    updateUsageAttributes(numWorkflows);
  }, [numWorkflows]);

  return null;
}
