import SummaryPage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryPage";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const workflowId = params.workflowId;

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

  return (
    <>
      <SummaryPage
        environment={environment}
        workflow={workflow}
        workflowId={params.workflowId}
        webAppUrl={WEBAPP_URL}
        product={product}
        user={user}
        membershipRole={currentUserMembership?.role}
        totalResponseCount={totalResponseCount}
      />
    </>
  );
}
