import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import EnvironmentNotice from "@typeflowai/ui/EnvironmentNotice";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

import SettingsCard from "../components/SettingsCard";
import SettingsTitle from "../components/SettingsTitle";
import ApiKeyList from "./components/ApiKeyList";

export default async function ProfileSettingsPage({ params }) {
  const environment = await getEnvironment(params.environmentId);
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

  return !isViewer ? (
    <div>
      <SettingsTitle title="API Keys" />
      <EnvironmentNotice environmentId={environment.id} subPageUrl="/settings/api-keys" />
      {environment.type === "development" ? (
        <SettingsCard
          title="Development Env Keys"
          description="Add and remove API keys for your Development environment.">
          <ApiKeyList environmentId={params.environmentId} environmentType="development" />
        </SettingsCard>
      ) : (
        <SettingsCard
          title="Production Env Keys"
          description="Add and remove API keys for your Production environment.">
          <ApiKeyList environmentId={params.environmentId} environmentType="production" />
        </SettingsCard>
      )}
    </div>
  ) : (
    <ErrorComponent />
  );
}
