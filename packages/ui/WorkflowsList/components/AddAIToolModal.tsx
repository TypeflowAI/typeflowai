"use client";

import { BotIcon } from "lucide-react";

import { useMembershipRole } from "@typeflowai/lib/membership/hooks/useMembershipRole";

import { Button } from "../../Button";
import { ErrorComponent } from "../../ErrorComponent";
import { Modal } from "../../Modal";
import { UpgradePlanNotice } from "../../UpgradePlanNotice";

interface AddAIToolModalProps {
  environmentId: string;
  isTypeflowAICloud: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AddAIToolModal = ({ environmentId, isTypeflowAICloud, open, setOpen }: AddAIToolModalProps) => {
  const { error } = useMembershipRole(environmentId);

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <Modal open={open} setOpen={setOpen} noPadding closeOnOutsideClick={true}>
        <div className="flex h-full flex-col rounded-lg">
          <div className="rounded-t-lg bg-slate-100">
            <div className="flex w-full items-center justify-between p-6">
              <div className="flex items-center space-x-2">
                <div className="mr-1.5 h-6 w-6 text-slate-500">
                  <BotIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-medium text-slate-700">Add new AI Tool</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-auto rounded-lg bg-white p-6">
          {isTypeflowAICloud ? (
            <UpgradePlanNotice
              message="For adding more than 2 AI Tools, please"
              textForUrl="upgrade your plan."
              url={`/environments/${environmentId}/settings/billing`}
            />
          ) : (
            <UpgradePlanNotice
              message="For adding more than 2 AI Tools, please"
              textForUrl="upgrade your plan."
              url="https://typeflowai.com/docs/self-hosting/enterprise"
            />
          )}
          <div className="flex justify-end pt-4">
            <div className="flex space-x-2">
              <Button
                type="submit"
                href={`/environments/${environmentId}/settings/billing`}
                variant="primary">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
