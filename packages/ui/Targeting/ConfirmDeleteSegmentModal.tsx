import React, { useMemo } from "react";

import { TSegmentWithWorkflowNames } from "@typeflowai/types/segment";

import { Button } from "../Button";
import { Modal } from "../Modal";

type ConfirmDeleteSegmentModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  segment: TSegmentWithWorkflowNames;
  onDelete: () => Promise<void>;
};

const ConfirmDeleteSegmentModal = ({ onDelete, open, segment, setOpen }: ConfirmDeleteSegmentModalProps) => {
  const handleDelete = async () => {
    await onDelete();
  };

  const segmentHasWorkflows = useMemo(() => {
    return segment.activeWorkflows.length > 0 || segment.inactiveWorkflows.length > 0;
  }, [segment.activeWorkflows.length, segment.inactiveWorkflows.length]);

  return (
    <Modal open={open} setOpen={setOpen} title="Delete Segment">
      <div className="text-slate-900">
        {segmentHasWorkflows && (
          <div className="space-y-2">
            <p>If you delete this segment, this will happen:</p>
            <ul className="ml-4 list-disc">
              <li>
                This segment will be <b>removed</b> from these workflows:
                <ol className="my-2 ml-4 list-decimal text-sm">
                  {segment.activeWorkflows.map((workflow) => (
                    <li key={workflow}>{workflow}</li>
                  ))}

                  {segment.inactiveWorkflows.map((workflow) => (
                    <li key={workflow}>{workflow}</li>
                  ))}
                </ol>
              </li>
              <li>
                These workflows will be <b>paused.</b>
              </li>
            </ul>
          </div>
        )}
        <p className="mt-2">This action cannot be undone.</p>
      </div>

      <div className="mt-4 space-x-2 text-right">
        <Button variant="minimal" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="warn"
          onClick={() => {
            handleDelete();
          }}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteSegmentModal;
