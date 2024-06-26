"use client";

import { typeflowAIEnabled } from "@/app/lib/typeflowai";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import typeflowai from "@typeflowai/js/app";
import { env } from "@typeflowai/lib/env";

type UsageAttributesUpdaterProps = {
  numWorkflows: number;
};

export default function TypeflowAIClient({ session }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initializeFTypeflowAIAndSetupRouteChanges = useCallback(async () => {
    typeflowai.init({
      environmentId: env.NEXT_PUBLIC_TYPEFLOWAI_ENVIRONMENT_ID || "",
      apiHost: env.NEXT_PUBLIC_TYPEFLOWAI_API_HOST || "",
      userId: session.user.id,
    });
    typeflowai.setEmail(session.user.email);

    typeflowai.registerRouteChange();
  }, [session.user.email, session.user.id]);

  useEffect(() => {
    if (typeflowAIEnabled && session?.user && typeflowai) {
      initializeFTypeflowAIAndSetupRouteChanges();
    }
  }, [session, pathname, searchParams, initializeFTypeflowAIAndSetupRouteChanges]);

  return null;
}

const updateUsageAttributes = (numWorkflows) => {
  if (!typeflowAIEnabled) return;

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
