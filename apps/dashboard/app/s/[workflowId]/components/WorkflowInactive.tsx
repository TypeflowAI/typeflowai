import { CheckCircle2Icon, HelpCircleIcon, PauseCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TWorkflowClosedMessage } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";

import footerLogo from "../lib/footerlogo.svg";

const WorkflowInactive = ({
  status,
  workflowClosedMessage,
}: {
  status: "paused" | "completed" | "link invalid" | "scheduled";
  workflowClosedMessage?: TWorkflowClosedMessage | null;
}) => {
  const icons = {
    paused: <PauseCircleIcon className="h-20 w-20" />,
    completed: <CheckCircle2Icon className="h-20 w-20" />,
    "link invalid": <HelpCircleIcon className="h-20 w-20" />,
  };

  const descriptions = {
    paused: "This free & open-source workflow is temporarily paused.",
    completed: "This free & open-source workflow has been closed.",
    "link invalid": "This workflow can only be taken by invitation.",
  };

  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-br from-slate-200 to-slate-50 py-8 text-center">
      <div></div>
      <div className="flex flex-col items-center space-y-3 text-slate-300">
        {icons[status]}
        <h1 className="text-4xl font-bold text-slate-800">
          {status === "completed" && workflowClosedMessage
            ? workflowClosedMessage.heading
            : `Workflow ${status}.`}
        </h1>
        <p className="text-lg leading-10 text-slate-500">
          {status === "completed" && workflowClosedMessage
            ? workflowClosedMessage.subheading
            : descriptions[status]}
        </p>
        {!(status === "completed" && workflowClosedMessage) && status !== "link invalid" && (
          <Button variant="darkCTA" className="mt-2" href="https://typeflowai.com">
            Create your own
          </Button>
        )}
      </div>
      <div>
        <Link href="https://typeflowai.com">
          <Image src={footerLogo} alt="Brand logo" className="mx-auto w-40" />
        </Link>
      </div>
    </div>
  );
};

export default WorkflowInactive;
