"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TWorkflow, TWorkflowFilters } from "@typeflowai/types/workflows";

import { Button } from "../v2/Button";
import { getWorkflowsAction } from "./actions";
import { AddAIToolModal } from "./components/AddAIToolModal";
import { WorkflowCard } from "./components/WorkflowCard";
import { WorkflowFilters } from "./components/WorkflowFilters";
import { getFormattedFilters } from "./utils";

interface WorkflowsListProps {
  environment: TEnvironment;
  otherEnvironment: TEnvironment;
  isViewer: boolean;
  WEBAPP_URL: string;
  userId: string;
  workflowsPerPage: number;
  workflowCount: number;
  isTypeflowAICloud: boolean;
  isAIToolsLimited: boolean;
}

export const initialFilters: TWorkflowFilters = {
  name: "",
  createdBy: [],
  status: [],
  type: [],
  sortBy: "updatedAt",
};

export const WorkflowsList = ({
  environment,
  otherEnvironment,
  isViewer,
  WEBAPP_URL,
  userId,
  workflowsPerPage: workflowsLimit,
  workflowCount,
  isTypeflowAICloud,
  isAIToolsLimited,
}: WorkflowsListProps) => {
  const [workflows, setWorkflows] = useState<TWorkflow[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [workflowFilters, setWorkflowFilters] = useState<TWorkflowFilters>(initialFilters);

  const filters = useMemo(() => getFormattedFilters(workflowFilters, userId), [workflowFilters, userId]);

  const [orientation, setOrientation] = useState("");

  const [addAIToolModalOpen, setAddAIToolModalOpen] = useState(false);
  const isAddAIToolsLimited = isAIToolsLimited && workflowCount >= 2 ? true : false;

  useEffect(() => {
    // Initialize orientation state with a function that checks if window is defined
    const orientationFromLocalStorage = localStorage.getItem("workflowOrientation");
    if (orientationFromLocalStorage) {
      setOrientation(orientationFromLocalStorage);
    } else {
      setOrientation("grid");
      localStorage.setItem("workflowOrientation", "list");
    }
  }, []);

  useEffect(() => {
    async function fetchInitialWorkflows() {
      setIsFetching(true);
      const res = await getWorkflowsAction(environment.id, workflowsLimit, undefined, filters);
      if (res.length < workflowsLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setWorkflows(res);
      setIsFetching(false);
    }
    fetchInitialWorkflows();
  }, [environment.id, workflowsLimit, filters]);

  const fetchNextPage = useCallback(async () => {
    setIsFetching(true);
    const newWorkflows = await getWorkflowsAction(environment.id, workflowsLimit, workflows.length, filters);
    if (newWorkflows.length === 0 || newWorkflows.length < workflowsLimit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setWorkflows([...workflows, ...newWorkflows]);
    setIsFetching(false);
  }, [environment.id, workflows, workflowsLimit, filters]);

  const handleDeleteWorkflow = async (workflowId: string) => {
    const newWorkflows = workflows.filter((workflow) => workflow.id !== workflowId);
    setWorkflows(newWorkflows);
  };

  const handleDuplicateWorkflow = async (workflow: TWorkflow) => {
    const newWorkflows = [workflow, ...workflows];
    setWorkflows(newWorkflows);
  };

  return (
    <div className="space-y-6">
      <WorkflowFilters
        orientation={orientation}
        setOrientation={setOrientation}
        workflowFilters={workflowFilters}
        setWorkflowFilters={setWorkflowFilters}
      />
      {workflows.length > 0 ? (
        <div>
          {orientation === "list" && (
            <div className="flex-col space-y-3">
              <div className="mt-6 grid w-full grid-cols-8 place-items-center gap-3 px-6 text-sm text-slate-800">
                <div className="col-span-4 place-self-start">Name</div>
                <div className="col-span-4 grid w-full grid-cols-5 place-items-center">
                  <div className="col-span-2">Created at</div>
                  <div className="col-span-2">Updated at</div>
                </div>
              </div>
              {workflows.map((workflow) => {
                return (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    environment={environment}
                    otherEnvironment={otherEnvironment}
                    isViewer={isViewer}
                    WEBAPP_URL={WEBAPP_URL}
                    orientation={orientation}
                    duplicateWorkflow={handleDuplicateWorkflow}
                    deleteWorkflow={handleDeleteWorkflow}
                    isAIToolsLimited={isAddAIToolsLimited}
                    openAddAIToolModal={setAddAIToolModalOpen}
                  />
                );
              })}
            </div>
          )}
          {orientation === "grid" && (
            <div className="grid grid-cols-2 place-content-stretch gap-4 lg:grid-cols-3 2xl:grid-cols-5">
              {workflows.map((workflow) => {
                return (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    environment={environment}
                    otherEnvironment={otherEnvironment}
                    isViewer={isViewer}
                    WEBAPP_URL={WEBAPP_URL}
                    orientation={orientation}
                    duplicateWorkflow={handleDuplicateWorkflow}
                    deleteWorkflow={handleDeleteWorkflow}
                    isAIToolsLimited={isAddAIToolsLimited}
                    openAddAIToolModal={setAddAIToolModalOpen}
                  />
                );
              })}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center py-5">
              <Button onClick={fetchNextPage} variant="secondary" size="sm" loading={isFetching}>
                Load more
              </Button>
            </div>
          )}

          <AddAIToolModal
            open={addAIToolModalOpen}
            setOpen={setAddAIToolModalOpen}
            environmentId={environment.id}
            isTypeflowAICloud={isTypeflowAICloud}
          />
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <span className="mb-4 h-24 w-24 rounded-full bg-slate-100 p-6 text-5xl">🕵️</span>

          <div className="text-slate-600">{isFetching ? "Fetching workflows..." : "No workflows found"}</div>
        </div>
      )}
    </div>
  );
};
