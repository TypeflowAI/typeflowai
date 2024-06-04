import { ChevronDownIcon } from "lucide-react";

import { TFilterOption } from "@typeflowai/types/workflows";

import { Checkbox } from "../../Checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../DropdownMenu";

interface WorkflowFilterDropdownProps {
  title: string;
  id: "createdBy" | "status" | "type";
  options: TFilterOption[];
  selectedOptions: string[];
  setSelectedOptions: (value: string) => void;
  isOpen: boolean;
  toggleDropdown: (id: string) => void;
}

export const WorkflowFilterDropdown = ({
  title,
  id,
  options,
  selectedOptions,
  setSelectedOptions,
  isOpen,
  toggleDropdown,
}: WorkflowFilterDropdownProps) => {
  const triggerClasses = `workflowFilterDropdown min-w-auto h-8 rounded-md border border-violet-950 sm:px-2 cursor-pointer outline-none 
    ${selectedOptions.length > 0 ? "bg-brand text-slate-100" : "text-violet-950 hover:bg-brand hover:border-brand"}`;

  return (
    <DropdownMenu open={isOpen} onOpenChange={() => toggleDropdown(id)}>
      <DropdownMenuTrigger asChild className={triggerClasses}>
        <div className="flex w-full items-center justify-between">
          <span className="text-sm">{title}</span>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="m-0 p-0"
            onClick={(e) => {
              e.preventDefault();
              setSelectedOptions(option.value);
            }}>
            <div className="flex h-full w-full items-center space-x-2 px-2 py-1 hover:bg-slate-100">
              <Checkbox
                checked={selectedOptions.includes(option.value)}
                className={`bg-white ${selectedOptions.includes(option.value) ? "bg-brand border-none text-white" : ""}`}
              />
              <p className="font-normal text-violet-950">{option.label}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
