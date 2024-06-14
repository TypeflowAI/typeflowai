import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Clipboard } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@typeflowai/ui/Button";
import { Dialog, DialogContent } from "@typeflowai/ui/Dialog";

interface ShareEmbedWorkflowProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePublish: () => void;
  handleUnpublish: () => void;
  showPublishModal: boolean;
  workflowUrl: string;
}
export const ShareWorkflowResults = ({
  open,
  setOpen,
  handlePublish,
  handleUnpublish,
  showPublishModal,
  workflowUrl,
}: ShareEmbedWorkflowProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}>
      {showPublishModal && workflowUrl ? (
        <DialogContent className="flex flex-col rounded-2xl bg-white px-12 py-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <CheckCircle2Icon className="h-20 w-20 text-slate-300" />
            <div>
              <p className="text-lg font-medium text-slate-600">Your workflow results are public!</p>
              <p className="text-balanced mt-2 text-sm text-slate-500">
                Your workflow results are shared with anyone who has the link. The results will not be indexed
                by search engines.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800">
                <span>{workflowUrl}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                title="Copy workflow link to clipboard"
                aria-label="Copy workflow link to clipboard"
                className="hover:cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(workflowUrl);
                  toast.success("Link copied to clipboard!");
                }}>
                <Clipboard />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant="secondary"
                className=" text-center"
                onClick={() => handleUnpublish()}>
                Unpublish
              </Button>

              <Button variant="darkCTA" className=" text-center" href={workflowUrl} target="_blank">
                View site
              </Button>
            </div>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="flex flex-col rounded-2xl bg-white p-8">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <AlertCircleIcon className="h-20 w-20 text-slate-300" />
            <div>
              <p className="text-lg font-medium text-slate-600">
                You are about to release these workflow results to the public.
              </p>
              <p className="text-balanced mt-2 text-sm text-slate-500">
                Your workflow results will be public. Anyone outside your organization can access them if they
                have the link.
              </p>
            </div>
            <Button
              type="submit"
              variant="darkCTA"
              className="h-full text-center"
              onClick={() => handlePublish()}>
              Publish to public web
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
