"use client";

import { updateUserAction } from "@/app/(app)/onboarding/actions";
import { createResponse, typeflowaiEnabled } from "@/app/lib/typeflowai";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { env } from "@typeflowai/lib/env.mjs";
import { Button } from "@typeflowai/ui/Button";
import { trackEvent } from "@typeflowai/ui/PostHogClient";

import { handleTabNavigation } from "../utils";

type RoleProps = {
  next: () => void;
  skip: () => void;
  setTypeflowAIResponseId: (id: string) => void;
  session: Session;
};

type RoleChoice = {
  label: string;
  id:
    | "marketing_specialist"
    | "sales_manager"
    | "startup_founder"
    | "customer_support_specialist"
    | "virtual_assistant"
    | "agency_coordinator"
    | "human_resources_manager"
    | "other";
};

const Role: React.FC<RoleProps> = ({ next, skip, setTypeflowAIResponseId, session }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const onKeyDown = handleTabNavigation(fieldsetRef, setSelectedChoice);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [fieldsetRef, setSelectedChoice]);

  const roles: Array<RoleChoice> = [
    { label: "Marketing Specialist", id: "marketing_specialist" },
    { label: "Sales Manager", id: "sales_manager" },
    { label: "Startup Founder", id: "startup_founder" },
    { label: "Customer Support Specialist", id: "customer_support_specialist" },
    { label: "Virtual Assistant", id: "virtual_assistant" },
    { label: "Agency Coordinator", id: "agency_coordinator" },
    { label: "Human Resources Manager", id: "human_resources_manager" },
    { label: "Other", id: "other" },
  ];

  const handleNextClick = async () => {
    if (selectedChoice) {
      const selectedRole = roles.find((role) => role.label === selectedChoice);
      if (selectedRole) {
        trackEvent("RoleSelected", { role: selectedRole.label });
        try {
          setIsUpdating(true);
          await updateUserAction({ role: selectedRole.id });
          setIsUpdating(false);
        } catch (e) {
          setIsUpdating(false);
          toast.error("An error occured saving your settings");
          console.error(e);
        }
        if (typeflowaiEnabled && env.NEXT_PUBLIC_TYPEFLOWAI_ONBOARDING_WORKFLOW_ID) {
          const res = await createResponse(
            env.NEXT_PUBLIC_TYPEFLOWAI_ONBOARDING_WORKFLOW_ID,
            session.user.id,
            {
              role: selectedRole.label,
            }
          );
          if (res.ok) {
            const response = res.data;
            setTypeflowAIResponseId(response.id);
          } else {
            console.error("Error sending response to TypeflowAI", res.error);
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
          What is your role?
        </label>
        <label className="block text-sm font-normal leading-6 text-slate-500">
          Make your TypeflowAI experience more personalised.
        </label>
        <div className="mt-4">
          <fieldset id="choices" aria-label="What is your role?" ref={fieldsetRef}>
            <legend className="sr-only">Choices</legend>
            <div className=" relative space-y-2 rounded-md">
              {roles.map((choice) => (
                <label
                  key={choice.id}
                  htmlFor={choice.id}
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
                      name="role"
                      checked={choice.label === selectedChoice}
                      className="checked:text-brand-dark  focus:text-brand-dark h-4 w-4 border border-gray-300 focus:ring-0 focus:ring-offset-0"
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
        <Button size="lg" className="text-slate-500" variant="minimal" onClick={skip} id="role-skip">
          Skip
        </Button>
        <Button
          size="lg"
          variant="darkCTA"
          loading={isUpdating}
          disabled={!selectedChoice}
          onClick={handleNextClick}
          id="role-next">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Role;
