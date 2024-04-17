"use client";

import { updateUserAction } from "@/app/(app)/onboarding/actions";
import { typeflowaiEnabled, updateResponse } from "@/app/lib/typeflowai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { env } from "@typeflowai/lib/env.mjs";
import { TUser, TUserObjective } from "@typeflowai/types/user";
import { Button } from "@typeflowai/ui/Button";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

import { handleTabNavigation } from "../utils";

type ObjectiveProps = {
  next: () => void;
  skip: () => void;
  typeflowaiResponseId?: string;
  user: TUser;
};

type ObjectiveChoice = {
  label: string;
  id: TUserObjective;
};

const Objective: React.FC<ObjectiveProps> = ({ next, skip, typeflowaiResponseId, user }) => {
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

  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const onKeyDown = handleTabNavigation(fieldsetRef, setSelectedChoice);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fieldsetRef, setSelectedChoice]);

  const handleNextClick = async () => {
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
        if (typeflowaiEnabled && env.NEXT_PUBLIC_TYPEFLOWAI_ONBOARDING_WORKFLOW_ID && typeflowaiResponseId) {
          const res = await updateResponse(
            typeflowaiResponseId,
            {
              objective: selectedObjective.label,
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
    <div className="flex w-full max-w-xl flex-col gap-8 px-8">
      <div className="px-4">
        <label htmlFor="choices" className="mb-1.5 block text-base font-semibold leading-6 text-slate-900">
          What do you want to achieve?
        </label>
        <label className="block text-sm font-normal leading-6 text-slate-500">
          We have 350+ templates, help us select the best for your need.
        </label>
        <div className="mt-4">
          <fieldset id="choices" aria-label="What do you want to achieve?" ref={fieldsetRef}>
            <legend className="sr-only">Choices</legend>
            <div className=" relative space-y-2 rounded-md">
              {objectives.map((choice) => (
                <label
                  key={choice.id}
                  className={cn(
                    selectedChoice === choice.label
                      ? "z-10 border-slate-400 bg-slate-100"
                      : "border-gray-200",
                    "relative flex cursor-pointer flex-col rounded-md border p-4 hover:bg-slate-100 focus:outline-none"
                  )}>
                  <span className="flex items-center text-sm">
                    <input
                      type="radio"
                      id={choice.id}
                      value={choice.label}
                      checked={choice.label === selectedChoice}
                      className="checked:text-brand-dark  focus:text-brand-dark  h-4 w-4 border border-gray-300 focus:ring-0 focus:ring-offset-0"
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
                    <span id={`${choice.id}-label`} className="ml-3 font-medium">
                      {choice.label}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
      <div className="mb-24 flex justify-between">
        <Button size="lg" className="text-slate-500" variant="minimal" onClick={skip} id="objective-skip">
          Skip
        </Button>
        <Button
          size="lg"
          variant="darkCTA"
          loading={isProfileUpdating}
          disabled={!selectedChoice}
          onClick={handleNextClick}
          id="objective-next">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Objective;
