import { ProductConfigNavigation } from "@/app/(app)/environments/[environmentId]/product/components/ProductConfigNavigation";
import { EditLogo } from "@/app/(app)/environments/[environmentId]/product/look/components/EditLogo";
import { getServerSession } from "next-auth";

import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { UNSPLASH_ACCESS_KEY, WEBAPP_URL, WORKFLOW_BG_COLORS } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

import SettingsCard from "../../settings/components/SettingsCard";
import { EditTypeflowAIBranding } from "./components/EditBranding";
import { EditPlacement } from "./components/EditPlacement";
import { ThemeStyling } from "./components/ThemeStyling";

export default async function ProfileSettingsPage({ params }: { params: { environmentId: string } }) {
  const [session, team, product] = await Promise.all([
    getServerSession(authOptions),
    getTeamByEnvironmentId(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
  ]);

  if (!product) {
    throw new Error("Product not found");
  }
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!team) {
    throw new Error("Team not found");
  }

  const canRemoveInAppBranding = await getIsPaidSubscription(team);
  const canRemoveLinkBranding = await getIsPaidSubscription(team);

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  if (isViewer) {
    return <ErrorComponent />;
  }

  // const isMultiLanguageAllowed = await getMultiLanguagePermission(team);
  const isMultiLanguageAllowed = false;

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Configuration">
        <ProductConfigNavigation
          environmentId={params.environmentId}
          activeId="look"
          isMultiLanguageAllowed={isMultiLanguageAllowed}
        />
      </PageHeader>
      <SettingsCard
        title="Theme"
        className="max-w-7xl"
        description="Create a style theme for all workflows. You can enable custom styling for each workflow.">
        <ThemeStyling
          environmentId={params.environmentId}
          product={product}
          webAppUrl={WEBAPP_URL}
          colors={WORKFLOW_BG_COLORS}
          isUnsplashConfigured={UNSPLASH_ACCESS_KEY ? true : false}
        />
      </SettingsCard>
      <SettingsCard title="Logo" description="Upload your company logo to brand workflows and link previews.">
        <EditLogo product={product} environmentId={params.environmentId} isViewer={isViewer} />
      </SettingsCard>
      <SettingsCard
        title="In-app Workflow Placement"
        description="Change where workflows will be shown in your web app.">
        <EditPlacement product={product} environmentId={params.environmentId} />
      </SettingsCard>
      <SettingsCard
        title="TypeflowAI Branding"
        description="We love your support but understand if you toggle it off.">
        <EditTypeflowAIBranding
          type="linkWorkflow"
          product={product}
          canRemoveBranding={canRemoveLinkBranding}
          environmentId={params.environmentId}
        />
        <EditTypeflowAIBranding
          type="inAppWorkflow"
          product={product}
          canRemoveBranding={canRemoveInAppBranding}
          environmentId={params.environmentId}
        />
      </SettingsCard>
    </PageContentWrapper>
  );
}
