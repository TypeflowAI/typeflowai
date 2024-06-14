import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { updateFilterValue } from "@typeflowai/lib/segment/utils";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import {
  TSegment,
  TSegmentAttributeFilter,
  TSegmentConnector,
  TSegmentFilter,
  TSegmentPersonFilter,
} from "@typeflowai/types/segment";

import { AttributeSegmentFilter } from "./AttributeSegmentFilter";
import { PersonSegmentFilter } from "./PersonSegmentFilter";

interface BasicSegmentFilterProps {
  connector: TSegmentConnector;
  resource: TSegmentFilter;
  environmentId: string;
  segment: TSegment;
  attributeClasses: TAttributeClass[];
  setSegment: (segment: TSegment) => void;
  onDeleteFilter: (filterId: string) => void;
  onMoveFilter: (filterId: string, direction: "up" | "down") => void;
  viewOnly?: boolean;
}

export const BasicSegmentFilter = ({
  resource,
  connector,
  environmentId,
  segment,
  attributeClasses,
  setSegment,
  onDeleteFilter,
  onMoveFilter,
  viewOnly,
}: BasicSegmentFilterProps) => {
  const updateFilterValueInSegment = (filterId: string, newValue: string | number) => {
    const updatedSegment = structuredClone(segment);
    if (updatedSegment.filters) {
      updateFilterValue(updatedSegment.filters, filterId, newValue);
    }

    setSegment(updatedSegment);
  };

  switch (resource.root.type) {
    case "attribute":
      return (
        <>
          <AttributeSegmentFilter
            connector={connector}
            resource={resource as TSegmentAttributeFilter}
            environmentId={environmentId}
            segment={segment}
            attributeClasses={attributeClasses}
            setSegment={setSegment}
            onDeleteFilter={onDeleteFilter}
            onMoveFilter={onMoveFilter}
            updateValueInLocalWorkflow={updateFilterValueInSegment}
            viewOnly={viewOnly}
          />
        </>
      );

    case "person":
      return (
        <>
          <PersonSegmentFilter
            connector={connector}
            resource={resource as TSegmentPersonFilter}
            environmentId={environmentId}
            segment={segment}
            setSegment={setSegment}
            onDeleteFilter={onDeleteFilter}
            onMoveFilter={onMoveFilter}
            updateValueInLocalWorkflow={updateFilterValueInSegment}
            viewOnly={viewOnly}
          />
        </>
      );

    default:
      return null;
  }
};
