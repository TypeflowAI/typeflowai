"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { usePathname } from "next/navigation";

// import { useState } from "react";
// import { LocalizedEditor } from "@typeflowai/ee/multiLanguage/components/LocalizedEditor";
import { cn } from "@typeflowai/lib/cn";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TWorkflow } from "@typeflowai/types/workflows";
import { FileInput } from "@typeflowai/ui/FileInput";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";
import { Switch } from "@typeflowai/ui/Switch";

interface EditWelcomeCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  setActiveQuestionId: (id: string | null) => void;
  activeQuestionId: string | null;
  isInvalid: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  attributeClasses: TAttributeClass[];
}

export default function EditWelcomeCard({
  localWorkflow,
  setLocalWorkflow,
  setActiveQuestionId,
  activeQuestionId,
  isInvalid,
  selectedLanguageCode,
  setSelectedLanguageCode,
  attributeClasses,
}: EditWelcomeCardProps) {
  // const [firstRender, setFirstRender] = useState(true);
  const path = usePathname();
  const environmentId = path?.split("/environments/")[1]?.split("/")[0];

  let open = activeQuestionId == "start";

  const setOpen = (e) => {
    if (e) {
      setActiveQuestionId("start");
      // setFirstRender(true);
    } else {
      setActiveQuestionId(null);
    }
  };

  const updateWorkflow = (data: Partial<TWorkflow["welcomeCard"]>) => {
    setLocalWorkflow({
      ...localWorkflow,
      welcomeCard: {
        ...localWorkflow.welcomeCard,
        ...data,
      },
    });
  };

  return (
    <div
      className={cn(
        open ? "scale-100 shadow-lg " : "scale-97 shadow-md",
        "group flex flex-row rounded-lg bg-white transition-transform duration-300 ease-in-out"
      )}>
      <div
        className={cn(
          open ? "bg-slate-50" : "",
          "flex w-10 items-center justify-center rounded-l-lg border-b border-l border-t group-aria-expanded:rounded-bl-none",
          isInvalid ? "bg-red-400" : "bg-white group-hover:bg-slate-50"
        )}>
        <p>✋</p>
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
                <p className="text-sm font-semibold">Welcome Card</p>
                {!open && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {localWorkflow?.welcomeCard?.enabled ? "Shown" : "Hidden"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="welcome-toggle">{localWorkflow?.welcomeCard?.enabled ? "On" : "Off"}</Label>

              <Switch
                id="welcome-toggle"
                checked={localWorkflow?.welcomeCard?.enabled}
                onClick={(e) => {
                  e.stopPropagation();
                  updateWorkflow({ enabled: !localWorkflow.welcomeCard?.enabled });
                }}
              />
            </div>
          </div>
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsibleContent className="px-4 pb-6">
          <form>
            <div className="mt-2">
              <Label htmlFor="companyLogo">Company Logo</Label>
            </div>
            <div className="mt-3 flex w-full items-center justify-center">
              <FileInput
                id="welcome-card-image"
                allowedFileExtensions={["png", "jpeg", "jpg"]}
                environmentId={environmentId}
                onFileUpload={(url: string[]) => {
                  updateWorkflow({ fileUrl: url[0] });
                }}
                fileUrl={localWorkflow?.welcomeCard?.fileUrl}
              />
            </div>
            <div className="mt-3">
              <QuestionFormInput
                id="headline"
                value={localWorkflow.welcomeCard.headline}
                label="Note*"
                localWorkflow={localWorkflow}
                questionIdx={-1}
                isInvalid={isInvalid}
                updateWorkflow={updateWorkflow}
                selectedLanguageCode={selectedLanguageCode}
                setSelectedLanguageCode={setSelectedLanguageCode}
                attributeClasses={attributeClasses}
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="subheader">Welcome Message</Label>
              <div className="mt-2">
                {/* <LocalizedEditor
                  id="html"
                  value={localWorkflow.welcomeCard.html}
                  localWorkflow={localWorkflow}
                  isInvalid={isInvalid}
                  updateQuestion={updateWorkflow}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  firstRender={firstRender}
                  setFirstRender={setFirstRender}
                  questionIdx={-1}
                /> */}
              </div>
            </div>

            <div className="mt-3 flex justify-between gap-8">
              <div className="flex w-full space-x-2">
                <div className="w-full">
                  <QuestionFormInput
                    id="buttonLabel"
                    value={localWorkflow.welcomeCard.buttonLabel}
                    label={`"Next" Button Label`}
                    localWorkflow={localWorkflow}
                    questionIdx={-1}
                    maxLength={48}
                    placeholder={"Next"}
                    isInvalid={isInvalid}
                    updateWorkflow={updateWorkflow}
                    selectedLanguageCode={selectedLanguageCode}
                    setSelectedLanguageCode={setSelectedLanguageCode}
                    attributeClasses={attributeClasses}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center">
              <div className="mr-2">
                <Switch
                  id="timeToFinish"
                  name="timeToFinish"
                  checked={localWorkflow?.welcomeCard?.timeToFinish}
                  onCheckedChange={() =>
                    updateWorkflow({ timeToFinish: !localWorkflow.welcomeCard.timeToFinish })
                  }
                />
              </div>
              <div className="flex-column">
                <Label htmlFor="timeToFinish">Time to Finish</Label>
                <div className="text-sm text-slate-500">
                  Display an estimate of completion time for workflow
                </div>
              </div>
            </div>
            {localWorkflow?.type === "link" && (
              <div className="mt-6 flex items-center">
                <div className="mr-2">
                  <Switch
                    id="showResponseCount"
                    name="showResponseCount"
                    checked={localWorkflow?.welcomeCard?.showResponseCount}
                    onCheckedChange={() =>
                      updateWorkflow({ showResponseCount: !localWorkflow.welcomeCard.showResponseCount })
                    }
                  />
                </div>
                <div className="flex-column">
                  <Label htmlFor="showResponseCount">Show Response Count</Label>
                  <div className="text-sm text-slate-500">Display number of responses for workflow</div>
                </div>
              </div>
            )}
          </form>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
}
