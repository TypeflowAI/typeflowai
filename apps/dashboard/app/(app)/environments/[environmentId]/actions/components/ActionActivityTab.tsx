"use client";

import { Code2Icon, MousePointerClickIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { convertDateTimeStringShort } from "@typeflowai/lib/time";
import { capitalizeFirstLetter } from "@typeflowai/lib/utils/strings";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import { Label } from "@typeflowai/ui/Label";
import { LoadingSpinner } from "@typeflowai/ui/LoadingSpinner";

import {
  getActionCountInLast7DaysAction,
  getActionCountInLast24HoursAction,
  getActionCountInLastHourAction,
  getActiveInactiveWorkflowsAction,
} from "../actions";

interface ActivityTabProps {
  actionClass: TActionClass;
  environmentId: string;
  isUserTargetingEnabled: boolean;
}

export const EventActivityTab = ({
  actionClass,
  environmentId,
  isUserTargetingEnabled,
}: ActivityTabProps) => {
  // const { eventClass, isLoadingEventClass, isErrorEventClass } = useEventClass(environmentId, actionClass.id);

  const [numEventsLastHour, setNumEventsLastHour] = useState<number | undefined>();
  const [numEventsLast24Hours, setNumEventsLast24Hours] = useState<number | undefined>();
  const [numEventsLast7Days, setNumEventsLast7Days] = useState<number | undefined>();
  const [activeWorkflows, setActiveWorkflows] = useState<string[] | undefined>();
  const [inactiveWorkflows, setInactiveWorkflows] = useState<string[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const updateState = async () => {
      try {
        setLoading(true);
        const [
          numEventsLastHourData,
          numEventsLast24HoursData,
          numEventsLast7DaysData,
          activeInactiveWorkflows,
        ] = await Promise.all([
          isUserTargetingEnabled ? getActionCountInLastHourAction(actionClass.id, environmentId) : 0,
          isUserTargetingEnabled ? getActionCountInLast24HoursAction(actionClass.id, environmentId) : 0,
          isUserTargetingEnabled ? getActionCountInLast7DaysAction(actionClass.id, environmentId) : 0,
          getActiveInactiveWorkflowsAction(actionClass.id, environmentId),
        ]);
        setNumEventsLastHour(numEventsLastHourData);
        setNumEventsLast24Hours(numEventsLast24HoursData);
        setNumEventsLast7Days(numEventsLast7DaysData);
        setActiveWorkflows(activeInactiveWorkflows.activeWorkflows);
        setInactiveWorkflows(activeInactiveWorkflows.inactiveWorkflows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    updateState();
  }, [actionClass.id, environmentId, isUserTargetingEnabled]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorComponent />;

  return (
    <div className="grid grid-cols-3 pb-2">
      <div className="col-span-2 space-y-4 pr-6">
        {isUserTargetingEnabled && (
          <div>
            <Label className="text-slate-500">Ocurrances</Label>
            <div className="mt-1 grid w-fit grid-cols-3 rounded-lg border-slate-100 bg-slate-50">
              <div className="border-r border-slate-200 px-4 py-2 text-center">
                <p className="font-bold text-slate-800">{numEventsLastHour}</p>
                <p className="text-xs text-slate-500">last hour</p>
              </div>
              <div className="border-r border-slate-200 px-4 py-2 text-center">
                <p className="font-bold text-slate-800">{numEventsLast24Hours}</p>
                <p className="text-xs text-slate-500">last 24 hours</p>
              </div>
              <div className="px-4 py-2 text-center">
                <p className="font-bold text-slate-800">{numEventsLast7Days}</p>
                <p className="text-xs text-slate-500">last week</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <Label className="text-slate-500">Active workflows</Label>
          {activeWorkflows?.length === 0 && <p className="text-sm text-slate-900">-</p>}
          {activeWorkflows?.map((workflowName) => (
            <p key={workflowName} className="text-sm text-slate-900">
              {workflowName}
            </p>
          ))}
        </div>
        <div>
          <Label className="text-slate-500">Inactive workflows</Label>
          {inactiveWorkflows?.length === 0 && <p className="text-sm text-slate-900">-</p>}
          {inactiveWorkflows?.map((workflowName) => (
            <p key={workflowName} className="text-sm text-slate-900">
              {workflowName}
            </p>
          ))}
        </div>
      </div>
      <div className="col-span-1 space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-2">
        <div>
          <Label className="text-xs font-normal text-slate-500">Created on</Label>
          <p className=" text-xs text-slate-700">
            {convertDateTimeStringShort(actionClass.createdAt?.toString())}
          </p>
        </div>{" "}
        <div>
          <Label className=" text-xs font-normal text-slate-500">Last updated</Label>
          <p className=" text-xs text-slate-700">
            {convertDateTimeStringShort(actionClass.updatedAt?.toString())}
          </p>
        </div>
        <div>
          <Label className="block text-xs font-normal text-slate-500">Type</Label>
          <div className="mt-1 flex items-center">
            <div className="mr-1.5  h-4 w-4 text-slate-600">
              {actionClass.type === "code" ? (
                <Code2Icon className="h-5 w-5" />
              ) : actionClass.type === "noCode" ? (
                <MousePointerClickIcon className="h-5 w-5" />
              ) : actionClass.type === "automatic" ? (
                <SparklesIcon className="h-5 w-5" />
              ) : null}
            </div>
            <p className="text-sm text-slate-700 ">{capitalizeFirstLetter(actionClass.type)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
