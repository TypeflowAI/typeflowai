import PeopleSegmentsTabs from "@/app/(app)/environments/[environmentId]/(peopleAndSegments)/people/components/PeopleSegmentsTabs";
import { Metadata } from "next";

import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";

export const metadata: Metadata = {
  title: "Segments",
};

export default async function PeopleLayout({ params, children }) {
  const team = await getTeamByEnvironmentId(params.environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isUserTargetingAllowed = getIsPaidSubscription(team);

  return (
    <>
      <PeopleSegmentsTabs
        activeId="segments"
        environmentId={params.environmentId}
        isUserTargetingAllowed={isUserTargetingAllowed}
      />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
