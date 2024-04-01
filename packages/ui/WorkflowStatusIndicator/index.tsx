"use client";

import { ArchiveBoxIcon, CheckIcon, PauseIcon } from "@heroicons/react/24/solid";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";

interface WorkflowStatusIndicatorProps {
  status: string;
  tooltip?: boolean;
}

export function WorkflowStatusIndicator({ status, tooltip }: WorkflowStatusIndicatorProps) {
  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {status === "inProgress" && (
              <span className="relative  flex h-3 w-3">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
            )}
            {status === "paused" && (
              <div className=" rounded-full bg-slate-300 p-1">
                <PauseIcon className="h-3 w-3 text-slate-600" />
              </div>
            )}
            {status === "completed" && (
              <div className=" rounded-full bg-slate-200 p-1">
                <CheckIcon className="h-3 w-3 text-slate-600" />
              </div>
            )}
            {status === "archived" && (
              <div className=" rounded-full bg-slate-300 p-1">
                <ArchiveBoxIcon className="h-3 w-3 text-slate-600" />
              </div>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center space-x-2">
              {status === "inProgress" ? (
                <>
                  <span>Gathering responses</span>
                  <span className="relative  flex h-3 w-3">
                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                </>
              ) : status === "paused" ? (
                <>
                  <span className="text-slate-800">Workflow paused.</span>
                  <div className=" rounded-full bg-slate-300 p-1">
                    <PauseIcon className="h-3 w-3 text-slate-600" />
                  </div>
                </>
              ) : status === "completed" ? (
                <div className="flex items-center space-x-2">
                  <span>Workflow completed.</span>
                  <div className=" rounded-full bg-slate-200 p-1">
                    <CheckIcon className="h-3 w-3 text-slate-600" />
                  </div>
                </div>
              ) : status === "archived" ? (
                <div className="flex items-center space-x-2">
                  <span>Workflow archived.</span>
                  <div className=" rounded-full bg-slate-300 p-1">
                    <ArchiveBoxIcon className="h-3 w-3 text-slate-600" />
                  </div>
                </div>
              ) : null}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else
    return (
      <span>
        {status === "inProgress" && (
          <span className="relative  flex h-3 w-3">
            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
        )}
        {status === "paused" && (
          <div className=" rounded-full bg-slate-300 p-1">
            <PauseIcon className="h-3 w-3 text-slate-600" />
          </div>
        )}
        {status === "completed" && (
          <div className=" rounded-full bg-slate-200 p-1">
            <CheckIcon className="h-3 w-3 text-slate-600" />
          </div>
        )}
        {status === "archived" && (
          <div className=" rounded-full bg-slate-300 p-1">
            <ArchiveBoxIcon className="h-3 w-3 text-slate-600" />
          </div>
        )}
      </span>
    );
}
