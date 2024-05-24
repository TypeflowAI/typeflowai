import { WidgetStatusIndicator } from "@/app/(app)/environments/[environmentId]/components/WidgetStatusIndicator";
import { ProductConfigNavigation } from "@/app/(app)/environments/[environmentId]/product/components/ProductConfigNavigation";

// import { getMultiLanguagePermission } from "@typeflowai/ee/lib/service";
import { IS_TYPEFLOWAI_CLOUD, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import EnvironmentNotice from "@typeflowai/ui/EnvironmentNotice";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

import SettingsCard from "../../settings/components/SettingsCard";
import EnvironmentIdField from "./components/EnvironmentIdField";
import SetupInstructions from "./components/SetupInstructions";

export default async function ProfileSettingsPage({ params }) {
  const [environment, team] = await Promise.all([
    getEnvironment(params.environmentId),
    getTeamByEnvironmentId(params.environmentId),
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  // const isMultiLanguageAllowed = await getMultiLanguagePermission(team);
  const isMultiLanguageAllowed = false;

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Configuration">
        <ProductConfigNavigation
          environmentId={params.environmentId}
          activeId="setup"
          isMultiLanguageAllowed={isMultiLanguageAllowed}
        />
      </PageHeader>
      <div className="space-y-4">
        <EnvironmentNotice environmentId={params.environmentId} subPageUrl="/settings/setup" />
        <SettingsCard
          title="Widget Status"
          description="Check if the TypeflowAI widget is alive and kicking.">
          {environment && <WidgetStatusIndicator environment={environment} type="large" />}
        </SettingsCard>
        <SettingsCard
          title="Your EnvironmentId"
          description="This Id uniquely identifies this TypeflowAI environment.">
          <EnvironmentIdField environmentId={params.environmentId} />
        </SettingsCard>
        <SettingsCard
          title="How to setup"
          description="Follow these steps to setup the TypeflowAI widget within your app"
          noPadding>
          <SetupInstructions
            environmentId={params.environmentId}
            webAppUrl={WEBAPP_URL}
            isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
          />
        </SettingsCard>
      </div>
    </PageContentWrapper>
  );
}
