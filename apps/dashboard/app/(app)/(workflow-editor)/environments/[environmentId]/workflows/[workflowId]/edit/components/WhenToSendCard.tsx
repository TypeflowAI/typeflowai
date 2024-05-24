"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import {
  CheckIcon,
  Code2Icon,
  MousePointerClickIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TWorkflow } from "@typeflowai/types/workflows";
import { AdvancedOptionToggle } from "@typeflowai/ui/AdvancedOptionToggle";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";

import { AddActionModal } from "./AddActionModal";

interface WhenToSendCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
  environmentId: string;
  propActionClasses: TActionClass[];
  membershipRole?: TMembershipRole;
}

export default function WhenToSendCard({
  environmentId,
  localWorkflow,
  setLocalWorkflow,
  propActionClasses,
  membershipRole,
}: WhenToSendCardProps) {
  const [open, setOpen] = useState(
    localWorkflow.type === "app" || localWorkflow.type === "website" ? true : false
  );
  const [isAddActionModalOpen, setAddActionModalOpen] = useState(false);
  const [actionClasses, setActionClasses] = useState<TActionClass[]>(propActionClasses);
  const [randomizerToggle, setRandomizerToggle] = useState(localWorkflow.displayPercentage ? true : false);

  const { isViewer } = getAccessFlags(membershipRole);

  const autoClose = localWorkflow.autoClose !== null;
  const delay = localWorkflow.delay !== 0;

  const handleRemoveTriggerEvent = (idx: number) => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.triggers = [
      ...localWorkflow.triggers.slice(0, idx),
      ...localWorkflow.triggers.slice(idx + 1),
    ];
    setLocalWorkflow(updatedWorkflow);
  };

  const handleAutoCloseToggle = () => {
    if (autoClose) {
      const updatedWorkflow = { ...localWorkflow, autoClose: null };
      setLocalWorkflow(updatedWorkflow);
    } else {
      const updatedWorkflow = { ...localWorkflow, autoClose: 10 };
      setLocalWorkflow(updatedWorkflow);
    }
  };

  const handleDelayToggle = () => {
    if (delay) {
      const updatedWorkflow = { ...localWorkflow, delay: 0 };
      setLocalWorkflow(updatedWorkflow);
    } else {
      const updatedWorkflow = { ...localWorkflow, delay: 5 };
      setLocalWorkflow(updatedWorkflow);
    }
  };

  const handleDisplayPercentageToggle = () => {
    if (localWorkflow.displayPercentage) {
      const updatedWorkflow = { ...localWorkflow, displayPercentage: null };
      setLocalWorkflow(updatedWorkflow);
    } else {
      const updatedWorkflow = { ...localWorkflow, displayPercentage: 50 };
      setLocalWorkflow(updatedWorkflow);
    }
    setRandomizerToggle(!randomizerToggle);
  };

  const handleInputSeconds = (e: any) => {
    let value = parseInt(e.target.value);

    if (value < 1) value = 1;

    const updatedWorkflow = { ...localWorkflow, autoClose: value };
    setLocalWorkflow(updatedWorkflow);
  };

  const handleTriggerDelay = (e: any) => {
    let value = parseInt(e.target.value);
    const updatedWorkflow = { ...localWorkflow, delay: value };
    setLocalWorkflow(updatedWorkflow);
  };

  const handleRandomizerInput = (e) => {
    const updatedWorkflow = { ...localWorkflow, displayPercentage: parseInt(e.target.value) };
    setLocalWorkflow(updatedWorkflow);
  };

  useEffect(() => {
    if (localWorkflow.type === "link") {
      setOpen(false);
    }
  }, [localWorkflow.type]);

  const containsEmptyTriggers = useMemo(() => {
    return !localWorkflow.triggers || !localWorkflow.triggers.length || !localWorkflow.triggers[0];
  }, [localWorkflow]);

  if (localWorkflow.type === "link") {
    return null; // Hide card completely
  }

  return (
    <>
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
          className="h-full w-full cursor-pointer rounded-lg hover:bg-slate-50"
          id="whenToSendCardTrigger">
          <div className="inline-flex px-4 py-4">
            <div className="flex items-center pl-2 pr-5">
              {containsEmptyTriggers ? (
                <div className="h-7 w-7 rounded-full border border-amber-500 bg-amber-50" />
              ) : (
                <CheckIcon
                  strokeWidth={3}
                  className="h-7 w-7 rounded-full border border-green-300 bg-green-100 p-1.5 text-green-600"
                />
              )}
            </div>

            <div>
              <p className="font-semibold text-slate-800">Workflow Trigger</p>
              <p className="mt-1 text-sm text-slate-500">Choose the actions which trigger the workflow.</p>
            </div>
          </div>
        </Collapsible.CollapsibleTrigger>

        <Collapsible.CollapsibleContent>
          <hr className="py-1 text-slate-600" />

          <div className="px-3 pb-3 pt-1">
            <div className="filter-scrollbar flex flex-col gap-4 overflow-auto rounded-lg border border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Trigger workflow when one of the actions is fired...
              </p>

              {localWorkflow.triggers.filter(Boolean).map((trigger, idx) => {
                return (
                  <div className="flex items-center gap-2" key={trigger.actionClass.id}>
                    {idx !== 0 && <p className="ml-1 text-sm font-bold text-slate-700">or</p>}
                    <div
                      key={trigger.actionClass.id}
                      className="flex grow items-center justify-between rounded-md border border-slate-300 bg-white p-2 px-3">
                      <div>
                        <div className="mt-1 flex items-center">
                          <div className="mr-1.5 h-4 w-4 text-slate-600">
                            {trigger.actionClass.type === "code" ? (
                              <Code2Icon className="h-4 w-4" />
                            ) : trigger.actionClass.type === "noCode" ? (
                              <MousePointerClickIcon className="h-4 w-4" />
                            ) : trigger.actionClass.type === "automatic" ? (
                              <SparklesIcon className="h-4 w-4" />
                            ) : null}
                          </div>

                          <h4 className="text-sm font-semibold text-slate-600">{trigger.actionClass.name}</h4>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {trigger.actionClass.description && (
                            <span className="mr-1">{trigger.actionClass.description}</span>
                          )}
                          {trigger.actionClass.type === "code" && (
                            <span className="mr-1 border-l border-slate-400 pl-1 first:border-l-0 first:pl-0">
                              Key: <b>{trigger.actionClass.key}</b>
                            </span>
                          )}
                          {trigger.actionClass.type === "noCode" &&
                            trigger.actionClass.noCodeConfig?.cssSelector && (
                              <span className="mr-1 border-l border-slate-400 pl-1 first:border-l-0 first:pl-0">
                                CSS Selector: <b>{trigger.actionClass.noCodeConfig.cssSelector.value}</b>
                              </span>
                            )}
                          {trigger.actionClass.type === "noCode" &&
                            trigger.actionClass.noCodeConfig?.innerHtml && (
                              <span className="mr-1 border-l border-slate-400 pl-1 first:border-l-0 first:pl-0">
                                Inner Text: <b>{trigger.actionClass.noCodeConfig.innerHtml.value}</b>
                              </span>
                            )}
                          {trigger.actionClass.type === "noCode" &&
                            trigger.actionClass.noCodeConfig?.pageUrl && (
                              <span className="mr-1 border-l border-slate-400 pl-1 first:border-l-0 first:pl-0">
                                URL {trigger.actionClass.noCodeConfig.pageUrl.rule}:{" "}
                                <b>{trigger.actionClass.noCodeConfig.pageUrl.value}</b>
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    <Trash2Icon
                      className="h-4 w-4 cursor-pointer text-slate-600"
                      onClick={() => handleRemoveTriggerEvent(idx)}
                    />
                  </div>
                );
              })}

              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setAddActionModalOpen(true);
                  }}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add action
                </Button>
              </div>
            </div>

            {/* Workflow Display Settings */}
            <div className="mb-4 mt-8 space-y-1 px-4">
              <h3 className="font-semibold text-slate-800">Workflow Display Settings</h3>
              <p className="text-sm text-slate-500">Add a delay or auto-close the workflow</p>
            </div>
            <AdvancedOptionToggle
              htmlId="delay"
              isChecked={delay}
              onToggle={handleDelayToggle}
              title="Add delay before showing workflow"
              description="Wait a few seconds after the trigger before showing the workflow"
              childBorder={true}>
              <label
                htmlFor="triggerDelay"
                className="flex w-full cursor-pointer items-center rounded-lg  border bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Wait
                    <Input
                      type="number"
                      min="0"
                      id="triggerDelay"
                      value={localWorkflow.delay.toString()}
                      onChange={(e) => handleTriggerDelay(e)}
                      className="ml-2 mr-2 inline w-16 bg-white text-center text-sm"
                    />
                    seconds before showing the workflow.
                  </p>
                </div>
              </label>
            </AdvancedOptionToggle>
            <AdvancedOptionToggle
              htmlId="autoClose"
              isChecked={autoClose}
              onToggle={handleAutoCloseToggle}
              title="Auto close on inactivity"
              description="Automatically close the workflow if the user does not respond after certain number of seconds"
              childBorder={true}>
              <label htmlFor="autoCloseSeconds" className="cursor-pointer p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Automatically close workflow after
                  <Input
                    type="number"
                    min="1"
                    id="autoCloseSeconds"
                    value={localWorkflow.autoClose?.toString()}
                    onChange={(e) => handleInputSeconds(e)}
                    className="mx-2 inline w-16 bg-white text-center text-sm"
                  />
                  seconds with no initial interaction.
                </p>
              </label>
            </AdvancedOptionToggle>
            <AdvancedOptionToggle
              htmlId="randomizer"
              isChecked={randomizerToggle}
              onToggle={handleDisplayPercentageToggle}
              title="Show workflow to % of users"
              description="Only display the workflow to a subset of the users"
              childBorder={true}>
              <div className="w-full">
                <div className="flex flex-col justify-center rounded-lg border bg-slate-50 p-6">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">
                    Show to {localWorkflow.displayPercentage}% of targeted users
                  </h3>
                  <input
                    id="small-range"
                    type="range"
                    min="1"
                    max="100"
                    value={localWorkflow.displayPercentage ?? 50}
                    onChange={handleRandomizerInput}
                    className="range-sm mb-6 h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200"
                  />
                </div>
              </div>
            </AdvancedOptionToggle>
          </div>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
      <AddActionModal
        environmentId={environmentId}
        open={isAddActionModalOpen}
        setOpen={setAddActionModalOpen}
        actionClasses={actionClasses}
        setActionClasses={setActionClasses}
        isViewer={isViewer}
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
      />
    </>
  );
}
