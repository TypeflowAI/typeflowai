import WidgetStatusIndicator from "@/app/(app)/environments/[environmentId]/components/WidgetStatusIndicator";
import WorkflowStarter from "@/app/(app)/environments/[environmentId]/workflows/components/WorkflowStarter";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { getIsEngineLimited } from "@typeflowai/ee/subscription/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { WEBAPP_URL, WORKFLOWS_PER_PAGE } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getEnvironments } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflowCount } from "@typeflowai/lib/workflow/service";
import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";
import { WorkflowsList } from "@typeflowai/ui/WorkflowsList";

export const metadata: Metadata = {
  title: "Your Workflows",
};

export default async function WorkflowsPage({ params }) {
  const session = await getServerSession(authOptions);
  const product = await getProductByEnvironmentId(params.environmentId);
  const team = await getTeamByEnvironmentId(params.environmentId);
  if (!session) {
    throw new Error("Session not found");
  }

  if (!product) {
    throw new Error("Product not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  const environment = await getEnvironment(params.environmentId);
  if (!environment) {
    throw new Error("Environment not found");
  }

  const isEngineLimited = await getIsEngineLimited(team);

  const workflowCount = await getWorkflowCount(params.environmentId);

  const environments = await getEnvironments(product.id);
  const otherEnvironment = environments.find((e) => e.type !== environment.type)!;

  return (
    <ContentWrapper className="flex h-full flex-col justify-between">
      {workflowCount > 0 ? (
        <WorkflowsList
          environment={environment}
          otherEnvironment={otherEnvironment}
          isViewer={isViewer}
          WEBAPP_URL={WEBAPP_URL}
          userId={session.user.id}
          workflowsPerPage={WORKFLOWS_PER_PAGE}
        />
      ) : (
        <WorkflowStarter
          environmentId={params.environmentId}
          environment={environment}
          product={product}
          user={session.user}
          isEngineLimited={isEngineLimited}
        />
      )}

      <WidgetStatusIndicator environmentId={params.environmentId} type="mini" />
    </ContentWrapper>
  );
}
