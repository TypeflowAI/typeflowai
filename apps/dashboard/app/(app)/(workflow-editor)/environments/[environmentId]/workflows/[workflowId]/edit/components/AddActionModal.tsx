"use client";

import { TActionClass } from "@typeflowai/types/actionClasses";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ModalWithTabs } from "@typeflowai/ui/ModalWithTabs";

import { CreateNewActionTab } from "./CreateNewActionTab";
import { SavedActionsTab } from "./SavedActionsTab";

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
