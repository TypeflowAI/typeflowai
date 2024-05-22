"use client";

import { MousePointerClickIcon } from "lucide-react";
import { useState } from "react";

import { useMembershipRole } from "@typeflowai/lib/membership/hooks/useMembershipRole";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { Button } from "@typeflowai/ui/Button";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

import ActionDetailModal from "./ActionDetailModal";
import AddNoCodeActionModal from "./AddActionModal";

interface ActionClassesTableProps {
  environmentId: string;
  actionClasses: TActionClass[];
  children: [JSX.Element, JSX.Element[]];
  isUserTargetingEnabled: boolean;
}

export default function ActionClassesTable({
  environmentId,
  actionClasses,
  children: [TableHeading, actionRows],
  isUserTargetingEnabled,
}: ActionClassesTableProps) {
  const [isActionDetailModalOpen, setActionDetailModalOpen] = useState(false);
  const [isAddActionModalOpen, setAddActionModalOpen] = useState(false);
  const { membershipRole, isLoading, error } = useMembershipRole(environmentId);
  const { isViewer } = getAccessFlags(membershipRole);

  const [activeActionClass, setActiveActionClass] = useState<TActionClass>({
    environmentId,
    id: "",
    name: "",
    type: "noCode",
    key: "",
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
  if (error) {
    return <ErrorComponent />;
  }
  return (
    <>
      {!isViewer && (
        <div className="mb-6 text-right">
          <Button
            loading={isLoading}
            variant="darkCTA"
            onClick={() => {
              setAddActionModalOpen(true);
            }}>
            <MousePointerClickIcon className="mr-2 h-5 w-5 text-white" />
            {isLoading ? "Loading" : "Add Action"}
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-slate-200">
        {TableHeading}
        <div className="grid-cols-7" id="actionClassesWrapper">
          {actionClasses.map((actionClass, index) => (
            <button
              onClick={(e) => {
                handleOpenActionDetailModalClick(e, actionClass);
              }}
              className="w-full"
              title={actionClass.name}
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
        actionClasses={actionClasses}
        actionClass={activeActionClass}
        membershipRole={membershipRole}
        isUserTargetingEnabled={isUserTargetingEnabled}
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
