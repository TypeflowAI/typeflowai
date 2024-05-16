"use client";

import { useForm } from "react-hook-form";

// import { AddMemberRole } from "@typeflowai/ee/roleManagement/components/AddMemberRole";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

// import { UpgradePlanNotice } from "@typeflowai/ui/UpgradePlanNotice";
import { MembershipRole } from "./AddMemberModal";

interface IndividualInviteTabProps {
  setOpen: (v: boolean) => void;
  onSubmit: (data: { name: string; email: string; role: MembershipRole }[]) => void;
  canDoRoleManagement: boolean;
  isTypeflowAICloud: boolean;
  environmentId: string;
}
export const IndividualInviteTab = ({
  setOpen,
  onSubmit,
  // canDoRoleManagement,
  // isTypeflowAICloud,
  // environmentId,
}: IndividualInviteTabProps) => {
  const {
    register,
    getValues,
    handleSubmit,
    reset,
    // control
  } = useForm<{
    name: string;
    email: string;
    role: MembershipRole;
  }>();

  const submitEventClass = async () => {
    const data = getValues();
    data.role = data.role || MembershipRole.Admin;
    onSubmit([data]);
    setOpen(false);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(submitEventClass)}>
      <div className="flex justify-between rounded-lg ">
        <div className="w-full space-y-4">
          <div>
            <Label htmlFor="memberNameInput">Full Name</Label>
            <Input
              id="memberNameInput"
              placeholder="e.g. Hans Wurst"
              {...register("name", { required: true, validate: (value) => value.trim() !== "" })}
            />
          </div>
          <div>
            <Label htmlFor="memberEmailInput">Email Address</Label>
            <Input
              id="memberEmailInput"
              type="email"
              placeholder="hans@wurst.com"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            {/* <AddMemberRole control={control} canDoRoleManagement={canDoRoleManagement} />
            {!canDoRoleManagement &&
              (isTypeflowAICloud ? (
                <UpgradePlanNotice
                  message="To manage access roles,"
                  url={`/environments/${environmentId}/settings/billing`}
                  textForUrl="please add your credit card (free)."
                />
              ) : (
                <UpgradePlanNotice
                  message="To manage access roles for your team,"
                  url="https://typeflowai.com/docs/self-hosting/enterprise"
                  textForUrl="get a enterprise license."
                />
              ))} */}
          </div>
        </div>
      </div>
      <div className="flex justify-end p-6">
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
  );
};
