"use client";

import {
  inviteUserAction,
  leaveTeamAction,
} from "@/app/(app)/environments/[environmentId]/settings/members/actions";
import AddMemberModal from "@/app/(app)/environments/[environmentId]/settings/members/components/AddMemberModal";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { TMembershipRole } from "@typeflowai/types/memberships";
import { TTeam } from "@typeflowai/types/teams";
import { Button } from "@typeflowai/ui/Button";
import CreateTeamModal from "@typeflowai/ui/CreateTeamModal";
import CustomDialog from "@typeflowai/ui/CustomDialog";

type TeamActionsProps = {
  role: string;
  isAdminOrOwner: boolean;
  isLeaveTeamDisabled: boolean;
  team: TTeam;
  isInviteDisabled: boolean;
  canDoRoleManagement: boolean;
  isTypeflowAiCloud: boolean;
  environmentId: string;
};

export default function TeamActions({
  isAdminOrOwner,
  role,
  team,
  isLeaveTeamDisabled,
  isInviteDisabled,
  canDoRoleManagement,
  isTypeflowAiCloud,
  environmentId,
}: TeamActionsProps) {
  const router = useRouter();
  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLeaveTeam = async () => {
    setLoading(true);
    try {
      await leaveTeamAction(team.id);
      toast.success("You left the team successfully");
      router.refresh();
      setLoading(false);
      router.push("/");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleAddMember = async (data: { name: string; email: string; role: TMembershipRole }) => {
    try {
      await inviteUserAction(team.id, data.email, data.name, data.role);
      toast.success("Member invited successfully");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
    router.refresh();
  };

  return (
    <>
      <div className="mb-6 text-right">
        {role !== "owner" && (
          <Button variant="minimal" className="mr-2" onClick={() => setLeaveTeamModalOpen(true)}>
            Leave Team
          </Button>
        )}
        <Button
          variant="secondary"
          className="mr-2"
          onClick={() => {
            setCreateTeamModalOpen(true);
          }}>
          Create New Team
        </Button>
        {!isInviteDisabled && isAdminOrOwner && (
          <Button
            variant="darkCTA"
            onClick={() => {
              setAddMemberModalOpen(true);
            }}>
            Add Member
          </Button>
        )}
      </div>

      <CreateTeamModal open={isCreateTeamModalOpen} setOpen={(val) => setCreateTeamModalOpen(val)} />
      <AddMemberModal
        open={isAddMemberModalOpen}
        setOpen={setAddMemberModalOpen}
        onSubmit={handleAddMember}
        canDoRoleManagement={canDoRoleManagement}
        isTypeflowAiCloud={isTypeflowAiCloud}
        environmentId={environmentId}
      />

      <CustomDialog
        open={isLeaveTeamModalOpen}
        setOpen={setLeaveTeamModalOpen}
        title="Are you sure?"
        text="You wil leave this team and loose access to all workflows and responses. You can only rejoin if you are invited again."
        onOk={handleLeaveTeam}
        okBtnText="Yes, leave team"
        disabled={isLeaveTeamDisabled}
        isLoading={loading}>
        {isLeaveTeamDisabled && (
          <p className="mt-2 text-sm text-red-700">
            You cannot leave this team as it is your only team. Create a new team first.
          </p>
        )}
      </CustomDialog>
    </>
  );
}
