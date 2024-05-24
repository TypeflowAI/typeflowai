import ActivityTimeline from "@/app/(app)/environments/[environmentId]/(people)/people/[personId]/components/ActivityTimeline";

import { getActionsByPersonId } from "@typeflowai/lib/action/service";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

export default async function ActivitySection({
  environmentId,
  personId,
}: {
  environmentId: string;
  personId: string;
}) {
  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  // On TypeflowAI Cloud only render the timeline if the user targeting feature is booked
  const isUserTargetingEnabled = IS_TYPEFLOWAI_CLOUD ? team.billing.subscriptionStatus === "active" : true;

  const [environment, actions] = await Promise.all([
    getEnvironment(environmentId),
    isUserTargetingEnabled ? getActionsByPersonId(personId, 1) : [],
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }

  return (
    <div className="md:col-span-1">
      <ActivityTimeline
        environment={environment}
        actions={actions.slice(0, 10)}
        isUserTargetingEnabled={isUserTargetingEnabled}
      />
    </div>
  );
}
