import { FilterIcon, UsersIcon } from "lucide-react";

import { TSegment } from "@typeflowai/types/segment";

const TargetingIndicator = ({ segment }: { segment: TSegment | null }) => {
  const doFiltersExist = !!segment?.filters?.length;

  return (
    <div className="ml-4 flex items-center gap-4">
      {doFiltersExist ? (
        <UsersIcon className="h-6 w-6 text-slate-800" />
      ) : (
        <FilterIcon className="h-6 w-6 text-slate-800" />
      )}

      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-slate-900">
          Audience: <span className="font-bold">{doFiltersExist ? "Targeted" : "Everyone"}</span>
        </h3>
        <p className="text-xs text-slate-500">
          {doFiltersExist
            ? "Only people who match your targeting can be workflowed."
            : "Without a filter, all of your users can be workflowed."}
        </p>
      </div>
    </div>
  );
};

export default TargetingIndicator;
