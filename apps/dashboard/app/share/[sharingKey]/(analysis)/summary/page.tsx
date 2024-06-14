import { WorkflowAnalysisNavigation } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/WorkflowAnalysisNavigation";
import SummaryPage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryPage";
import { notFound } from "next/navigation";

import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getWorkflow, getWorkflowIdByResultShareKey } from "@typeflowai/lib/workflow/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

export default async function Page({ params }) {
  const workflowId = await getWorkflowIdByResultShareKey(params.sharingKey);

  if (!workflowId) {
    return notFound();
  }

  const [workflow, environment, attributeClasses, product] = await Promise.all([
    getWorkflow(params.workflowId),
    getEnvironment(params.environmentId),
    getAttributeClasses(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
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
        <SummaryPage
          environment={environment}
          workflow={workflow}
          workflowId={workflow.id}
          webAppUrl={WEBAPP_URL}
          totalResponseCount={totalResponseCount}
          attributeClasses={attributeClasses}
        />
      </PageContentWrapper>
    </div>
  );
}
