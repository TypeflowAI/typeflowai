"use client";

import { CheckCircleIcon, FunnelIcon, PlusIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Alert, AlertDescription, AlertTitle } from "@typeflowai/ui/Alert";
import { Badge } from "@typeflowai/ui/Badge";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";

/*  */

const filterConditions = [
  { id: "equals", name: "equals" },
  { id: "notEquals", name: "not equals" },
];

interface WhoToSendCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  environmentId: string;
  attributeClasses: TAttributeClass[];
}

export default function WhoToSendCard({
  localWorkflow,
  setLocalWorkflow,
  attributeClasses,
}: WhoToSendCardProps) {
  const [open, setOpen] = useState(false);
  const condition = filterConditions[0].id === "equals" ? "equals" : "notEquals";

  useEffect(() => {
    if (localWorkflow.type === "link") {
      setOpen(false);
    }
  }, [localWorkflow.type]);

  const addAttributeFilter = () => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.attributeFilters = [
      ...localWorkflow.attributeFilters,
      { attributeClassId: "", condition: condition, value: "" },
    ];
    setLocalWorkflow(updatedWorkflow);
  };

  const setAttributeFilter = (idx: number, attributeClassId: string, condition: string, value: string) => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.attributeFilters[idx] = {
      attributeClassId,
      condition: condition === "equals" ? "equals" : "notEquals",
      value,
    };
    setLocalWorkflow(updatedWorkflow);
  };

  const removeAttributeFilter = (idx: number) => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.attributeFilters = [
      ...localWorkflow.attributeFilters.slice(0, idx),
      ...localWorkflow.attributeFilters.slice(idx + 1),
    ];
    setLocalWorkflow(updatedWorkflow);
  };

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
          <div className="inline-flex px-4 py-6">
            <div className="flex items-center pl-2 pr-5">
              <CheckCircleIcon
                className={cn(
                  localWorkflow.type !== "link" ? "text-green-400" : "text-slate-300",
                  "h-8 w-8 "
                )}
              />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Target Audience</p>
              <p className="mt-1 text-sm text-slate-500">Pre-segment your users with attributes filters.</p>
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

          <div className="mx-6 mb-4 mt-3">
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>User Identification</AlertTitle>
              <AlertDescription>
                To target your audience you need to identify your users within your app. You can read more
                about how to do this in our{" "}
                <a
                  href="https://typeflowai.com/docs/attributes/identify-users"
                  className="underline"
                  target="_blank">
                  docs
                </a>
                .
              </AlertDescription>
            </Alert>
          </div>

          <div className="mx-6 flex items-center rounded-lg border border-slate-200 p-4 text-slate-800">
            <div>
              {localWorkflow.attributeFilters?.length === 0 ? (
                <UserGroupIcon className="mr-4 h-6 w-6 text-slate-600" />
              ) : (
                <FunnelIcon className="mr-4 h-6 w-6 text-slate-600" />
              )}
            </div>
            <div>
              <p className="">
                Current:{" "}
                <span className="font-semibold text-slate-900">
                  {localWorkflow.attributeFilters?.length === 0 ? "All users" : "Filtered"}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {localWorkflow.attributeFilters?.length === 0
                  ? "All users can see the workflow."
                  : "Only users who match the attribute filter will see the workflow."}
              </p>
            </div>
          </div>

          {localWorkflow.attributeFilters?.map((attributeFilter, idx) => (
            <div className="mt-4 px-5" key={idx}>
              <div className="justify-left flex items-center space-x-3">
                <p className={cn(idx !== 0 && "ml-5", "text-right text-sm")}>{idx === 0 ? "Where" : "and"}</p>
                <Select
                  value={attributeFilter.attributeClassId}
                  onValueChange={(attributeClassId) =>
                    setAttributeFilter(
                      idx,
                      attributeClassId,
                      attributeFilter.condition,
                      attributeFilter.value
                    )
                  }>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {attributeClasses
                      .filter((attributeClass) => !attributeClass.archived)
                      .map((attributeClass) => (
                        <SelectItem value={attributeClass.id}>{attributeClass.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select
                  value={attributeFilter.condition}
                  onValueChange={(condition) =>
                    setAttributeFilter(
                      idx,
                      attributeFilter.attributeClassId,
                      condition,
                      attributeFilter.value
                    )
                  }>
                  <SelectTrigger className="w-[210px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterConditions.map((filterCondition) => (
                      <SelectItem value={filterCondition.id}>{filterCondition.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={attributeFilter.value}
                  onChange={(e) => {
                    e.preventDefault();
                    setAttributeFilter(
                      idx,
                      attributeFilter.attributeClassId,
                      attributeFilter.condition,
                      e.target.value
                    );
                  }}
                />
                <button onClick={() => removeAttributeFilter(idx)}>
                  <TrashIcon className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
          <div className="px-6 py-4">
            <Button
              variant="secondary"
              onClick={() => {
                addAttributeFilter();
              }}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add filter
            </Button>
          </div>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </>
  );
}
