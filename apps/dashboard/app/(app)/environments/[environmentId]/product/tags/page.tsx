import { ProductConfigNavigation } from "@/app/(app)/environments/[environmentId]/product/components/ProductConfigNavigation";
import { SettingsCard } from "@/app/(app)/environments/[environmentId]/settings/components/SettingsCard";
import { getServerSession } from "next-auth";
// import { getMultiLanguagePermission } from "@typeflowai/ee/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getTagsOnResponsesCount } from "@typeflowai/lib/tagOnResponse/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";
import EditTagsWrapper from "./components/EditTagsWrapper";

export default async function MembersSettingsPage({ params }) {
  const environment = await getEnvironment(params.environmentId);
  if (!environment) {
    throw new Error("Environment not found");
  }
  const tags = await getTagsByEnvironmentId(params.environmentId);
  const environmentTagsCount = await getTagsOnResponsesCount(params.environmentId);
  const team = await getTeamByEnvironmentId(params.environmentId);
  const session = await getServerSession(authOptions);

  if (!environment) {
    throw new Error("Environment not found");
  }
  if (!team) {
    throw new Error("Team not found");
  }

  if (!session) {
    throw new Error("Unauthenticated");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);
  const isTagSettingDisabled = isViewer;

  // const isMultiLanguageAllowed = await getMultiLanguagePermission(team);
  const isMultiLanguageAllowed = false;

  return !isTagSettingDisabled ? (
    <PageContentWrapper>
      <PageHeader pageTitle="Configuration">
        <ProductConfigNavigation
          environmentId={params.environmentId}
          activeId="tags"
          isMultiLanguageAllowed={isMultiLanguageAllowed}
        />
      </PageHeader>
      <SettingsCard title="Manage Tags" description="Add, merge and remove response tags.">
        <EditTagsWrapper
          environment={environment}
          environmentTags={tags}
          environmentTagsCount={environmentTagsCount}
        />
      </SettingsCard>
    </PageContentWrapper>
  ) : (
    <ErrorComponent />
  );
}
