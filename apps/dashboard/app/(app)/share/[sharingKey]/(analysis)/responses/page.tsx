import { getAnalysisData } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/data";
import ResponsePage from "@/app/(app)/share/[sharingKey]/(analysis)/responses/components/ResponsePage";
import { getResultShareUrlWorkflowAction } from "@/app/(app)/share/[sharingKey]/action";
import { notFound } from "next/navigation";

import { RESPONSES_PER_PAGE, REVALIDATION_INTERVAL, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

export const revalidate = REVALIDATION_INTERVAL;

export default async function Page({ params }) {
  const workflowId = await getResultShareUrlWorkflowAction(params.sharingKey);

  if (!workflowId) {
    return notFound();
  }

  const workflow = await getWorkflow(workflowId);

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const [{ responses }, environment] = await Promise.all([
    getAnalysisData(workflow.id, workflow.environmentId),
    getEnvironment(workflow.environmentId),
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }
  const product = await getProductByEnvironmentId(environment.id);
  if (!product) {
    throw new Error("Product not found");
  }

  const tags = await getTagsByEnvironmentId(environment.id);

  return (
    <>
      <ResponsePage
        environment={environment}
        responses={responses}
        workflow={workflow}
        workflowId={params.workflowId}
        webAppUrl={WEBAPP_URL}
        product={product}
        sharingKey={params.sharingKey}
        environmentTags={tags}
        responsesPerPage={RESPONSES_PER_PAGE}
      />
    </>
  );
}
