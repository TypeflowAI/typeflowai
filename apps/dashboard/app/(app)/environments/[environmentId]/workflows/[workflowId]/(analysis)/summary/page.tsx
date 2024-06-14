import { WorkflowAnalysisNavigation } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/WorkflowAnalysisNavigation";
import SummaryPage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryPage";
import { WorkflowAnalysisCTA } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/WorkflowAnalysisCTA";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const workflowId = params.workflowId;

  if (!workflowId) {
    return notFound();
  }

  const [workflow, environment, attributeClasses] = await Promise.all([
    getWorkflow(params.workflowId),
    getEnvironment(params.environmentId),
    getAttributeClasses(params.environmentId),
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const product = await getProductByEnvironmentId(environment.id);
  if (!product) {
    throw new Error("Product not found");
  }

  const user = await getUser(session.user.id);
  if (!user) {
    throw new Error("User not found");
  }

  const team = await getTeamByEnvironmentId(params.environmentId);

  if (!team) {
    throw new Error("Team not found");
  }
  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const totalResponseCount = await getResponseCountByWorkflowId(params.workflowId);

  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  return (
    <PageContentWrapper>
      <PageHeader
        pageTitle={workflow.name}
        cta={
          <WorkflowAnalysisCTA
            environment={environment}
            workflow={workflow}
            isViewer={isViewer}
            webAppUrl={WEBAPP_URL}
            user={user}
          />
        }>
        <WorkflowAnalysisNavigation
          environmentId={environment.id}
          responseCount={totalResponseCount}
          workflowId={workflow.id}
          activeId="summary"
        />
      </PageHeader>
      <SummaryPage
        environment={environment}
        workflow={workflow}
        workflowId={params.workflowId}
        webAppUrl={WEBAPP_URL}
        user={user}
        totalResponseCount={totalResponseCount}
        attributeClasses={attributeClasses}
      />
    </PageContentWrapper>
  );
}
