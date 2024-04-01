import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

import SettingsCard from "../components/SettingsCard";
import SettingsTitle from "../components/SettingsTitle";
import { EditApiKey } from "./components/EditApiKey";

export default async function OpenaiSettingsPage({ params }: { params: { environmentId: string } }) {
  const { environmentId } = params;

  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

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
