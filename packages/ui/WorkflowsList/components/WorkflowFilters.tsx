import { ChevronDownIcon, Equal, Grid2X2, Search, X } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "react-use";

import { TFilterOption, TSortOption, TWorkflowFilters } from "@typeflowai/types/workflows";

import { initialFilters } from "..";
import { Button } from "../../Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../DropdownMenu";
import { TooltipRenderer } from "../../Tooltip";
import { SortOption } from "./SortOption";
import { WorkflowFilterDropdown } from "./WorkflowFilterDropdown";

interface WorkflowFilterProps {
  orientation: string;
  setOrientation: (orientation: string) => void;
  workflowFilters: TWorkflowFilters;
  setWorkflowFilters: React.Dispatch<React.SetStateAction<TWorkflowFilters>>;
}

const creatorOptions: TFilterOption[] = [
  { label: "You", value: "you" },
  { label: "Others", value: "others" },
];

const statusOptions: TFilterOption[] = [
  { label: "In Progress", value: "inProgress" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
  { label: "Draft", value: "draft" },
];
const typeOptions: TFilterOption[] = [
  { label: "Link", value: "link" },
  { label: "App", value: "app" },
  { label: "Website", value: "website" },
];

const sortOptions: TSortOption[] = [
  {
    label: "Last Modified",
    value: "updatedAt",
  },
  {
    label: "Created On",
    value: "createdAt",
  },
  {
    label: "Alphabetical",
    value: "name",
  },
  // Add other sorting options as needed
];

const getToolTipContent = (orientation: string) => {
  return <div>{orientation} View</div>;
};

export const WorkflowFilters = ({
  orientation,
  setOrientation,
  workflowFilters,
  setWorkflowFilters,
}: WorkflowFilterProps) => {
  const { createdBy, sortBy, status, type } = workflowFilters;
  const [name, setName] = useState("");

  useDebounce(() => setWorkflowFilters((prev) => ({ ...prev, name: name })), 800, [name]);

  const [dropdownOpenStates, setDropdownOpenStates] = useState(new Map());

  const toggleDropdown = (id: string) => {
    setDropdownOpenStates(new Map(dropdownOpenStates).set(id, !dropdownOpenStates.get(id)));
  };

  const handleCreatedByChange = (value: string) => {
    if (value === "you" || value === "others") {
      if (createdBy.includes(value)) {
        setWorkflowFilters((prev) => ({ ...prev, createdBy: prev.createdBy.filter((v) => v !== value) }));
      } else {
        setWorkflowFilters((prev) => ({ ...prev, createdBy: [...prev.createdBy, value] }));
      }
    }
  };

  const handleStatusChange = (value: string) => {
    if (
      value === "inProgress" ||
      value === "paused" ||
      value === "completed" ||
      value === "draft" ||
      value === "scheduled"
    ) {
      if (status.includes(value)) {
        setWorkflowFilters((prev) => ({ ...prev, status: prev.status.filter((v) => v !== value) }));
      } else {
        setWorkflowFilters((prev) => ({ ...prev, status: [...prev.status, value] }));
      }
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === "link" || value === "app" || value === "website") {
      if (type.includes(value)) {
        setWorkflowFilters((prev) => ({ ...prev, type: prev.type.filter((v) => v !== value) }));
      } else {
        setWorkflowFilters((prev) => ({ ...prev, type: [...prev.type, value] }));
      }
    }
  };

  const handleSortChange = (option: TSortOption) => {
    setWorkflowFilters((prev) => ({ ...prev, sortBy: option.value }));
  };

  const handleOrientationChange = (value: string) => {
    setOrientation(value);
    localStorage.setItem("workflowOrientation", value);
  };

  return (
    <div className="flex justify-between">
      <div className="flex space-x-2">
        <div className="flex h-8 items-center rounded-lg border border-slate-300 bg-white px-4">
          <Search className="h-4 w-4" />
          <input
            type="text"
            className="border-none bg-transparent placeholder:text-sm"
            placeholder="Search by workflow name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <WorkflowFilterDropdown
            title="Created By"
            id="createdBy"
            options={creatorOptions}
            selectedOptions={createdBy}
            setSelectedOptions={handleCreatedByChange}
            isOpen={dropdownOpenStates.get("createdBy")}
            toggleDropdown={toggleDropdown}
          />
        </div>
        <div>
          <WorkflowFilterDropdown
            title="Status"
            id="status"
            options={statusOptions}
            selectedOptions={status}
            setSelectedOptions={handleStatusChange}
            isOpen={dropdownOpenStates.get("status")}
            toggleDropdown={toggleDropdown}
          />
        </div>
        <div>
          <WorkflowFilterDropdown
            title="Type"
            id="type"
            options={typeOptions}
            selectedOptions={type}
            setSelectedOptions={handleTypeChange}
            isOpen={dropdownOpenStates.get("type")}
            toggleDropdown={toggleDropdown}
          />
        </div>

        {(createdBy.length > 0 || status.length > 0 || type.length > 0) && (
          <Button
            variant="darkCTA"
            size="sm"
            onClick={() => {
              setWorkflowFilters(initialFilters);
            }}
            className="h-8"
            EndIcon={X}
            endIconClassName="h-4 w-4">
            Clear Filters
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <TooltipRenderer
          shouldRender={true}
          tooltipContent={getToolTipContent("List")}
          className="bg-brand text-white">
          <div
            className={`flex  h-8 w-8  items-center justify-center  rounded-lg border  p-1 ${
              orientation === "list" ? "bg-brand text-white" : "bg-white text-violet-950"
            }`}
            onClick={() => handleOrientationChange("list")}>
            <Equal className="h-5 w-5" />
          </div>
        </TooltipRenderer>

        <TooltipRenderer
          shouldRender={true}
          tooltipContent={getToolTipContent("Grid")}
          className="bg-brand text-white">
          <div
            className={`flex h-8 w-8  items-center justify-center rounded-lg border  p-1 ${
              orientation === "grid" ? "bg-brand text-white" : "bg-white text-violet-950"
            }`}
            onClick={() => handleOrientationChange("grid")}>
            <Grid2X2 className="h-5 w-5" />
          </div>
        </TooltipRenderer>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="workflowFilterDropdown hover:bg-brand hover:border-brand h-full cursor-pointer border border-violet-950 text-violet-950 outline-none hover:text-white">
            <div className="min-w-auto h-8 rounded-md border sm:flex sm:px-2">
              <div className="hidden w-full items-center justify-between sm:flex">
                <span className="text-sm ">
                  Sort by: {sortOptions.find((option) => option.value === sortBy)?.label}
                </span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white ">
            {sortOptions.map((option) => (
              <SortOption
                option={option}
                key={option.label}
                sortBy={workflowFilters.sortBy}
                handleSortChange={handleSortChange}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
