import { TeamSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(team)/components/TeamSettingsNavbar";
import TeamActions from "@/app/(app)/environments/[environmentId]/settings/(team)/members/components/EditMemberships/TeamActions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { INVITE_DISABLED, IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId, getMembershipsByUserId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";
import { SettingsId } from "@typeflowai/ui/SettingsId";

import { SettingsCard } from "../../components/SettingsCard";
import DeleteTeam from "./components/DeleteTeam";
import { EditMemberships } from "./components/EditMemberships";
import EditTeamName from "./components/EditTeamName";

const MembersLoading = () => (
  <div className="px-2">
    {Array.from(Array(2)).map((_, index) => (
      <div key={index} className="mt-4">
        <div className={`h-8 w-80 animate-pulse rounded-full bg-slate-200`} />
      </div>
    ))}
  </div>
);

export default async function MembersSettingsPage({ params }: { params: { environmentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthenticated");
  }
  const team = await getTeamByEnvironmentId(params.environmentId);

  if (!team) {
    throw new Error("Team not found");
  }
  const canDoRoleManagement = await getIsPaidSubscription(team);

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isOwner, isAdmin } = getAccessFlags(currentUserMembership?.role);
  const userMemberships = await getMembershipsByUserId(session.user.id);

  const isDeleteDisabled = !isOwner;
  const currentUserRole = currentUserMembership?.role;

  const isLeaveTeamDisabled = userMemberships.length <= 1;
  const isUserAdminOrOwner = isAdmin || isOwner;

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Team Settings">
        <TeamSettingsNavbar
          environmentId={params.environmentId}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
          membershipRole={currentUserMembership?.role}
          activeId="members"
        />
      </PageHeader>
      <SettingsCard title="Manage members" description="Add or remove members in your team.">
        {currentUserRole && (
          <TeamActions
            team={team}
            isAdminOrOwner={isUserAdminOrOwner}
            role={currentUserRole}
            isLeaveTeamDisabled={isLeaveTeamDisabled}
            isInviteDisabled={INVITE_DISABLED}
            canDoRoleManagement={canDoRoleManagement}
            isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
            environmentId={params.environmentId}
          />
        )}

        {currentUserMembership && (
          <Suspense fallback={<MembersLoading />}>
            <EditMemberships
              team={team}
              currentUserId={session.user?.id}
              allMemberships={userMemberships}
              currentUserMembership={currentUserMembership}
            />
          </Suspense>
        )}
      </SettingsCard>
      <SettingsCard title="Team Name" description="Give your team a descriptive name.">
        <EditTeamName
          team={team}
          environmentId={params.environmentId}
          membershipRole={currentUserMembership?.role}
        />
      </SettingsCard>
      <SettingsCard
        title="Delete Team"
        description="Delete team with all its products including all workflows, responses, people, actions and attributes">
        <DeleteTeam
          team={team}
          isDeleteDisabled={isDeleteDisabled}
          isUserOwner={currentUserRole === "owner"}
        />
      </SettingsCard>
      <SettingsId title="Team" id={team.id}></SettingsId>
    </PageContentWrapper>
  );
}
