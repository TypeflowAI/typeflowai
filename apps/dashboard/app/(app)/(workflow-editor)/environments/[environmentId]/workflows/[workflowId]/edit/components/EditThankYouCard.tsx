"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";
import { Switch } from "@typeflowai/ui/Switch";

interface EditThankYouCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  setActiveQuestionId: (id: string | null) => void;
  activeQuestionId: string | null;
  isInvalid: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
}

export default function EditThankYouCard({
  localWorkflow,
  setLocalWorkflow,
  setActiveQuestionId,
  activeQuestionId,
  isInvalid,
  selectedLanguageCode,
  setSelectedLanguageCode,
}: EditThankYouCardProps) {
  // const [open, setOpen] = useState(false);
  let open = activeQuestionId == "end";
  const [showThankYouCardCTA, setshowThankYouCardCTA] = useState<boolean>(
    getLocalizedValue(localWorkflow.thankYouCard.buttonLabel, "default") ||
      localWorkflow.thankYouCard.buttonLink
      ? true
      : false
  );
  const setOpen = (e) => {
    if (e) {
      setActiveQuestionId("end");
    } else {
      setActiveQuestionId(null);
    }
  };

  const updateWorkflow = (data) => {
    const updatedWorkflow = {
      ...localWorkflow,
      thankYouCard: {
        ...localWorkflow.thankYouCard,
        ...data,
      },
    };
    setLocalWorkflow(updatedWorkflow);
  };

  return (
    <div
      className={cn(
        open ? "scale-100 shadow-lg " : "scale-97 shadow-md",
        "group z-20 flex flex-row rounded-lg bg-white transition-transform duration-300 ease-in-out"
      )}>
      <div
        className={cn(
          open ? "bg-slate-50" : "",
          "flex w-10 items-center justify-center rounded-l-lg border-b border-l border-t group-aria-expanded:rounded-bl-none",
          isInvalid ? "bg-red-400" : "bg-white group-hover:bg-slate-50"
        )}>
        <p>🙏</p>
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
                <p className="text-sm font-semibold">Thank You Card</p>
                {!open && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {localWorkflow?.thankYouCard?.enabled ? "Shown" : "Hidden"}
                  </p>
                )}
              </div>
            </div>

            {localWorkflow.type !== "link" && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="thank-you-toggle">Show</Label>

                <Switch
                  id="thank-you-toggle"
                  checked={localWorkflow?.thankYouCard?.enabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateWorkflow({ enabled: !localWorkflow.thankYouCard?.enabled });
                  }}
                />
              </div>
            )}
          </div>
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsibleContent className="px-4 pb-6">
          <form>
            <QuestionFormInput
              id="headline"
              label="Headline"
              value={localWorkflow?.thankYouCard?.headline}
              localWorkflow={localWorkflow}
              questionIdx={localWorkflow.questions.length}
              isInvalid={isInvalid}
              updateWorkflow={updateWorkflow}
              selectedLanguageCode={selectedLanguageCode}
              setSelectedLanguageCode={setSelectedLanguageCode}
            />

            <QuestionFormInput
              id="subheader"
              value={localWorkflow.thankYouCard.subheader}
              localWorkflow={localWorkflow}
              questionIdx={localWorkflow.questions.length}
              isInvalid={isInvalid}
              updateWorkflow={updateWorkflow}
              selectedLanguageCode={selectedLanguageCode}
              setSelectedLanguageCode={setSelectedLanguageCode}
            />
            <div className="mt-4">
              <div className="flex items-center space-x-1">
                <Switch
                  id="showButton"
                  checked={showThankYouCardCTA}
                  onCheckedChange={() => {
                    if (showThankYouCardCTA) {
                      updateWorkflow({ buttonLabel: undefined, buttonLink: undefined });
                    } else {
                      updateWorkflow({
                        buttonLabel: { default: "Create your own Workflow" },
                        buttonLink: "https://typeflowai.com/signup",
                      });
                    }
                    setshowThankYouCardCTA(!showThankYouCardCTA);
                  }}
                />
                <Label htmlFor="showButton" className="cursor-pointer">
                  <div className="ml-2">
                    <h3 className="text-sm font-semibold text-slate-700">Show Button</h3>
                    <p className="text-xs font-normal text-slate-500">
                      Send your respondents to a page of your choice.
                    </p>
                  </div>
                </Label>
              </div>
              {showThankYouCardCTA && (
                <div className="border-1 mt-4 space-y-4 rounded-md border bg-slate-100 p-4 pt-2">
                  <div className="space-y-2">
                    <QuestionFormInput
                      id="buttonLabel"
                      label="Button Label"
                      placeholder="Create your own Workflow"
                      className="bg-white"
                      value={localWorkflow.thankYouCard.buttonLabel}
                      localWorkflow={localWorkflow}
                      questionIdx={localWorkflow.questions.length}
                      isInvalid={isInvalid}
                      updateWorkflow={updateWorkflow}
                      selectedLanguageCode={selectedLanguageCode}
                      setSelectedLanguageCode={setSelectedLanguageCode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Link</Label>
                    <Input
                      id="buttonLink"
                      name="buttonLink"
                      className="bg-white"
                      placeholder="https://typeflowai.com/signup"
                      value={localWorkflow.thankYouCard.buttonLink}
                      onChange={(e) => updateWorkflow({ buttonLink: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
}
