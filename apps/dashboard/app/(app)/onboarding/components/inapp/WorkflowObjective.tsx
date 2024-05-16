"use client";

import { updateUserAction } from "@/app/(app)/onboarding/actions";
import OnboardingTitle from "@/app/(app)/onboarding/components/OnboardingTitle";
import { handleTabNavigation } from "@/app/(app)/onboarding/utils";
import { typeflowAIEnabled, updateResponse } from "@/app/lib/typeflowai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { env } from "@typeflowai/lib/env";
import { TUser, TUserObjective } from "@typeflowai/types/user";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

type ObjectiveProps = {
  typeflowaiResponseId?: string;
  user: TUser;
  setCurrentStep: (currentStep: number) => void;
};

type ObjectiveChoice = {
  label: string;
  id: TUserObjective;
};

export const Objective: React.FC<ObjectiveProps> = ({ typeflowaiResponseId, user, setCurrentStep }) => {
  const objectives: Array<ObjectiveChoice> = [
    { label: "Enhance online presence", id: "enhance_online_presence" },
    { label: "Boost engagement and conversion", id: "boost_engagement_and_conversion" },
    { label: "Optimize content and SEO strategy", id: "optimize_content_and_seo_strategy" },
    { label: "Improve business strategy", id: "improve_business_strategy" },
    { label: "Innovate and develop", id: "innovate_and_develop" },
    { label: "Improve customer and employee experience", id: "improve_customer_and_employee_experience" },
    { label: "Streamline operations and sales", id: "streamline_operations_and_sales" },
    { label: "Other", id: "other" },
  ];

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const onKeyDown = handleTabNavigation(fieldsetRef, setSelectedChoice);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fieldsetRef, setSelectedChoice]);

  const next = () => {
    setCurrentStep(4);
    localStorage.setItem("onboardingCurrentStep", "4");
  };

  const handleNextClick = async () => {
    if (selectedChoice === "Other" && otherValue.trim() === "") {
      toast.error("Other value missing");
      return;
    }
    if (selectedChoice) {
      const selectedObjective = objectives.find((objective) => objective.label === selectedChoice);
      if (selectedObjective) {
        try {
          capturePosthogEvent("ObjectiveSelected", { objective: selectedObjective.label });
          setIsProfileUpdating(true);
          await updateUserAction({
            objective: selectedObjective.id,
            name: user.name ?? undefined,
          });
          setIsProfileUpdating(false);
        } catch (e) {
          setIsProfileUpdating(false);
          console.error(e);
          toast.error("An error occured saving your settings");
        }
        if (typeflowAIEnabled && env.NEXT_PUBLIC_TYPEFLOWAI_ONBOARDING_WORKFLOW_ID && typeflowaiResponseId) {
          const res = await updateResponse(
            typeflowaiResponseId,
            {
              objective: selectedObjective.id === "other" ? otherValue : selectedObjective.label,
            },
            true
          );
          if (!res.ok) {
            console.error("Error updating response", res.error);
          }
        }
        next();
      }
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <OnboardingTitle
        title="What do you want to achieve?"
        subtitle="We suggest templates based on your selection."
      />
      <fieldset id="choices" aria-label="What do you want to achieve?" ref={fieldsetRef}>
        <legend className="sr-only">Choices</legend>
        <div className=" relative space-y-2 rounded-md">
          {objectives.map((choice) => (
            <label
              key={choice.id}
              className={cn(
                selectedChoice === choice.label
                  ? "z-10 border-slate-400 bg-slate-100"
                  : "border-slate-200  bg-white hover:bg-slate-50",
                "relative flex cursor-pointer flex-col rounded-md border  p-4 focus:outline-none"
              )}>
              <span className="flex items-center">
                <input
                  type="radio"
                  id={choice.id}
                  value={choice.label}
                  checked={choice.label === selectedChoice}
                  className="checked:text-brand-dark  focus:text-brand-dark  h-4 w-4 border border-slate-300 focus:ring-0 focus:ring-offset-0"
                  aria-labelledby={`${choice.id}-label`}
                  onChange={(e) => {
                    setSelectedChoice(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNextClick();
                    }
                  }}
                />
                <span id={`${choice.id}-label`} className="ml-3 text-sm text-slate-700">
                  {choice.label}
                </span>
              </span>
              {choice.id === "other" && selectedChoice === "Other" && (
                <div className="mt-4 w-full">
                  <Input
                    className="bg-white"
                    autoFocus
                    required
                    placeholder="Please specify"
                    value={otherValue}
                    onChange={(e) => setOtherValue(e.target.value)}
                  />
                </div>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-between">
        <Button className="text-slate-500" variant="minimal" onClick={next} id="objective-skip">
          Skip
        </Button>
        <Button
          variant="darkCTA"
          loading={isProfileUpdating}
          disabled={!selectedChoice}
          onClick={handleNextClick}
          id="onboarding-inapp-objective-next">
          Next
        </Button>
      </div>
    </div>
  );
};
