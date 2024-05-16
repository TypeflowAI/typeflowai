"use client";

import AddNoCodeActionModal from "@/app/(app)/environments/[environmentId]/actions/components/AddActionModal";
import InlineTriggers from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/InlineTriggers";
import * as Collapsible from "@radix-ui/react-collapsible";
import { CheckIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TWorkflow } from "@typeflowai/types/workflows";
import { AdvancedOptionToggle } from "@typeflowai/ui/AdvancedOptionToggle";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@typeflowai/ui/Select";
import { TabBar } from "@typeflowai/ui/TabBar";

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
  const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [actionClasses, setActionClasses] = useState<TActionClass[]>(propActionClasses);
  const [randomizerToggle, setRandomizerToggle] = useState(localWorkflow.displayPercentage ? true : false);

  const [activeTriggerTab, setActiveTriggerTab] = useState(
    !!localWorkflow?.inlineTriggers ? "inline" : "relation"
  );
  const tabs = [
    {
      id: "relation",
      label: "Saved Actions",
    },
    {
      id: "inline",
      label: "Custom Actions",
    },
  ];

  const { isViewer } = getAccessFlags(membershipRole);

  const autoClose = localWorkflow.autoClose !== null;
  const delay = localWorkflow.delay !== 0;

  const addTriggerEvent = useCallback(() => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.triggers = [...localWorkflow.triggers, ""];
    setLocalWorkflow(updatedWorkflow);
  }, [localWorkflow, setLocalWorkflow]);

  const setTriggerEvent = useCallback(
    (idx: number, actionClassName: string) => {
      const updatedWorkflow = { ...localWorkflow };
      const newActionClass = actionClasses!.find((actionClass) => {
        return actionClass.name === actionClassName;
      });
      if (!newActionClass) {
        throw new Error("Action class not found");
      }
      updatedWorkflow.triggers[idx] = newActionClass.name;
      setLocalWorkflow(updatedWorkflow);
    },
    [actionClasses, localWorkflow, setLocalWorkflow]
  );

  const removeTriggerEvent = (idx: number) => {
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
    if (isAddEventModalOpen) return;

    if (activeIndex !== null) {
      const newActionClass = actionClasses[actionClasses.length - 1].name;
      const currentActionClass = localWorkflow.triggers[activeIndex];

      if (newActionClass !== currentActionClass) {
        setTriggerEvent(activeIndex, newActionClass);
      }

      setActiveIndex(null);
    }
  }, [actionClasses, activeIndex, setTriggerEvent, isAddEventModalOpen, localWorkflow.triggers]);

  useEffect(() => {
    if (localWorkflow.type === "link") {
      setOpen(false);
    }
  }, [localWorkflow.type]);

  //create new empty trigger on page load, remove one click for user
  useEffect(() => {
    if (localWorkflow.triggers.length === 0) {
      addTriggerEvent();
    }
  }, [addTriggerEvent, localWorkflow.triggers.length]);

  const containsEmptyTriggers = useMemo(() => {
    const noTriggers =
      !localWorkflow.triggers || !localWorkflow.triggers.length || !localWorkflow.triggers[0];
    const noInlineTriggers =
      !localWorkflow.inlineTriggers ||
      (!localWorkflow.inlineTriggers?.codeConfig && !localWorkflow.inlineTriggers?.noCodeConfig);

    if (noTriggers && noInlineTriggers) {
      return true;
    }

    return false;
  }, [localWorkflow]);

  // for inline triggers, if both the codeConfig and noCodeConfig are empty, we consider it as empty
  useEffect(() => {
    const inlineTriggers = localWorkflow?.inlineTriggers ?? {};
    if (Object.keys(inlineTriggers).length === 0) {
      setLocalWorkflow((prevWorkflow) => {
        return {
          ...prevWorkflow,
          inlineTriggers: null,
        };
      });
    }
  }, [localWorkflow?.inlineTriggers, setLocalWorkflow]);

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
          className="h-full w-full cursor-pointer rounded-lg hover:bg-slate-50">
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
            <div className="flex flex-col overflow-hidden rounded-lg border-2 border-slate-100">
              <TabBar
                tabs={tabs}
                activeId={activeTriggerTab}
                setActiveId={setActiveTriggerTab}
                tabStyle="button"
                className="bg-slate-100"
              />
              <div className="p-3">
                {activeTriggerTab === "inline" ? (
                  <div className="flex flex-col">
                    <InlineTriggers localWorkflow={localWorkflow} setLocalWorkflow={setLocalWorkflow} />
                  </div>
                ) : (
                  <>
                    {!isAddEventModalOpen &&
                      localWorkflow.triggers?.map((triggerEventClass, idx) => (
                        <div className="mt-2" key={idx}>
                          <div className="inline-flex items-center">
                            <p className="mr-2 w-14 text-right text-sm">{idx === 0 ? "When" : "or"}</p>
                            <Select
                              value={triggerEventClass}
                              onValueChange={(actionClassName) => setTriggerEvent(idx, actionClassName)}>
                              <SelectTrigger className="w-[240px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <button
                                  type="button"
                                  className="flex w-full items-center space-x-2 rounded-md p-1 text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-slate-500"
                                  value="none"
                                  onClick={() => {
                                    setAddEventModalOpen(true);
                                    setActiveIndex(idx);
                                  }}>
                                  <PlusIcon className="mr-1 h-5 w-5" />
                                  Add Action
                                </button>
                                <SelectSeparator />
                                {actionClasses.map((actionClass) => (
                                  <SelectItem
                                    value={actionClass.name}
                                    key={actionClass.name}
                                    title={actionClass.description ? actionClass.description : ""}>
                                    {actionClass.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="mx-2 text-sm">action is performed</p>
                            <button type="button" onClick={() => removeTriggerEvent(idx)}>
                              <TrashIcon className="ml-3 h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    <div className="px-6 py-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          addTriggerEvent();
                        }}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add condition
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

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
                    className="range-sm mb-6 h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700"
                  />
                </div>
              </div>
            </AdvancedOptionToggle>
          </div>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
      <AddNoCodeActionModal
        environmentId={environmentId}
        open={isAddEventModalOpen}
        setOpen={setAddEventModalOpen}
        actionClasses={actionClasses}
        setActionClasses={setActionClasses}
        isViewer={isViewer}
      />
    </>
  );
}
