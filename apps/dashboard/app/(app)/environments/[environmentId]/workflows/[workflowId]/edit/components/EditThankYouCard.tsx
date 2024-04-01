"use client";

import * as Collapsible from "@radix-ui/react-collapsible";

import { cn } from "@typeflowai/lib/cn";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";

interface EditThankYouCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  setActiveQuestionId: (id: string | null) => void;
  activeQuestionId: string | null;
}

export default function EditThankYouCard({
  localWorkflow,
  setLocalWorkflow,
  setActiveQuestionId,
  activeQuestionId,
}: EditThankYouCardProps) {
  // const [open, setOpen] = useState(false);
  let open = activeQuestionId == "end";
  const setOpen = (e) => {
    if (e) {
      setActiveQuestionId("end");
    } else {
      setActiveQuestionId(null);
    }
  };

  const updateWorkflow = (data) => {
    setLocalWorkflow({
      ...localWorkflow,
      thankYouCard: {
        ...localWorkflow.thankYouCard,
        ...data,
      },
    });
  };

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
            <div className="mt-3">
              <Label htmlFor="headline">Headline</Label>
              <div className="mt-2">
                <Input
                  id="headline"
                  name="headline"
                  defaultValue={localWorkflow?.thankYouCard?.headline}
                  onChange={(e) => {
                    updateWorkflow({ headline: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <Label htmlFor="subheader">Description</Label>
              <div className="mt-2">
                <Input
                  id="subheader"
                  name="subheader"
                  defaultValue={localWorkflow?.thankYouCard?.subheader}
                  onChange={(e) => {
                    updateWorkflow({ subheader: e.target.value });
                  }}
                />
              </div>
            </div>
          </form>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
}
