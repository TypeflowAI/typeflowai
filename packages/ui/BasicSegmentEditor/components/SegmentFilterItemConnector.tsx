import { cn } from "@typeflowai/lib/cn";
import { toggleFilterConnector } from "@typeflowai/lib/segment/utils";
import { TSegment, TSegmentConnector } from "@typeflowai/types/segment";

interface SegmentFilterItemConnectorProps {
  connector: TSegmentConnector;
  segment: TSegment;
  setSegment: (segment: TSegment) => void;
  filterId: string;
  viewOnly?: boolean;
}

export const SegmentFilterItemConnector = ({
  connector,
  segment,
  setSegment,
  filterId,
  viewOnly,
}: SegmentFilterItemConnectorProps) => {
  const updateLocalWorkflow = (newConnector: TSegmentConnector) => {
    const updatedSegment = structuredClone(segment);
    if (updatedSegment.filters) {
      toggleFilterConnector(updatedSegment.filters, filterId, newConnector);
    }

    setSegment(updatedSegment);
  };

  const onConnectorChange = () => {
    if (!connector) return;

    if (connector === "and") {
      updateLocalWorkflow("or");
    } else {
      updateLocalWorkflow("and");
    }
  };

  return (
    <div className="w-[40px]">
      <span
        className={cn(!!connector && "cursor-pointer underline", viewOnly && "cursor-not-allowed")}
        onClick={() => {
          if (viewOnly) return;
          onConnectorChange();
        }}>
        {!!connector ? connector : "Where"}
      </span>
    </div>
  );
};
