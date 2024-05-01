"use client";

import ResponseFeed from "@/app/(app)/environments/[environmentId]/people/[personId]/components/ResponsesFeed";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";

export default function ResponseTimeline({
  workflows,
  user,
  environment,
  responses,
  environmentTags,
}: {
  workflows: TWorkflow[];
  user: TUser;
  responses: TResponse[];
  environment: TEnvironment;
  environmentTags: TTag[];
}) {
  const [responsesAscending, setResponsesAscending] = useState(false);
  const [sortedResponses, setSortedResponses] = useState(responses);
  const toggleSortResponses = () => {
    setResponsesAscending(!responsesAscending);
  };

  useEffect(() => {
    setSortedResponses(responsesAscending ? [...responses].reverse() : responses);
  }, [responsesAscending, responses]);

  return (
    <div className="md:col-span-2">
      <div className="flex items-center justify-between pb-6">
        <h2 className="text-lg font-bold text-slate-700">Responses</h2>
        <div className="text-right">
          <button
            onClick={toggleSortResponses}
            className="hover:text-brand-dark flex items-center px-1 text-slate-800">
            <ArrowsUpDownIcon className="inline h-4 w-4" />
          </button>
        </div>
      </div>
      <ResponseFeed
        responses={sortedResponses}
        environment={environment}
        workflows={workflows}
        user={user}
        environmentTags={environmentTags}
      />
    </div>
  );
}
