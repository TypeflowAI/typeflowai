"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { md } from "@typeflowai/lib/markdownIt";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Editor } from "@typeflowai/ui/Editor";
import FileInput from "@typeflowai/ui/FileInput";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";

interface EditWelcomeCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  setActiveQuestionId: (id: string | null) => void;
  activeQuestionId: string | null;
}

export default function EditWelcomeCard({
  localWorkflow,
  setLocalWorkflow,
  setActiveQuestionId,
  activeQuestionId,
}: EditWelcomeCardProps) {
  const [firstRender, setFirstRender] = useState(true);
  const path = usePathname();
  const environmentId = path?.split("/environments/")[1]?.split("/")[0];
  // const [open, setOpen] = useState(false);
  let open = activeQuestionId == "start";
  const setOpen = (e) => {
    if (e) {
      setActiveQuestionId("start");
    } else {
      setActiveQuestionId(null);
    }
  };

  const updateWorkflow = (data) => {
    setLocalWorkflow({
      ...localWorkflow,
      welcomeCard: {
        ...localWorkflow.welcomeCard,
        ...data,
      },
    });
  };
  useEffect(() => {
    setFirstRender(true);
  }, [activeQuestionId]);

  return (
    <div
      className={cn(
        open ? "scale-100 shadow-lg " : "scale-97 shadow-md",
        "flex flex-row rounded-lg bg-white transition-transform duration-300 ease-in-out"
      )}>
      <div
        className={cn(
          open ? "bg-violet-950" : "bg-slate-400",
          "flex w-10 items-center justify-center rounded-l-lg hover:bg-slate-600 group-aria-expanded:rounded-bl-none"
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
              <Label htmlFor="welcome-toggle">Enabled</Label>

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
                imageFit="contain"
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="headline">Headline</Label>
              <div className="mt-2">
                <Input
                  id="headline"
                  name="headline"
                  defaultValue={localWorkflow?.welcomeCard?.headline}
                  onChange={(e) => {
                    updateWorkflow({ headline: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="subheader">Welcome Message</Label>
              <div className="mt-2">
                <Editor
                  getText={() =>
                    md.render(
                      localWorkflow?.welcomeCard?.html || "Thanks for providing your feedback - let's go!"
                    )
                  }
                  setText={(value: string) => {
                    updateWorkflow({ html: value });
                  }}
                  excludedToolbarItems={["blockType"]}
                  disableLists
                  firstRender={firstRender}
                  setFirstRender={setFirstRender}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-between gap-8">
              <div className="flex w-full space-x-2">
                <div className="w-full">
                  <Label htmlFor="buttonLabel">Button Label</Label>
                  <div className="mt-2">
                    <Input
                      id="buttonLabel"
                      name="buttonLabel"
                      defaultValue={localWorkflow?.welcomeCard?.buttonLabel || "Next"}
                      onChange={(e) => updateWorkflow({ buttonLabel: e.target.value })}
                    />
                  </div>
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
                <Label htmlFor="timeToFinish" className="">
                  Time to Finish
                </Label>
                <div className="text-sm text-gray-500">
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
                  <Label htmlFor="showResponseCount" className="">
                    Show Response Count
                  </Label>
                  <div className="text-sm text-gray-500">Display number of responses for workflow</div>
                </div>
              </div>
            )}
          </form>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
}
