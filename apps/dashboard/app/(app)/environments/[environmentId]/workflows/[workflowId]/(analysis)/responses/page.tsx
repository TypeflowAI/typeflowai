import { getAnalysisData } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/data";
import ResponsePage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/responses/components/ResponsePage";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { RESPONSES_PER_PAGE, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponses } from "@typeflowai/lib/response/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }
  const [responses, workflow, environment] = await Promise.all([
    getResponses(params.workflowId, 1),
    getWorkflow(params.workflowId),
    getEnvironment(params.environmentId),
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
  const tags = await getTagsByEnvironmentId(params.environmentId);
  const team = await getTeamByEnvironmentId(params.environmentId);
  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);

  return (
    <>
      <div className="lg:ml-64">
        <ResponsePage
          environment={environment}
          responses={responses}
          workflow={workflow}
          workflowId={params.workflowId}
          webAppUrl={WEBAPP_URL}
          product={product}
          environmentTags={tags}
          user={user}
          responsesPerPage={RESPONSES_PER_PAGE}
          membershipRole={currentUserMembership?.role}
        />
      </div>
    </>
  );
}
