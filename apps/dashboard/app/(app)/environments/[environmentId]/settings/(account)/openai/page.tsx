import { getServerSession } from "next-auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { SettingsCard } from "../../components/SettingsCard";
import SettingsTitle from "../../components/SettingsTitle";
import { EditApiKey } from "./components/EditApiKey";

export default async function OpenaiSettingsPage({ params }: { params: { environmentId: string } }) {
  const { environmentId } = params;

  const session = await getServerSession(authOptions);

  let team = await getTeamByEnvironmentId(environmentId);

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  return (
    <>
      {team && (
        <div>
          <SettingsTitle title="OpenAI" />
          <SettingsCard title="API Key" description="Enter your OpenAI API Key.">
            <EditApiKey team={team} />
          </SettingsCard>
        </div>
      )}
    </>
  );
}
