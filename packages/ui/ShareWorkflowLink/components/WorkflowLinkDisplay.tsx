import { Input } from "../../Input";

interface WorkflowLinkDisplayProps {
  workflowUrl: string;
}

export const WorkflowLinkDisplay = ({ workflowUrl }: WorkflowLinkDisplayProps) => {
  return (
    <Input
      autoFocus={true}
      className="mt-2 w-96 overflow-hidden text-ellipsis rounded-lg border bg-slate-50 px-3 py-2 text-center text-slate-800 caret-transparent"
      value={workflowUrl}
    />
  );
};
