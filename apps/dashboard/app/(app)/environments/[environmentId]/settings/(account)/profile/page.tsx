import { AccountSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(account)/components/AccountSettingsNavbar";
import AccountSecurity from "@/app/(app)/environments/[environmentId]/settings/(account)/profile/components/AccountSecurity";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getUser } from "@typeflowai/lib/user/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";
import { SettingsId } from "@typeflowai/ui/SettingsId";

import { SettingsCard } from "../../components/SettingsCard";
import { DeleteAccount } from "./components/DeleteAccount";
import { EditProfileAvatarForm } from "./components/EditProfileAvatarForm";
import { EditProfileDetailsForm } from "./components/EditProfileDetailsForm";

export default async function ProfileSettingsPage({ params }: { params: { environmentId: string } }) {
  const { environmentId } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Session not found");
  }

  const user = session && session.user ? await getUser(session.user.id) : null;

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Account Settings">
        <AccountSettingsNavbar environmentId={environmentId} activeId="profile" />
      </PageHeader>
      {user && (
        <div>
          <SettingsCard title="Personal information" description="Update your personal information.">
            <EditProfileDetailsForm user={user} />
          </SettingsCard>
          <SettingsCard title="Avatar" description="Assist your team in identifying you on TypeflowAI.">
            <EditProfileAvatarForm session={session} environmentId={environmentId} />
          </SettingsCard>
          {user.identityProvider === "email" && (
            <SettingsCard title="Security" description="Manage your password and other security settings.">
              <AccountSecurity user={user} />
            </SettingsCard>
          )}

          <SettingsCard
            title="Delete account"
            description="Delete your account with all of your personal information and data.">
            <DeleteAccount session={session} IS_TYPEFLOWAI_CLOUD={IS_TYPEFLOWAI_CLOUD} />
          </SettingsCard>
          <SettingsId title="Profile" id={user.id}></SettingsId>
        </div>
      )}
    </PageContentWrapper>
  );
}
