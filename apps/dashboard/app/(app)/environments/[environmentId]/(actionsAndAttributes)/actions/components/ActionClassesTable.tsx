"use client";

import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { useMembershipRole } from "@typeflowai/lib/membership/hooks/useMembershipRole";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { Button } from "@typeflowai/ui/Button";
import { LoadingWrapper } from "@typeflowai/ui/LoadingWrapper";

import ActionDetailModal from "./ActionDetailModal";
import AddNoCodeActionModal from "./AddActionModal";

export default function ActionClassesTable({
  environmentId,
  actionClasses,
  children: [TableHeading, actionRows],
}: {
  environmentId: string;
  actionClasses: TActionClass[];
  children: [JSX.Element, JSX.Element[]];
}) {
  const [isActionDetailModalOpen, setActionDetailModalOpen] = useState(false);
  const [isAddActionModalOpen, setAddActionModalOpen] = useState(false);
  const { membershipRole, isLoading, error } = useMembershipRole(environmentId);
  const { isViewer } = getAccessFlags(membershipRole);

  const [activeActionClass, setActiveActionClass] = useState<TActionClass>({
    environmentId,
    id: "",
    name: "",
    type: "noCode",
    description: "",
    noCodeConfig: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleOpenActionDetailModalClick = (e, actionClass: TActionClass) => {
    e.preventDefault();
    setActiveActionClass(actionClass);
    setActionDetailModalOpen(true);
  };

  return (
    <>
      <LoadingWrapper isLoading={isLoading} error={error}>
        {!isViewer && (
          <div className="mb-6 text-right">
            <Button
              variant="darkCTA"
              onClick={() => {
                setAddActionModalOpen(true);
              }}>
              <CursorArrowRaysIcon className="mr-2 h-5 w-5 text-white" />
              Add Action
            </Button>
          </div>
        )}
      </LoadingWrapper>
      <div className="rounded-lg border border-slate-200">
        {TableHeading}
        <div className="grid-cols-7">
          {actionClasses.map((actionClass, index) => (
            <button
              onClick={(e) => {
                handleOpenActionDetailModalClick(e, actionClass);
              }}
              className="w-full"
              key={actionClass.id}>
              {actionRows[index]}
            </button>
          ))}
        </div>
      </div>
      <ActionDetailModal
        environmentId={environmentId}
        open={isActionDetailModalOpen}
        setOpen={setActionDetailModalOpen}
        actionClass={activeActionClass}
        membershipRole={membershipRole}
      />
      <AddNoCodeActionModal
        environmentId={environmentId}
        open={isAddActionModalOpen}
        actionClasses={actionClasses}
        setOpen={setAddActionModalOpen}
        isViewer={isViewer}
      />
    </>
  );
}
