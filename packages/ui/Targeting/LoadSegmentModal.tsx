"use client";

import { Loader2, UsersIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { formatDate, timeSinceDate } from "@typeflowai/lib/time";
import { TSegment, ZSegmentFilters } from "@typeflowai/types/segment";
import { TWorkflow } from "@typeflowai/types/workflows";

import { Modal } from "../Modal";

type SegmentDetailProps = {
  segment: TSegment;
  setSegment: (segment: TSegment) => void;
  setOpen: (open: boolean) => void;
  setIsSegmentEditorOpen: (isOpen: boolean) => void;
  onSegmentLoad: (workflowId: string, segmentId: string) => Promise<TWorkflow>;
  workflowId: string;
  currentSegment: TSegment;
};

const SegmentDetail = ({
  segment,
  setIsSegmentEditorOpen,
  setOpen,
  setSegment,
  onSegmentLoad,
  workflowId,
  currentSegment,
}: SegmentDetailProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadNewSegment = async (segmentId: string) => {
    try {
      if (currentSegment.id === segmentId) {
        return;
      }

      setIsLoading(true);
      const updatedWorkflow = await onSegmentLoad(workflowId, segmentId);

      if (!updatedWorkflow?.id || !updatedWorkflow?.segment) {
        toast.error("Error loading workflow");
        setIsLoading(false);
        setIsSegmentEditorOpen(false);
        setOpen(false);
        return;
      }

      const parsedFilters = ZSegmentFilters.safeParse(updatedWorkflow?.segment?.filters);

      if (!parsedFilters.success) {
        toast.error("Error loading workflow");
        setIsLoading(false);
        setIsSegmentEditorOpen(false);
        setOpen(false);
        return;
      }

      setSegment({
        ...updatedWorkflow.segment,
        description: updatedWorkflow.segment.description || "",
        filters: parsedFilters.data,
        workflows: updatedWorkflow.segment.workflows,
      });

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message);
      setOpen(false);
    }
  };

  return (
    <div
      key={segment.id}
      className={cn(
        "relative mt-1 grid h-16 cursor-pointer grid-cols-5 content-center rounded-lg hover:bg-slate-100",
        currentSegment.id === segment.id && "pointer-events-none bg-slate-100 opacity-60"
      )}
      onClick={async () => {
        setIsLoading(true);
        try {
          await handleLoadNewSegment(segment.id);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
        }
      }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 opacity-80">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div className="col-span-3 flex items-center pl-6 text-sm">
        <div className="flex items-center gap-4">
          <div className="ph-no-capture h-8 w-8 flex-shrink-0 text-slate-700">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="ph-no-capture font-medium text-slate-900">{segment.title}</div>
            <div className="ph-no-capture text-xs font-medium text-slate-500">{segment.description}</div>
          </div>
        </div>
      </div>

      <div className="whitespace-wrap col-span-1 my-auto hidden text-center text-sm text-slate-500 sm:block">
        <div className="ph-no-capture text-slate-900">{timeSinceDate(segment.updatedAt)}</div>
      </div>

      <div className="whitespace-wrap col-span-1 my-auto hidden text-center text-sm text-slate-500 sm:block">
        <div className="ph-no-capture text-slate-900">{formatDate(segment.createdAt)}</div>
      </div>
    </div>
  );
};

type LoadSegmentModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowId: string;
  currentSegment: TSegment;
  segments: TSegment[];
  setSegment: (segment: TSegment) => void;
  setIsSegmentEditorOpen: (isOpen: boolean) => void;
  onSegmentLoad: (workflowId: string, segmentId: string) => Promise<TWorkflow>;
};

const LoadSegmentModal = ({
  open,
  workflowId,
  setOpen,
  currentSegment,
  segments,
  setSegment,
  setIsSegmentEditorOpen,
  onSegmentLoad,
}: LoadSegmentModalProps) => {
  const handleResetState = () => {
    setOpen(false);
  };

  const segmentsArray = segments?.filter((segment) => !segment.isPrivate);

  return (
    <Modal
      open={open}
      setOpen={() => {
        handleResetState();
      }}
      title="Load Segment"
      size="lg">
      <>
        {!segmentsArray?.length ? (
          <div className="group">
            <div className="flex h-16 w-full flex-col items-center justify-center rounded-lg text-slate-700">
              You have not created a segment yet.
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div>
              <div className="grid h-12 grid-cols-5 content-center rounded-lg bg-slate-100 text-left text-sm font-semibold text-slate-900">
                <div className="col-span-3 pl-6">Segment</div>
                <div className="col-span-1 hidden text-center sm:block">Updated at</div>
                <div className="col-span-1 hidden text-center sm:block">Created at</div>
              </div>

              {segmentsArray.map((segment) => (
                <SegmentDetail
                  segment={segment}
                  setIsSegmentEditorOpen={setIsSegmentEditorOpen}
                  setOpen={setOpen}
                  setSegment={setSegment}
                  onSegmentLoad={onSegmentLoad}
                  workflowId={workflowId}
                  currentSegment={currentSegment}
                />
              ))}
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

export default LoadSegmentModal;
