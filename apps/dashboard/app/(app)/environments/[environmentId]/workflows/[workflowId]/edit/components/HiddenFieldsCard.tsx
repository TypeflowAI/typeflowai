"use client";

import { validateId } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/lib/validation";
import * as Collapsible from "@radix-ui/react-collapsible";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { TWorkflow, TWorkflowHiddenFields } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";
import { Tag } from "@typeflowai/ui/Tag";

interface HiddenFieldsCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
}

const HiddenFieldsCard: FC<HiddenFieldsCardProps> = ({
  activeQuestionId,
  localWorkflow,
  setActiveQuestionId,
  setLocalWorkflow,
}) => {
  const open = activeQuestionId == "hidden";
  const [hiddenField, setHiddenField] = useState<string>("");

  const setOpen = (open: boolean) => {
    if (open) {
      setActiveQuestionId("hidden");
    } else {
      setActiveQuestionId(null);
    }
  };

  const updateWorkflow = (data: TWorkflowHiddenFields) => {
    setLocalWorkflow({
      ...localWorkflow,
      hiddenFields: {
        ...localWorkflow.hiddenFields,
        ...data,
      },
    });
  };

  return (
    <div
      className={cn(
        open ? "scale-100 shadow-lg " : "scale-97 shadow-md",
        "group z-10 flex flex-row rounded-lg bg-white transition-transform duration-300 ease-in-out"
      )}>
      <div
        className={cn(
          open ? "bg-slate-50" : "bg-white group-hover:bg-slate-50",
          "flex w-10 items-center justify-center rounded-l-lg border-b border-l border-t group-aria-expanded:rounded-bl-none"
        )}>
        <p>🥷</p>
      </div>
      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        className="flex-1 rounded-r-lg border border-slate-200 transition-all duration-300 ease-in-out">
        <Collapsible.CollapsibleTrigger
          asChild
          className="flex cursor-pointer justify-between p-4 hover:bg-slate-50">
          <div>
            <div className="inline-flex">
              <div>
                <p className="text-sm font-semibold">Hidden Fields</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="hidden-fields-toggle">
                {localWorkflow?.hiddenFields?.enabled ? "On" : "Off"}
              </Label>

              <Switch
                id="hidden-fields-toggle"
                checked={localWorkflow?.hiddenFields?.enabled}
                onClick={(e) => {
                  e.stopPropagation();
                  updateWorkflow({ enabled: !localWorkflow.hiddenFields?.enabled });
                }}
              />
            </div>
          </div>
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsibleContent className="px-4 pb-6">
          <div className="flex gap-2">
            {localWorkflow.hiddenFields?.fieldIds && localWorkflow.hiddenFields?.fieldIds?.length > 0 ? (
              localWorkflow.hiddenFields?.fieldIds?.map((question) => {
                return (
                  <Tag
                    key={question}
                    onDelete={() => {
                      updateWorkflow({
                        enabled: true,
                        fieldIds: localWorkflow.hiddenFields?.fieldIds?.filter((q) => q !== question),
                      });
                    }}
                    tagId={question}
                    tagName={question}
                  />
                );
              })
            ) : (
              <p className="mt-2 text-sm italic text-slate-500">
                No hidden fields yet. Add the first one below.
              </p>
            )}
          </div>
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              const existingQuestionIds = localWorkflow.questions.map((question) => question.id);
              const existingHiddenFieldIds = localWorkflow.hiddenFields.fieldIds ?? [];
              if (validateId("Hidden field", hiddenField, existingQuestionIds, existingHiddenFieldIds)) {
                updateWorkflow({
                  fieldIds: [...(localWorkflow.hiddenFields?.fieldIds || []), hiddenField],
                  enabled: true,
                });
                toast.success("Hidden field added successfully");
                setHiddenField("");
              }
            }}>
            <Label htmlFor="headline">Hidden Field</Label>
            <div className="mt-2 flex gap-2">
              <Input
                autoFocus
                id="headline"
                name="headline"
                value={hiddenField}
                onChange={(e) => setHiddenField(e.target.value.trim())}
                placeholder="Type field id..."
              />
              <Button variant="secondary" type="submit" size="sm" className="whitespace-nowrap">
                Add hidden field ID
              </Button>
            </div>
          </form>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
};

export default HiddenFieldsCard;
