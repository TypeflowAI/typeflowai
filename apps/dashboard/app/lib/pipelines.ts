import { INTERNAL_SECRET, WEBAPP_URL } from "@typeflowai/lib/constants";
import { TPipelineInput } from "@typeflowai/types/pipelines";

export async function sendToPipeline({ event, workflowId, environmentId, response }: TPipelineInput) {
  return fetch(`${WEBAPP_URL}/api/pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": INTERNAL_SECRET,
    },
    body: JSON.stringify({
      environmentId: environmentId,
      workflowId: workflowId,
      event,
      response,
    }),
  }).catch((error) => {
    console.error(`Error sending event to pipeline: ${error}`);
  });
}
