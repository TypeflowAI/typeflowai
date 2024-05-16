"use client";

import { useEffect, useState } from "react";

import { Button } from "@typeflowai/ui/Button";
import { Confetti } from "@typeflowai/ui/Confetti";
import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";
import { Logo } from "@typeflowai/ui/Logo";

interface ConfirmationPageProps {
  environmentId: string;
}

export default function ConfirmationPage({ environmentId }: ConfirmationPageProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    setShowConfetti(true);
  }, []);
  return (
    <div className="h-full w-full">
      {showConfetti && <Confetti />}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-6 items-center py-8">
        <div className="col-span-2" />
        <div className="col-span-2">
          <Logo className="mx-auto w-1/2" />
        </div>
        <div className="col-span-2" />
      </div>
      <ContentWrapper>
        <div className="mx-auto max-w-sm py-8 sm:px-6 lg:px-8">
          <div className="my-6 sm:flex-auto">
            <h1 className="text-center text-xl font-semibold text-slate-900">Welcome</h1>
            <p className="mt-2 text-center text-sm text-slate-700">
              Thanks a lot for subscribing to TypeflowAI.
            </p>
          </div>
          <Button
            variant="darkCTA"
            className="w-full justify-center"
            href={`/environments/${environmentId}/`}>
            Go to dashboard
          </Button>
        </div>
      </ContentWrapper>
    </div>
  );
}
