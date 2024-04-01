// import AccountSecurity from "@/app/(app)/environments/[environmentId]/settings/profile/components/AccountSecurity";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getUser } from "@typeflowai/lib/user/service";
import { SettingsId } from "@typeflowai/ui/SettingsId";

import SettingsCard from "../components/SettingsCard";
import SettingsTitle from "../components/SettingsTitle";
import { DeleteAccount } from "./components/DeleteAccount";
import { EditAvatar } from "./components/EditAvatar";
import { EditName } from "./components/EditName";

export default async function ProfileSettingsPage({ params }: { params: { environmentId: string } }) {
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

  const user = session && session.user ? await getUser(session.user.id) : null;

  return (
    <>
      {user && (
        <div>
          <SettingsTitle title="Profile" />
          <SettingsCard title="Personal Information" description="Update your personal information.">
            <EditName user={user} />
          </SettingsCard>
          <SettingsCard title="Avatar" description="Assist your team in identifying you on TypeflowAI.">
            <EditAvatar user={user} environmentId={environmentId} />
          </SettingsCard>
          {/* //TODO: Pending review for implement 2FA */}
          {/* {user.identityProvider === "email" && (
            <SettingsCard title="Security" description="Manage your password and other security settings.">
              <AccountSecurity user={user} />
            </SettingsCard>
          )} */}

          <SettingsCard
            title="Delete account"
            description="Delete your account with all of your personal information and data.">
            <DeleteAccount user={user} />
          </SettingsCard>
          <SettingsId title="Profile" id={user.id}></SettingsId>
        </div>
      )}
    </>
  );
}
