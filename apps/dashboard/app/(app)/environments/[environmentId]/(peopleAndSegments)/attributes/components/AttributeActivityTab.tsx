"use client";

import { TagIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { capitalizeFirstLetter } from "@typeflowai/lib/strings";
import { convertDateTimeStringShort } from "@typeflowai/lib/time";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import { Label } from "@typeflowai/ui/Label";
import LoadingSpinner from "@typeflowai/ui/LoadingSpinner";

import { getSegmentsByAttributeClassAction } from "../actions";

interface EventActivityTabProps {
  attributeClass: TAttributeClass;
}

export default function AttributeActivityTab({ attributeClass }: EventActivityTabProps) {
  const [activeWorkflows, setActiveWorkflows] = useState<string[] | undefined>();
  const [inactiveWorkflows, setInactiveWorkflows] = useState<string[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    getWorkflows();

    async function getWorkflows() {
      try {
        setLoading(true);
        const segmentsWithAttributeClassName = await getSegmentsByAttributeClassAction(
          attributeClass.environmentId,
          attributeClass
        );

        setActiveWorkflows(segmentsWithAttributeClassName.activeWorkflows);
        setInactiveWorkflows(segmentsWithAttributeClassName.inactiveWorkflows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  }, [attributeClass, attributeClass.environmentId, attributeClass.id, attributeClass.name]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorComponent />;

  return (
    <div className="grid grid-cols-3 pb-2">
      <div className="col-span-2 space-y-4 pr-6">
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
            {convertDateTimeStringShort(attributeClass.createdAt.toString())}
          </p>
        </div>{" "}
        <div>
          <Label className=" text-xs font-normal text-slate-500">Last updated</Label>
          <p className=" text-xs text-slate-700">
            {convertDateTimeStringShort(attributeClass.updatedAt.toString())}
          </p>
        </div>
        <div>
          <Label className="block text-xs font-normal text-slate-500">Type</Label>
          <div className="mt-1 flex items-center">
            <div className="mr-1.5  h-4 w-4 text-slate-600">
              <TagIcon className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-700 ">{capitalizeFirstLetter(attributeClass.type)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
