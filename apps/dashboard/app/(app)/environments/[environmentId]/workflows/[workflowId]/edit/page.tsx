import { getServerSession } from "next-auth";

import { getIsEngineLimited } from "@typeflowai/ee/subscription/lib/service";
import { getActionClasses } from "@typeflowai/lib/actionClass/service";
import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { colours } from "@typeflowai/lib/constants";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

import WorkflowEditor from "./components/WorkflowEditor";

export const generateMetadata = async ({ params }) => {
  const workflow = await getWorkflow(params.workflowId);
  return {
    title: workflow?.name ? `${workflow?.name} | Editor` : "Editor",
  };
};

export default async function WorkflowsEditPage({ params }) {
  const [workflow, product, environment, actionClasses, attributeClasses, responseCount, team, session] =
    await Promise.all([
      getWorkflow(params.workflowId),
      getProductByEnvironmentId(params.environmentId),
      getEnvironment(params.environmentId),
      getActionClasses(params.environmentId),
      getAttributeClasses(params.environmentId),
      getResponseCountByWorkflowId(params.workflowId),
      getTeamByEnvironmentId(params.environmentId),
      getServerSession(authOptions),
    ]);

  if (!session) {
    throw new Error("Session not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const [currentUserMembership, isEngineLimited] = await Promise.all([
    getMembershipByUserIdTeamId(session?.user.id, team.id),
    getIsEngineLimited(team),
  ]);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);
  const isWorkflowCreationDeletionDisabled = isViewer;

  if (
    !workflow ||
    !environment ||
    !actionClasses ||
    !attributeClasses ||
    !product ||
    isWorkflowCreationDeletionDisabled
  ) {
    return <ErrorComponent />;
  }

  return (
    <WorkflowEditor
      workflow={workflow}
      product={product}
      environment={environment}
      webAppUrl={WEBAPP_URL}
      actionClasses={actionClasses}
      attributeClasses={attributeClasses}
      responseCount={responseCount}
      membershipRole={currentUserMembership?.role}
      colours={colours}
      isEngineLimited={isEngineLimited}
    />
  );
}
