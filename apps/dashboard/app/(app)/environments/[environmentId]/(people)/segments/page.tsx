import { PeopleSecondaryNavigation } from "@/app/(app)/environments/[environmentId]/(people)/people/components/PeopleSecondaryNavigation";
import BasicCreateSegmentModal from "@/app/(app)/environments/[environmentId]/(people)/segments/components/BasicCreateSegmentModal";
import SegmentTable from "@/app/(app)/environments/[environmentId]/(people)/segments/components/SegmentTable";
// import CreateSegmentModal from "@typeflowai/ee/advanced-targeting/components/create-segment-modal";
// import { ACTIONS_TO_EXCLUDE } from "@typeflowai/ee/advanced-targeting/lib/constants";
import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { getActionClasses } from "@typeflowai/lib/actionClass/service";
import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getSegments } from "@typeflowai/lib/segment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

export default async function SegmentsPage({ params }) {
  const [environment, segments, attributeClasses, actionClassesFromServer, team] = await Promise.all([
    getEnvironment(params.environmentId),
    getSegments(params.environmentId),
    getAttributeClasses(params.environmentId),
    getActionClasses(params.environmentId),
    getTeamByEnvironmentId(params.environmentId),
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const isAdvancedTargetingAllowed = await getIsPaidSubscription(team);

  if (!segments) {
    throw new Error("Failed to fetch segments");
  }

  const filteredSegments = segments.filter((segment) => !segment.isPrivate);

  const actionClasses = actionClassesFromServer.filter((actionClass) => {
    if (actionClass.type === "automatic") {
      // if (ACTIONS_TO_EXCLUDE.includes(actionClass.name)) {
      //   return false;
      // }

      return true;
    }

    return true;
  });

  const renderCreateSegmentButton = () => (
    /* {isAdvancedTargetingAllowed ? (
        <CreateSegmentModal
          environmentId={params.environmentId}
          actionClasses={actionClasses}
          attributeClasses={attributeClasses}
          segments={filteredSegments}
        />
      ) : (
        <BasicCreateSegmentModal
          attributeClasses={attributeClasses}
          environmentId={params.environmentId}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
        />
      )} */
    <BasicCreateSegmentModal
      attributeClasses={attributeClasses}
      environmentId={params.environmentId}
      isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
    />
  );

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Segments" cta={renderCreateSegmentButton()}>
        <PeopleSecondaryNavigation activeId="segments" environmentId={params.environmentId} />
      </PageHeader>
      <SegmentTable
        segments={filteredSegments}
        actionClasses={actionClasses}
        attributeClasses={attributeClasses}
        isAdvancedTargetingAllowed={isAdvancedTargetingAllowed}
      />
    </PageContentWrapper>
  );
}
