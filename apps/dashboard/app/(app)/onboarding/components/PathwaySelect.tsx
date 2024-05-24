import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import InappMockup from "@/images/onboarding-in-app-workflow.png";
import LinkMockup from "@/images/onboarding-link-workflow.webp";
import Image from "next/image";

import { OptionCard } from "@typeflowai/ui/OptionCard";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

interface PathwaySelectProps {
  setSelectedPathway: (pathway: "link" | "website" | null) => void;
  setCurrentStep: (currentStep: number) => void;
  isTypeflowAICloud: boolean;
}

type PathwayOptionType = "link" | "website";

export default function PathwaySelect({
  setSelectedPathway,
  setCurrentStep,
  isTypeflowAICloud,
}: PathwaySelectProps) {
  const handleSelect = async (pathway: PathwayOptionType) => {
    if (pathway === "link") {
      localStorage.setItem("onboardingPathway", "link");
      capturePosthogEvent("PathwaySelected", { workflowType: "link" });
      if (isTypeflowAICloud) {
        setCurrentStep(2);
        localStorage.setItem("onboardingCurrentStep", "2");
      } else {
        setCurrentStep(5);
        localStorage.setItem("onboardingCurrentStep", "5");
      }
    } else {
      localStorage.setItem("onboardingPathway", "website");
      capturePosthogEvent("PathwaySelected", { workflowType: "website" });
      setCurrentStep(2);
      localStorage.setItem("onboardingCurrentStep", "2");
    }
    setSelectedPathway(pathway);
  };

  return (
    <div className="space-y-16 p-6 text-center">
      <OnboardingTitle
        title="How would you like to start?"
        subtitle="You can always use all types of AI tools later on."
      />
      <div className="flex space-x-8">
        <OptionCard
          cssId="onboarding-link-workflow-card"
          size="lg"
          title="Link AI tools"
          description="Create a new AI tool and share a link."
          onSelect={() => {
            handleSelect("link");
          }}>
          <Image src={LinkMockup} alt="" height={350} />
        </OptionCard>
        <OptionCard
          cssId="onboarding-website-workflow-card"
          size="lg"
          title="Website AI tools"
          description="Run a AI tool on a website."
          onSelect={() => {
            handleSelect("website");
          }}>
          <Image src={InappMockup} alt="" height={350} />
        </OptionCard>
      </div>
    </div>
  );
}
