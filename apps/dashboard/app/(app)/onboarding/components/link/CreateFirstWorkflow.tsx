"use client";

import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import BuyerPersonaImage from "@/images/onboarding-buyer-persona.png";
import ColdEmailImage from "@/images/onboarding-cold-email-generator.png";
import LinkedInImage from "@/images/onboarding-linkedin-post-generator.png";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TTeam } from "@typeflowai/types/teams";
import { TTemplate } from "@typeflowai/types/templates";
import { Button } from "@typeflowai/ui/Button";
import { OptionCard } from "@typeflowai/ui/OptionCard";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";
import { customWorkflow, templates } from "@typeflowai/ui/TemplateList/templates";
import { createWorkflowFromTemplate, finishOnboardingAction } from "../../actions";

interface CreateFirstWorkflowProps {
  environmentId: string;
  team: TTeam;
}

export function CreateFirstWorkflow({ environmentId, team }: CreateFirstWorkflowProps) {
  const router = useRouter();
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);
  const templateOrder = ["Buyer Persona Generator", "LinkedIn Post Generator", "Cold Email Generator"];
  const templateImages = {
    "Buyer Persona Generator": BuyerPersonaImage,
    "LinkedIn Post Generator": LinkedInImage,
    "Cold Email Generator": ColdEmailImage,
  };

  const filteredTemplates = templates
    .filter((template) => templateOrder.includes(template.name))
    .sort((a, b) => templateOrder.indexOf(a.name) - templateOrder.indexOf(b.name));

  const newWorkflowFromTemplate = async (template: TTemplate) => {
    setLoadingTemplate(template.name);
    if (typeof localStorage !== undefined) {
      localStorage.removeItem("onboardingPathway");
      localStorage.removeItem("onboardingCurrentStep");
    }
    await finishOnboardingAction(team);
    try {
      const workflow = await createWorkflowFromTemplate(template, environmentId);
      capturePosthogEvent("WorkflowCreated", { isTemplate: true, template: template.name });
      router.push(`/environments/${environmentId}/workflows/${workflow.id}/edit`);
    } catch (e) {
      toast.error("An error occurred creating a new workflow");
    }
  };

  console.log("Pasando por aqui");

  return (
    <div className="flex flex-col items-center space-y-16">
      <OnboardingTitle title="Create your first AI tool" subtitle="Pick a template or start from scratch." />
      <div className="grid w-11/12 max-w-6xl grid-cols-3 grid-rows-1 gap-6">
        {filteredTemplates.map((template) => {
          const TemplateImage = templateImages[template.name];
          const cssId = `onboarding-link-template-${template.name.toLowerCase().replace(/ /g, "-")}`;
          return (
            <OptionCard
              cssId={cssId} // Use the generated cssId here
              size="md"
              key={template.name}
              title={template.name}
              description={template.description}
              onSelect={() => newWorkflowFromTemplate(template)}
              loading={loadingTemplate === template.name}>
              <Image src={TemplateImage} alt={template.name} className="rounded-md border border-slate-300" />
            </OptionCard>
          );
        })}
      </div>

      <Button
        id="onboarding-start-from-scratch"
        size="lg"
        variant="secondary"
        loading={loadingTemplate === "Start from scratch"}
        onClick={() => {
          newWorkflowFromTemplate(customWorkflow);
        }}>
        Start from scratch <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
