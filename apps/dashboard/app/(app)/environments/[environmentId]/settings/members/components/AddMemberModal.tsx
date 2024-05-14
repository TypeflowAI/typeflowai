"use client";

import { AddMemberAccess } from "@/app/(app)/environments/[environmentId]/settings/members/components/AccessManagement/AddMemberAccess";
import { useForm } from "react-hook-form";

import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Modal } from "@typeflowai/ui/Modal";
import { UpgradePlanNotice } from "@typeflowai/ui/UpgradePlanNotice";

enum MembershipAccess {
  Admin = "admin",
  Editor = "editor",
  Developer = "developer",
  Viewer = "viewer",
}
interface MemberModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (data: { name: string; email: string; role: MembershipAccess }) => void;
  canDoRoleManagement: boolean;
  isTypeflowAiCloud: boolean;
  environmentId: string;
}

export default function AddMemberModal({
  open,
  setOpen,
  onSubmit,
  canDoRoleManagement,
  isTypeflowAiCloud,
  environmentId,
}: MemberModalProps) {
  const { register, getValues, handleSubmit, reset, control } = useForm<{
    name: string;
    email: string;
    role: MembershipAccess;
  }>();

  const submitEventClass = async () => {
    const data = getValues();
    data.role = data.role || MembershipAccess.Admin;
    onSubmit(data);
    setOpen(false);
    reset();
  };

  return (
    <Modal open={open} setOpen={setOpen} noPadding closeOnOutsideClick={false}>
      <div className="flex h-full flex-col rounded-lg">
        <div className="rounded-t-lg bg-slate-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-medium text-slate-700">Invite Team Member</div>
            </div>
          </div>
        </div>
        {!canDoRoleManagement &&
          (isTypeflowAiCloud ? (
            <div className="mx-6 mt-2">
              <UpgradePlanNotice
                message="To manage access roles for your team"
                url={`/environments/${environmentId}/settings/billing`}
                textForUrl="Upgrade to paid plans."
              />
            </div>
          ) : (
            <div className="mx-6 mt-2">
              <UpgradePlanNotice
                message="To manage access roles for your team,"
                url="mailto:support@typeflowai.com"
                textForUrl="get a self-hosted license (free to get started)."
              />
            </div>
          ))}

        <form onSubmit={handleSubmit(submitEventClass)}>
          <div className="flex justify-between rounded-lg p-6">
            <div className="w-full space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g. Hans Wurst"
                  {...register("name", { required: true, validate: (value) => value.trim() !== "" })}
                />
              </div>
              <div>
                <Label>Email Adress</Label>
                <Input type="email" placeholder="hans@wurst.com" {...register("email", { required: true })} />
              </div>
              {canDoRoleManagement && <AddMemberAccess control={control} />}
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-200 p-6">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="minimal"
                onClick={() => {
                  setOpen(false);
                }}>
                Cancel
              </Button>
              <Button variant="darkCTA" type="submit">
                Send Invitation
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
