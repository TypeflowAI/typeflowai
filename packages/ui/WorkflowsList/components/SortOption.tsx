import { TSortOption, TWorkflowFilters } from "@typeflowai/types/workflows";

import { DropdownMenuItem } from "../../DropdownMenu";

interface SortOptionProps {
  option: TSortOption;
  sortBy: TWorkflowFilters["sortBy"];
  handleSortChange: (option: TSortOption) => void;
}

export const SortOption = ({ option, sortBy, handleSortChange }: SortOptionProps) => (
  <DropdownMenuItem
    key={option.label}
    className="m-0 p-0"
    onClick={() => {
      handleSortChange(option);
    }}>
    <div className="flex h-full w-full items-center space-x-2 px-2 py-1 hover:bg-slate-100">
      <span
        className={`h-4 w-4 rounded-full border ${
          sortBy === option.value ? "bg-brand border-none outline-none outline" : "border-brand"
        }`}></span>
      <p className="font-normal text-slate-700">{option.label}</p>
    </div>
  </DropdownMenuItem>
);
