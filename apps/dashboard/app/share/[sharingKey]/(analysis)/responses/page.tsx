import { WorkflowAnalysisNavigation } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/WorkflowAnalysisNavigation";
import ResponsePage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/responses/components/ResponsePage";
import { notFound } from "next/navigation";

import { RESPONSES_PER_PAGE, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getWorkflow, getWorkflowIdByResultShareKey } from "@typeflowai/lib/workflow/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

export default async function Page({ params }) {
  const workflowId = await getWorkflowIdByResultShareKey(params.sharingKey);

  if (!workflowId) {
    return notFound();
  }

  const [workflow, environment, product, tags] = await Promise.all([
    getWorkflow(params.workflowId),
    getEnvironment(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
    getTagsByEnvironmentId(params.environmentId),
  ]);

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (!environment) {
    throw new Error("Environment not found");
  }

  if (!product) {
    throw new Error("Product not found");
  }

  const totalResponseCount = await getResponseCountByWorkflowId(workflowId);

  return (
    <div className="flex w-full justify-center">
      <PageContentWrapper className="w-full">
        <PageHeader pageTitle={workflow.name}>
          <WorkflowAnalysisNavigation
            workflowId={workflow.id}
            environmentId={environment.id}
            activeId="summary"
            responseCount={totalResponseCount}
          />
        </PageHeader>
        <ResponsePage
          environment={environment}
          workflow={workflow}
          workflowId={workflowId}
          webAppUrl={WEBAPP_URL}
          environmentTags={tags}
          responsesPerPage={RESPONSES_PER_PAGE}
          totalResponseCount={totalResponseCount}
        />
      </PageContentWrapper>
    </div>
  );
}
