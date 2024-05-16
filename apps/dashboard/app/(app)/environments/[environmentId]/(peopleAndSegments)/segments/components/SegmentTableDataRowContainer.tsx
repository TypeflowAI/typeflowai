import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getWorkflowsBySegmentId } from "@typeflowai/lib/workflow/service";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TSegment } from "@typeflowai/types/segment";

import SegmentTableDataRow from "./SegmentTableDataRow";

type TSegmentTableDataRowProps = {
  currentSegment: TSegment;
  segments: TSegment[];
  attributeClasses: TAttributeClass[];
  actionClasses: TActionClass[];
  isAdvancedTargetingAllowed: boolean;
};

const SegmentTableDataRowContainer = async ({
  currentSegment,
  segments,
  actionClasses,
  attributeClasses,
  isAdvancedTargetingAllowed,
}: TSegmentTableDataRowProps) => {
  const workflows = await getWorkflowsBySegmentId(currentSegment.id);

  const activeWorkflows = workflows?.length
    ? workflows.filter((workflow) => workflow.status === "inProgress").map((workflow) => workflow.name)
    : [];

  const inactiveWorkflows = workflows?.length
    ? workflows
        .filter((workflow) => ["draft", "paused"].includes(workflow.status))
        .map((workflow) => workflow.name)
    : [];

  return (
    <SegmentTableDataRow
      currentSegment={{
        ...currentSegment,
        activeWorkflows,
        inactiveWorkflows,
      }}
      segments={segments}
      actionClasses={actionClasses}
      attributeClasses={attributeClasses}
      isAdvancedTargetingAllowed={isAdvancedTargetingAllowed}
      isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
    />
  );
};

export default SegmentTableDataRowContainer;
