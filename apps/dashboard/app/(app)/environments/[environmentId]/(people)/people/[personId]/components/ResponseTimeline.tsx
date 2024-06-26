"use client";

import { ResponseFeed } from "@/app/(app)/environments/[environmentId]/(people)/people/[personId]/components/ResponsesFeed";
import { ArrowDownUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";

interface ResponseTimelineProps {
  workflows: TWorkflow[];
  user: TUser;
  responses: TResponse[];
  environment: TEnvironment;
  environmentTags: TTag[];
  attributeClasses: TAttributeClass[];
}

export const ResponseTimeline = ({
  workflows,
  user,
  environment,
  responses,
  environmentTags,
  attributeClasses,
}: ResponseTimelineProps) => {
  const [sortedResponses, setSortedResponses] = useState(responses);
  const toggleSortResponses = () => {
    setSortedResponses([...sortedResponses].reverse());
  };

  useEffect(() => {
    setSortedResponses(responses);
  }, [responses]);

  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between pb-6">
        <h2 className="text-lg font-bold text-slate-700">Responses</h2>
        <div className="text-right">
          <button
            type="button"
            onClick={toggleSortResponses}
            className="hover:text-brand-dark flex items-center px-1 text-slate-800">
            <ArrowDownUpIcon className="inline h-4 w-4" />
          </button>
        </div>
      </div>
      <ResponseFeed
        responses={sortedResponses}
        environment={environment}
        workflows={workflows}
        user={user}
        environmentTags={environmentTags}
        attributeClasses={attributeClasses}
      />
    </div>
  );
};
