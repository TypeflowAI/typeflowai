"use client";

import AddNoCodeActionModal from "@/app/(app)/environments/[environmentId]/(actionsAndAttributes)/actions/components/AddActionModal";
import { CheckCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TWorkflow } from "@typeflowai/types/workflows";
import { AdvancedOptionToggle } from "@typeflowai/ui/AdvancedOptionToggle";
import { Badge } from "@typeflowai/ui/Badge";
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

interface WhenToSendCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  environmentId: string;
  actionClasses: TActionClass[];
  membershipRole?: TMembershipRole;
}

export default function WhenToSendCard({
  environmentId,
  localWorkflow,
  setLocalWorkflow,
  actionClasses,
  membershipRole,
}: WhenToSendCardProps) {
  const [open, setOpen] = useState(localWorkflow.type === "web" ? true : false);
  const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [actionClassArray, setActionClassArray] = useState<TActionClass[]>(actionClasses);
  const { isViewer } = getAccessFlags(membershipRole);

  const autoClose = localWorkflow.autoClose !== null;

  const addTriggerEvent = useCallback(() => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.triggers = [...localWorkflow.triggers, ""];
    setLocalWorkflow(updatedWorkflow);
  }, [localWorkflow, setLocalWorkflow]);

  const setTriggerEvent = useCallback(
    (idx: number, actionClassName: string) => {
      const updatedWorkflow = { ...localWorkflow };
      const newActionClass = actionClassArray!.find((actionClass) => {
        return actionClass.name === actionClassName;
      });
      if (!newActionClass) {
        throw new Error("Action class not found");
      }
      updatedWorkflow.triggers[idx] = newActionClass.name;
      setLocalWorkflow(updatedWorkflow);
    },
    [actionClassArray, localWorkflow, setLocalWorkflow]
  );

  const removeTriggerEvent = (idx: number) => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.triggers = [
      ...localWorkflow.triggers.slice(0, idx),
      ...localWorkflow.triggers.slice(idx + 1),
    ];
    setLocalWorkflow(updatedWorkflow);
  };

  const handleCheckMark = () => {
    if (autoClose) {
      const updatedWorkflow = { ...localWorkflow, autoClose: null };
      setLocalWorkflow(updatedWorkflow);
    } else {
      const updatedWorkflow = { ...localWorkflow, autoClose: 10 };
      setLocalWorkflow(updatedWorkflow);
    }
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

  useEffect(() => {
    if (isAddEventModalOpen) return;
    if (activeIndex !== null) {
      const newActionClass = actionClassArray[actionClassArray.length - 1].name;
      const currentActionClass = localWorkflow.triggers[activeIndex];

      if (newActionClass !== currentActionClass) {
        setTriggerEvent(activeIndex, newActionClass);
      }

      setActiveIndex(null);
    }
  }, [actionClassArray, activeIndex, setTriggerEvent, isAddEventModalOpen, localWorkflow.triggers]);

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
          className={cn(
            localWorkflow.type !== "link"
              ? "cursor-pointer hover:bg-slate-50"
              : "cursor-not-allowed bg-slate-50",
            "h-full w-full rounded-lg "
          )}>
          <div className="inline-flex px-4 py-4">
            <div className="flex items-center pl-2 pr-5">
              {!localWorkflow.triggers ||
              localWorkflow.triggers.length === 0 ||
              !localWorkflow.triggers[0] ? (
                <div
                  className={cn(
                    localWorkflow.type !== "link"
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-300 bg-slate-100",
                    "h-7 w-7 rounded-full border "
                  )}
                />
              ) : (
                <CheckCircleIcon
                  className={cn(
                    localWorkflow.type !== "link" ? "text-green-400" : "text-slate-300",
                    "h-8 w-8 "
                  )}
                />
              )}
            </div>

            <div>
              <p className="font-semibold text-slate-800">Workflow Trigger</p>
              <p className="mt-1 text-sm text-slate-500">Choose the actions which trigger the workflow.</p>
            </div>
            {localWorkflow.type === "link" && (
              <div className="flex w-full items-center justify-end pr-2">
                <Badge size="normal" text="In-app workflow settings" type="gray" />
              </div>
            )}
          </div>
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsibleContent className="">
          <hr className="py-1 text-slate-600" />
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
                      {actionClassArray.map((actionClass) => (
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
                  <button onClick={() => removeTriggerEvent(idx)}>
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

          {localWorkflow.type !== "link" && (
            <div className="ml-2 flex items-center space-x-1 px-4 pb-4">
              <label
                htmlFor="triggerDelay"
                className="flex w-full cursor-pointer items-center rounded-lg  border bg-slate-50 p-4">
                <div className="">
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
            </div>
          )}

          <AdvancedOptionToggle
            htmlId="autoClose"
            isChecked={autoClose}
            onToggle={handleCheckMark}
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
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
      <AddNoCodeActionModal
        environmentId={environmentId}
        open={isAddEventModalOpen}
        setOpen={setAddEventModalOpen}
        setActionClassArray={setActionClassArray}
        isViewer={isViewer}
      />
    </>
  );
}
