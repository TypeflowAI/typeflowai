import { getServerSession } from "next-auth";

import { getIsEngineLimited } from "@typeflowai/ee/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

import TemplateContainerWithPreview from "./TemplateContainer";

export default async function WorkflowTemplatesPage({ params }) {
  const session = await getServerSession(authOptions);

  const environmentId = params.environmentId;

  const [environment, product, team] = await Promise.all([
    getEnvironment(environmentId),
    getProductByEnvironmentId(environmentId),
    getTeamByEnvironmentId(environmentId),
  ]);

  if (!session) {
    throw new Error("Session not found");
  }

  if (!product) {
    throw new Error("Product not found");
  }

  if (!environment) {
    throw new Error("Environment not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const isEngineLimited = await getIsEngineLimited(team);

  return (
    <TemplateContainerWithPreview
      environmentId={environmentId}
      user={session.user}
      environment={environment}
      product={product}
      webAppUrl={WEBAPP_URL}
      isEngineLimited={isEngineLimited}
    />
  );
}
