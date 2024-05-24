"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { TWorkflow } from "@typeflowai/types/workflows";
import { AdvancedOptionToggle } from "@typeflowai/ui/AdvancedOptionToggle";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { RadioGroup, RadioGroupItem } from "@typeflowai/ui/RadioGroup";

interface DisplayOption {
  id: "displayOnce" | "displayMultiple" | "respondMultiple";
  name: string;
  description: string;
}

const displayOptions: DisplayOption[] = [
  {
    id: "displayOnce",
    name: "Show only once",
    description: "The workflow will be shown once, even if person doesn't respond.",
  },
  {
    id: "displayMultiple",
    name: "Until they submit a response",
    description: "If you really want that answer, ask until you get it.",
  },
  {
    id: "respondMultiple",
    name: "Keep showing while conditions match",
    description: "Even after they submitted a response (e.g. Feedback Box)",
  },
];

interface RecontactOptionsCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  environmentId: string;
}

export default function RecontactOptionsCard({
  localWorkflow,
  setLocalWorkflow,
  environmentId,
}: RecontactOptionsCardProps) {
  const [open, setOpen] = useState(false);
  const ignoreWaiting = localWorkflow.recontactDays !== null;
  const [inputDays, setInputDays] = useState(
    localWorkflow.recontactDays !== null ? localWorkflow.recontactDays : 1
  );

  const handleCheckMark = () => {
    if (ignoreWaiting) {
      const updatedWorkflow = { ...localWorkflow, recontactDays: null };
      setLocalWorkflow(updatedWorkflow);
    } else {
      const updatedWorkflow = { ...localWorkflow, recontactDays: 0 };
      setLocalWorkflow(updatedWorkflow);
    }
  };

  const handleRecontactDaysChange = (event) => {
    const value = Number(event.target.value);
    setInputDays(value);

    const updatedWorkflow = { ...localWorkflow, recontactDays: value };
    setLocalWorkflow(updatedWorkflow);
  };

  useEffect(() => {
    if (localWorkflow.type === "link") {
      setOpen(false);
    }
  }, [localWorkflow.type]);

  if (localWorkflow.type === "link") {
    return null; // Hide card completely
  }

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(openState) => {
        if (localWorkflow.type !== "link") {
          setOpen(openState);
        }
      }}
      className="w-full rounded-lg border border-slate-300 bg-white">
      <Collapsible.CollapsibleTrigger
        asChild
        className="h-full w-full cursor-pointer rounded-lg hover:bg-slate-50">
        <div className="inline-flex px-4 py-4">
          <div className="flex items-center pl-2 pr-5">
            <CheckIcon
              strokeWidth={3}
              className="h-7 w-7 rounded-full border border-green-300 bg-green-100 p-1.5 text-green-600"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Recontact Options</p>
            <p className="mt-1 text-sm text-slate-500">Decide how often people can answer this workflow.</p>
          </div>
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent className="pb-3">
        <hr className="py-1 text-slate-600" />
        <div className="p-3">
          <RadioGroup
            value={localWorkflow.displayOption}
            className="flex flex-col space-y-3"
            onValueChange={(v) => {
              if (v === "displayOnce" || v === "displayMultiple" || v === "respondMultiple") {
                const updatedWorkflow: TWorkflow = { ...localWorkflow, displayOption: v };
                setLocalWorkflow(updatedWorkflow);
              }
            }}>
            {displayOptions.map((option) => (
              <Label
                key={option.name}
                htmlFor={option.name}
                className="flex w-full cursor-pointer items-center rounded-lg border bg-slate-50 p-4">
                <RadioGroupItem
                  value={option.id}
                  id={option.name}
                  className="aria-checked:border-brand-dark  mx-5 disabled:border-slate-400 aria-checked:border-2"
                />
                <div>
                  <p className="font-semibold text-slate-700">{option.name}</p>

                  <p className="mt-2 text-xs font-normal text-slate-600">{option.description}</p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <AdvancedOptionToggle
          htmlId="recontactDays"
          isChecked={ignoreWaiting}
          onToggle={handleCheckMark}
          title="Ignore waiting time between workflows"
          childBorder={false}
          description={
            <>
              This setting overwrites your{" "}
              <Link
                className="decoration-brand-dark underline"
                href={`/environments/${environmentId}/product/general`}
                target="_blank">
                waiting period
              </Link>
              . Use with caution.
            </>
          }>
          {localWorkflow.recontactDays !== null && (
            <RadioGroup
              value={localWorkflow.recontactDays.toString()}
              className="flex w-full flex-col space-y-3 bg-white"
              onValueChange={(v) => {
                const updatedWorkflow = { ...localWorkflow, recontactDays: v === "null" ? null : Number(v) };
                setLocalWorkflow(updatedWorkflow);
              }}>
              <Label
                htmlFor="ignore"
                className="flex w-full cursor-pointer items-center rounded-lg border bg-slate-50 p-4">
                <RadioGroupItem
                  value="0"
                  id="ignore"
                  className="aria-checked:border-brand-dark mx-4 text-sm disabled:border-slate-400 aria-checked:border-2"
                />
                <div>
                  <p className="font-semibold text-slate-700">Always show workflow</p>

                  <p className="mt-2 text-xs font-normal text-slate-600">
                    When conditions match, waiting time will be ignored and workflow shown.
                  </p>
                </div>
              </Label>

              <label
                htmlFor="newDays"
                className="flex w-full cursor-pointer items-center rounded-lg border bg-slate-50 p-4">
                <RadioGroupItem
                  value={inputDays === 0 ? "1" : inputDays.toString()} //Fixes that both radio buttons are checked when inputDays is 0
                  id="newDays"
                  className="aria-checked:border-brand-dark mx-4 disabled:border-slate-400 aria-checked:border-2"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Wait
                    <Input
                      type="number"
                      min="1"
                      id="inputDays"
                      value={inputDays === 0 ? 1 : inputDays}
                      onChange={handleRecontactDaysChange}
                      className="ml-2 mr-2 inline w-16 bg-white text-center text-sm"
                    />
                    days before showing this workflow again.
                  </p>

                  <p className="mt-2 text-xs font-normal text-slate-600">
                    Overwrites waiting period between workflows to {inputDays === 0 ? 1 : inputDays} day(s).
                  </p>
                </div>
              </label>
            </RadioGroup>
          )}
        </AdvancedOptionToggle>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
