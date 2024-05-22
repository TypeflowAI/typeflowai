import MembersInfo from "@/app/(app)/environments/[environmentId]/settings/members/components/EditMemberships/MembersInfo";

import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { getInvitesByTeamId } from "@typeflowai/lib/invite/service";
import { getMembersByTeamId } from "@typeflowai/lib/membership/service";
import { TMembership } from "@typeflowai/types/memberships";
import { TTeam } from "@typeflowai/types/teams";

type EditMembershipsProps = {
  team: TTeam;
  currentUserId: string;
  currentUserMembership: TMembership;
  allMemberships: TMembership[];
};

export async function EditMemberships({
  team,
  currentUserId,
  currentUserMembership: membership,
}: EditMembershipsProps) {
  const members = await getMembersByTeamId(team.id);
  const invites = await getInvitesByTeamId(team.id);

  const currentUserRole = membership?.role;
  const isUserAdminOrOwner = membership?.role === "admin" || membership?.role === "owner";
  const canDoRoleManagement = await getIsPaidSubscription(team);

  return (
    <div>
      <div className="rounded-lg border border-slate-200">
        <div className="grid-cols-20 grid h-12 content-center rounded-t-lg bg-slate-100 px-4 text-left text-sm font-semibold text-slate-900">
          <div className="col-span-5">Fullname</div>
          <div className="col-span-5">Email</div>
          {canDoRoleManagement && <div className="col-span-5">Role</div>}
          <div className="col-span-5"></div>
        </div>

        {currentUserRole && (
          <MembersInfo
            team={team}
            currentUserId={currentUserId}
            invites={invites ?? []}
            members={members ?? []}
            isUserAdminOrOwner={isUserAdminOrOwner}
            currentUserRole={currentUserRole}
            canDoRoleManagement={canDoRoleManagement}
          />
        )}
      </div>
    </div>
  );
}
