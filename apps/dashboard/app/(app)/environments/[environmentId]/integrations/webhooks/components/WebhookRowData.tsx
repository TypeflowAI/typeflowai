import { capitalizeFirstLetter } from "@typeflowai/lib/strings";
import { timeSinceConditionally } from "@typeflowai/lib/time";
import { TWebhook } from "@typeflowai/types/webhooks";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Badge } from "@typeflowai/ui/Badge";

const renderSelectedWorkflowsText = (webhook: TWebhook, allWorkflows: TWorkflow[]) => {
  if (webhook.workflowIds.length === 0) {
    const allWorkflowNames = allWorkflows.map((workflow) => workflow.name);
    return <p className="text-slate-400">{allWorkflowNames.join(", ")}</p>;
  } else {
    const selectedWorkflowNames = webhook.workflowIds.map((workflowId) => {
      const workflow = allWorkflows.find((workflow) => workflow.id === workflowId);
      return workflow ? workflow.name : "";
    });
    return <p className="text-slate-400">{selectedWorkflowNames.join(", ")}</p>;
  }
};

const renderSelectedTriggersText = (webhook: TWebhook) => {
  if (webhook.triggers.length === 0) {
    return <p className="text-slate-400">No Triggers</p>;
  } else {
    let cleanedTriggers = webhook.triggers.map((trigger) => {
      if (trigger === "responseCreated") {
        return "Response Created";
      } else if (trigger === "responseUpdated") {
        return "Response Updated";
      } else if (trigger === "responseFinished") {
        return "Response Finished";
      } else {
        return trigger;
      }
    });

    return (
      <p className="text-slate-400">
        {cleanedTriggers
          .sort((a, b) => {
            const triggerOrder = {
              "Response Created": 1,
              "Response Updated": 2,
              "Response Finished": 3,
            };

            return triggerOrder[a] - triggerOrder[b];
          })
          .join(", ")}
      </p>
    );
  }
};

export default function WebhookRowData({
  webhook,
  workflows,
}: {
  webhook: TWebhook;
  workflows: TWorkflow[];
}) {
  return (
    <div className="mt-2 grid h-auto grid-cols-12 content-center rounded-lg py-2 hover:bg-slate-100">
      <div className="col-span-3 flex items-center truncate pl-6 text-sm">
        <div className="flex items-center">
          <div className="text-left">
            {webhook.name ? (
              <div className="text-left">
                <div className="font-medium text-slate-900">{webhook.name}</div>
                <div className="text-xs text-slate-400">{webhook.url}</div>
              </div>
            ) : (
              <div className="font-medium text-slate-900">{webhook.url}</div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-1 my-auto text-center text-sm text-slate-800">
        <Badge text={capitalizeFirstLetter(webhook.source) || "User"} type="gray" size="tiny" />
      </div>
      <div className="col-span-4 my-auto text-center text-sm text-slate-800">
        {renderSelectedWorkflowsText(webhook, workflows)}
      </div>
      <div className="col-span-2 my-auto text-center text-sm text-slate-800">
        {renderSelectedTriggersText(webhook)}
      </div>
      <div className="col-span-2 my-auto whitespace-nowrap text-center text-sm text-slate-500">
        {timeSinceConditionally(webhook.createdAt.toString())}
      </div>
      <div className="text-center"></div>
    </div>
  );
}
