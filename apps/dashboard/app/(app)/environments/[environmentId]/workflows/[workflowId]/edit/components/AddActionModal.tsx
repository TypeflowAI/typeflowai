"use client";

import { CreateNewActionTab } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/CreateNewActionTab";
import { SavedActionsTab } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/SavedActionsTab";

import { TActionClass } from "@typeflowai/types/actionClasses";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ModalWithTabs } from "@typeflowai/ui/ModalWithTabs";

interface AddActionModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  environmentId: string;
  actionClasses: TActionClass[];
  setActionClasses: React.Dispatch<React.SetStateAction<TActionClass[]>>;
  isViewer: boolean;
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
}

export const AddActionModal = ({
  open,
  setOpen,
  actionClasses,
  setActionClasses,
  localWorkflow,
  setLocalWorkflow,
  isViewer,
  environmentId,
}: AddActionModalProps) => {
  const tabs = [
    {
      title: "Select saved action",
      children: (
        <SavedActionsTab
          actionClasses={actionClasses}
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          setOpen={setOpen}
        />
      ),
    },
    {
      title: "Capture new action",
      children: (
        <CreateNewActionTab
          actionClasses={actionClasses}
          setActionClasses={setActionClasses}
          setOpen={setOpen}
          isViewer={isViewer}
          setLocalWorkflow={setLocalWorkflow}
          environmentId={environmentId}
        />
      ),
    },
  ];
  return (
    <ModalWithTabs
      label="Add action"
      open={open}
      setOpen={setOpen}
      tabs={tabs}
      size="md"
      closeOnOutsideClick={false}
    />
  );
};
