import { getDisplayCountByWorkflowId } from "@typeflowai/lib/display/service";
import { getResponses } from "@typeflowai/lib/response/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

export const getAnalysisData = async (workflowId: string, environmentId: string) => {
  const [workflow, team, responses, displayCount] = await Promise.all([
    getWorkflow(workflowId),
    getTeamByEnvironmentId(environmentId),
    getResponses(workflowId),
    getDisplayCountByWorkflowId(workflowId),
  ]);
  if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);
  if (!team) throw new Error(`Team not found for environment: ${environmentId}`);
  if (workflow.environmentId !== environmentId) throw new Error(`Workflow not found: ${workflowId}`);
  const responseCount = responses.length;

  return { responses, responseCount, workflow, displayCount };
};
