"use client";

import { convertDateTimeStringShort } from "@typeflowai/lib/time";
import { TSegment } from "@typeflowai/types/segment";
import { Label } from "@typeflowai/ui/Label";

interface SegmentActivityTabProps {
  environmentId: string;
  currentSegment: TSegment & {
    activeWorkflows: string[];
    inactiveWorkflows: string[];
  };
}

export default function SegmentActivityTab({ currentSegment }: SegmentActivityTabProps) {
  const activeWorkflows = currentSegment?.activeWorkflows;
  const inactiveWorkflows = currentSegment?.inactiveWorkflows;

  return (
    <div className="grid grid-cols-3 pb-2">
      <div className="col-span-2 space-y-4 pr-6">
        <div>
          <Label className="text-slate-500">Active workflows</Label>
          {!activeWorkflows?.length && <p className="text-sm text-slate-900">-</p>}

          {activeWorkflows?.map((workflow) => <p className="text-sm text-slate-900">{workflow}</p>)}
        </div>
        <div>
          <Label className="text-slate-500">Inactive workflows</Label>
          {!inactiveWorkflows?.length && <p className="text-sm text-slate-900">-</p>}

          {inactiveWorkflows?.map((workflow) => <p className="text-sm text-slate-900">{workflow}</p>)}
        </div>
      </div>
      <div className="col-span-1 space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-2">
        <div>
          <Label className="text-xs font-normal text-slate-500">Created on</Label>
          <p className=" text-xs text-slate-700">
            {convertDateTimeStringShort(currentSegment.createdAt?.toString())}
          </p>
        </div>{" "}
        <div>
          <Label className="text-xs font-normal text-slate-500">Last updated</Label>
          <p className=" text-xs text-slate-700">
            {convertDateTimeStringShort(currentSegment.updatedAt?.toString())}
          </p>
        </div>
      </div>
    </div>
  );
}
