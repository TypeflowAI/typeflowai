"use client";

import jsPackageJson from "@/../../packages/js/package.json";
import { finishOnboardingAction } from "@/app/(app)/onboarding/actions";
import { ConnectWithTypeflowAI } from "@/app/(app)/onboarding/components/inapp/ConnectWithTypeflowAI";
import { InviteTeamMate } from "@/app/(app)/onboarding/components/inapp/InviteTeamMate";
import { Objective } from "@/app/(app)/onboarding/components/inapp/WorkflowObjective";
import { Role } from "@/app/(app)/onboarding/components/inapp/WorkflowRole";
import { CreateFirstWorkflow } from "@/app/(app)/onboarding/components/link/CreateFirstWorkflow";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TTeam } from "@typeflowai/types/teams";
import { TUser } from "@typeflowai/types/user";

import PathwaySelect from "./PathwaySelect";
import { OnboardingHeader } from "./ProgressBar";

interface OnboardingProps {
  isTypeflowAICloud: boolean;
  session: Session;
  environment: TEnvironment;
  user: TUser;
  team: TTeam;
  webAppUrl: string;
}

export function Onboarding({
  isTypeflowAICloud,
  session,
  environment,
  user,
  team,
  webAppUrl,
}: OnboardingProps) {
  const router = useRouter();
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(16);
  const [typeflowaiResponseId, setTypeflowAIResponseId] = useState<string | undefined>();
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);
  const [fade, setFade] = useState(false);

  const handleWorkflowCompletion = () => {
    setFade(false);

    setTimeout(() => {
      setIframeVisible(false); // Hide the iframe after fade-out effect is complete
      setCurrentStep(5); // Assuming you want to move to the next step after workflow completion
    }, 1000); // Adjust timeout duration based on your fade-out CSS transition
  };

  const handleMessageEvent = (event: MessageEvent) => {
    if (event.origin !== webAppUrl) return;

    if (event.data === "typeflowaiWorkflowCompleted") {
      handleWorkflowCompletion();
    }
  };

  useEffect(() => {
    if (currentStep === 2 && selectedPathway === "link") {
      setIframeVisible(true);
    } else {
      setIframeVisible(false);
    }
  }, [currentStep, iframeLoaded, selectedPathway]);

  useEffect(() => {
    if (iframeVisible) {
      setFade(true);
      window.addEventListener("message", handleMessageEvent, false);
      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener("message", handleMessageEvent, false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeVisible, currentStep]); // Depend on iframeVisible and currentStep to re-evaluate when needed

  useEffect(() => {
    const pathwayValueFromLocalStorage = localStorage.getItem("onboardingPathway");
    const currentStepValueFromLocalStorage = parseInt(localStorage.getItem("onboardingCurrentStep") ?? "1");

    setSelectedPathway(pathwayValueFromLocalStorage);
    setCurrentStep(currentStepValueFromLocalStorage);
  }, []);

  useEffect(() => {
    if (currentStep) {
      const stepProgressMap = { 1: 16, 2: 50, 3: 65, 4: 75, 5: 90 };
      const newProgress = stepProgressMap[currentStep] || 16;
      setProgress(newProgress);
      localStorage.setItem("onboardingCurrentStep", currentStep.toString());
    }
  }, [currentStep]);

  // Function to render current onboarding step
  const renderOnboardingStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PathwaySelect
            setSelectedPathway={setSelectedPathway}
            setCurrentStep={setCurrentStep}
            isTypeflowAICloud={isTypeflowAICloud}
          />
        );
      case 2:
        return (
          selectedPathway !== "link" && (
            <Role
              setTypeflowAIResponseId={setTypeflowAIResponseId}
              session={session}
              setCurrentStep={setCurrentStep}
            />
          )
        );
      case 3:
        return (
          <Objective
            typeflowaiResponseId={typeflowaiResponseId}
            user={user}
            setCurrentStep={setCurrentStep}
          />
        );
      case 4:
        return (
          <ConnectWithTypeflowAI
            environment={environment}
            webAppUrl={webAppUrl}
            jsPackageVersion={jsPackageJson.version}
            setCurrentStep={setCurrentStep}
          />
        );
      case 5:
        return selectedPathway === "link" ? (
          <CreateFirstWorkflow environmentId={environment.id} />
        ) : (
          <InviteTeamMate environmentId={environment.id} team={team} setCurrentStep={setCurrentStep} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="group flex h-full w-full flex-col items-center bg-slate-50">
      <div className="hidden">
        <button
          id="FB__INTERNAL__SKIP_ONBOARDING"
          onClick={async () => {
            if (typeof localStorage !== undefined) {
              localStorage.removeItem("onboardingPathway");
              localStorage.removeItem("onboardingCurrentStep");
            }
            await finishOnboardingAction();
            router.push(`/environments/${environment.id}/workflows`);
          }}>
          Skip onboarding
        </button>
      </div>

      <OnboardingHeader progress={progress} />
      <div className="mt-20 flex w-full justify-center bg-slate-50">
        {renderOnboardingStep()}
        {iframeVisible && isTypeflowAICloud && (
          <iframe
            src={`https://dashboard.typeflowai.com/s/clr737oiseav88up09skt2hxo?userId=${session.user.id}`}
            onLoad={() => setIframeLoaded(true)}
            style={{
              inset: "0",
              position: "absolute",
              width: "100%",
              height: "100%",
              border: "0",
              zIndex: "40",
              transition: "opacity 1s ease",
              opacity: fade ? "1" : "0", // 1 for fade in, 0 for fade out
            }}></iframe>
        )}
      </div>
    </div>
  );
}
