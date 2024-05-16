import ResponsePage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/responses/components/ResponsePage";
import { notFound } from "next/navigation";

import { RESPONSES_PER_PAGE, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getWorkflow, getWorkflowIdByResultShareKey } from "@typeflowai/lib/workflow/service";

export default async function Page({ params }) {
  const workflowId = await getWorkflowIdByResultShareKey(params.sharingKey);

  if (!workflowId) {
    return notFound();
  }

  const workflow = await getWorkflow(workflowId);

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const environment = await getEnvironment(workflow.environmentId);

  if (!environment) {
    throw new Error("Environment not found");
  }
  const product = await getProductByEnvironmentId(environment.id);
  if (!product) {
    throw new Error("Product not found");
  }

  const tags = await getTagsByEnvironmentId(environment.id);
  const totalResponseCount = await getResponseCountByWorkflowId(workflowId);

  return (
    <>
      <ResponsePage
        environment={environment}
        workflow={workflow}
        workflowId={workflowId}
        webAppUrl={WEBAPP_URL}
        product={product}
        environmentTags={tags}
        responsesPerPage={RESPONSES_PER_PAGE}
        totalResponseCount={totalResponseCount}
      />
    </>
  );
}