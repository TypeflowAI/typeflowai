import Headline from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/Headline";
import { questionTypes } from "@/app/lib/questions";
import { InboxStackIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React, { useState } from "react";

import { getPersonIdentifier } from "@typeflowai/lib/person/util";
import { timeSince } from "@typeflowai/lib/time";
import { formatDateWithOrdinal } from "@typeflowai/lib/utils/datetime";
import type { TWorkflowDateQuestion, TWorkflowQuestionSummary } from "@typeflowai/types/workflows";
import { PersonAvatar } from "@typeflowai/ui/Avatars";

interface DateQuestionSummary {
  questionSummary: TWorkflowQuestionSummary<TWorkflowDateQuestion>;
  environmentId: string;
  responsesPerPage: number;
}

export default function DateQuestionSummary({
  questionSummary,
  environmentId,
  responsesPerPage,
}: DateQuestionSummary) {
  const questionTypeInfo = questionTypes.find((type) => type.id === questionSummary.question.type);
  const [displayCount, setDisplayCount] = useState(responsesPerPage);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <div className="space-y-2 px-4 pb-5 pt-6 md:px-6">
        <Headline headline={questionSummary.question.headline} />

        <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm">
          <div className="flex items-center rounded-lg bg-slate-100 p-2 ">
            {questionTypeInfo && <questionTypeInfo.icon className="mr-2 h-4 w-4 " />}
            {questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"} Question
          </div>
          <div className=" flex items-center rounded-lg bg-slate-100 p-2">
            <InboxStackIcon className="mr-2 h-4 w-4" />
            {questionSummary.responses.length} Responses
          </div>
          {!questionSummary.question.required && (
            <div className="flex items-center  rounded-lg bg-slate-100 p-2">Optional</div>
          )}
        </div>
      </div>
      <div className="rounded-b-lg bg-white ">
        <div className="grid h-10 grid-cols-4 items-center border-y border-slate-200 bg-slate-100 text-sm font-bold text-slate-600">
          <div className="pl-4 md:pl-6">User</div>
          <div className="col-span-2 pl-4 md:pl-6">Response</div>
          <div className="px-4 md:px-6">Time</div>
        </div>
        {questionSummary.responses.slice(0, displayCount).map((response) => {
          const displayIdentifier = getPersonIdentifier(response.person!);
          return (
            <div
              key={response.id}
              className="grid grid-cols-4 items-center border-b border-slate-100 py-2 text-sm text-slate-800 md:text-base">
              <div className="pl-4 md:pl-6">
                {response.person ? (
                  <Link
                    className="ph-no-capture group flex items-center"
                    href={`/environments/${environmentId}/people/${response.person.id}`}>
                    <div className="hidden md:flex">
                      <PersonAvatar personId={response.person.id} />
                    </div>
                    <p className="ph-no-capture break-all text-slate-600 group-hover:underline md:ml-2">
                      {displayIdentifier}
                    </p>
                  </Link>
                ) : (
                  <div className="group flex items-center">
                    <div className="hidden md:flex">
                      <PersonAvatar personId="anonymous" />
                    </div>
                    <p className="break-all text-slate-600 md:ml-2">Anonymous</p>
                  </div>
                )}
              </div>
              <div className="ph-no-capture col-span-2 whitespace-pre-wrap pl-6 font-semibold">
                {formatDateWithOrdinal(new Date(response.value as string))}
              </div>
              <div className="px-4 text-slate-500 md:px-6">{timeSince(response.updatedAt.toISOString())}</div>
            </div>
          );
        })}

        {displayCount < questionSummary.responses.length && (
          <div className="my-1 flex justify-center">
            <button
              onClick={() => setDisplayCount((prevCount) => prevCount + responsesPerPage)}
              className="my-2 flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
