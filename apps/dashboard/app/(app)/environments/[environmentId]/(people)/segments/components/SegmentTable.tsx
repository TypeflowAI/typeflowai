import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TSegment } from "@typeflowai/types/segment";

import SegmentTableDataRowContainer from "./SegmentTableDataRowContainer";

type TSegmentTableProps = {
  segments: TSegment[];
  attributeClasses: TAttributeClass[];
  actionClasses: TActionClass[];
  isAdvancedTargetingAllowed: boolean;
};
const SegmentTable = ({
  segments,
  actionClasses,
  attributeClasses,
  isAdvancedTargetingAllowed,
}: TSegmentTableProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid h-12 grid-cols-7 content-center border-b text-left text-sm font-semibold text-slate-900">
        <div className="col-span-4 pl-6">Title</div>
        <div className="col-span-1 hidden text-center sm:block">Workflows</div>
        <div className="col-span-1 hidden text-center sm:block">Updated</div>
        <div className="col-span-1 hidden text-center sm:block">Created</div>
      </div>
      {segments.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">Create your first Segment to get started.</p>
      ) : (
        <>
          {segments.map((segment) => (
            <SegmentTableDataRowContainer
              currentSegment={segment}
              segments={segments}
              actionClasses={actionClasses}
              attributeClasses={attributeClasses}
              isAdvancedTargetingAllowed={isAdvancedTargetingAllowed}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SegmentTable;
