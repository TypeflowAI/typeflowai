"use client";

import { ModalWithTabs } from "@typeflowai/ui/ModalWithTabs";

import { BulkInviteTab } from "./BulkInviteTab";
import { IndividualInviteTab } from "./IndividualInviteTab";

export enum MembershipRole {
  Admin = "admin",
  Editor = "editor",
  Developer = "developer",
  Viewer = "viewer",
}
interface AddMemberModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (data: { name: string; email: string; role: MembershipRole }[]) => void;
  canDoRoleManagement: boolean;
  isTypeflowAICloud: boolean;
  environmentId: string;
}

export default function AddMemberModal({
  open,
  setOpen,
  onSubmit,
  canDoRoleManagement,
  isTypeflowAICloud,
  environmentId,
}: AddMemberModalProps) {
  const tabs = [
    {
      title: "Individual Invite",
      children: (
        <IndividualInviteTab
          setOpen={setOpen}
          environmentId={environmentId}
          onSubmit={onSubmit}
          canDoRoleManagement={canDoRoleManagement}
          isTypeflowAICloud={isTypeflowAICloud}
        />
      ),
    },
    {
      title: "Bulk Invite",
      children: (
        <BulkInviteTab setOpen={setOpen} onSubmit={onSubmit} canDoRoleManagement={canDoRoleManagement} />
      ),
    },
  ];

  return (
    <>
      <ModalWithTabs
        open={open}
        setOpen={setOpen}
        tabs={tabs}
        label={"Invite Team Member"}
        closeOnOutsideClick={true}
      />
    </>
  );
}
