import Headline from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/Headline";
import { questionTypes } from "@/app/lib/questions";
import { InboxStackIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useMemo } from "react";
import { useState } from "react";

import { getPersonIdentifier } from "@typeflowai/lib/person/util";
import { TWorkflowQuestionType } from "@typeflowai/types/workflows";
import type { TWorkflowQuestionSummary } from "@typeflowai/types/workflows";
import {
  TWorkflowMultipleChoiceMultiQuestion,
  TWorkflowMultipleChoiceSingleQuestion,
} from "@typeflowai/types/workflows";
import { PersonAvatar } from "@typeflowai/ui/Avatars";
import { ProgressBar } from "@typeflowai/ui/ProgressBar";

interface MultipleChoiceSummaryProps {
  questionSummary: TWorkflowQuestionSummary<
    TWorkflowMultipleChoiceMultiQuestion | TWorkflowMultipleChoiceSingleQuestion
  >;
  environmentId: string;
  workflowType: string;
  responsesPerPage: number;
}

interface ChoiceResult {
  id: string;
  label: string;
  count: number;
  percentage?: number;
  otherValues?: {
    value: string;
    person: {
      id: string;
      name?: string;
      email?: string;
    };
  }[];
}

export default function MultipleChoiceSummary({
  questionSummary,
  environmentId,
  workflowType,
  responsesPerPage,
}: MultipleChoiceSummaryProps) {
  const isSingleChoice = questionSummary.question.type === TWorkflowQuestionType.MultipleChoiceSingle;
  const [otherDisplayCount, setOtherDisplayCount] = useState(responsesPerPage);
  const questionTypeInfo = questionTypes.find((type) => type.id === questionSummary.question.type);

  const results: ChoiceResult[] = useMemo(() => {
    if (!("choices" in questionSummary.question)) return [];

    // build a dictionary of choices
    const resultsDict: { [key: string]: ChoiceResult } = {};
    for (const choice of questionSummary.question.choices) {
      resultsDict[choice.label] = {
        id: choice.id,
        label: choice.label,
        count: 0,
        percentage: 0,
        otherValues: [],
      };
    }

    const addOtherChoice = (response, value) => {
      for (const key in resultsDict) {
        if (resultsDict[key].id === "other" && value !== "") {
          const displayIdentifier = getPersonIdentifier(response.person);
          resultsDict[key].otherValues?.push({
            value,
            person: {
              id: response.personId,
              email: typeof displayIdentifier === "string" ? displayIdentifier : undefined,
            },
          });
          resultsDict[key].count += 1;
          break;
        }
      }
    };

    // count the responses
    for (const response of questionSummary.responses) {
      // if single choice, only add responses that are in the choices
      if (isSingleChoice && response.value.toString() in resultsDict) {
        resultsDict[response.value.toString()].count += 1;
      } else if (isSingleChoice) {
        // if single choice and not in choices, add to other
        addOtherChoice(response, response.value);
      } else if (Array.isArray(response.value)) {
        // if multi choice add all responses
        for (const choice of response.value) {
          if (choice in resultsDict) {
            resultsDict[choice].count += 1;
          } else {
            // if multi choice and not in choices, add to other
            addOtherChoice(response, choice);
          }
        }
      }
    }
    // add the percentage
    const total = questionSummary.responses.length;
    for (const key of Object.keys(resultsDict)) {
      if (resultsDict[key].count) {
        resultsDict[key].percentage = resultsDict[key].count / total;
      }
    }

    // sort by count and transform to array
    const results = Object.values(resultsDict).sort((a: any, b: any) => {
      if (a.id === "other") return 1; // Always put a after b if a's id is 'other'
      if (b.id === "other") return -1; // Always put b after a if b's id is 'other'

      // If neither id is 'other', compare counts
      return b.count - a.count;
    });
    return results;
  }, [questionSummary, isSingleChoice]);

  const totalResponses = useMemo(() => {
    let total = 0;
    for (const result of results) {
      total += result.count;
    }
    return total;
  }, [results]);

  return (
    <div className=" rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <div className="space-y-2 px-4 pb-5 pt-6 md:px-6">
        <Headline headline={questionSummary.question.headline} />

        <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm">
          <div className="flex items-center rounded-lg bg-slate-100 p-2">
            {questionTypeInfo && <questionTypeInfo.icon className="mr-2 h-4 w-4 " />}
            Multiple-Choice {questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"} Question
          </div>
          <div className="flex items-center rounded-lg bg-slate-100 p-2">
            <InboxStackIcon className="mr-2 h-4 w-4 " />
            {totalResponses} responses
          </div>
          {!questionSummary.question.required && (
            <div className="flex items-center  rounded-lg bg-slate-100 p-2">Optional</div>
          )}
          {/*           <div className=" flex items-center rounded-lg bg-slate-100 p-2">
            <ArrowTrendingUpIcon className="mr-2 h-4 w-4" />
            2.8 average
          </div> */}
        </div>
      </div>
      <div className="space-y-5 rounded-b-lg bg-white px-4 pb-6 pt-4 text-sm md:px-6 md:text-base">
        {results.map((result: any, resultsIdx) => (
          <div key={result.label}>
            <div className="text flex flex-col justify-between px-2 pb-2 sm:flex-row">
              <div className="mr-8 flex w-full justify-between space-x-1 sm:justify-normal">
                <p className="font-semibold text-slate-700">
                  {results.length - resultsIdx} - {result.label}
                </p>
                <div>
                  <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                    {Math.round(result.percentage * 100)}%
                  </p>
                </div>
              </div>
              <p className="flex w-full pt-1 text-slate-600 sm:items-end sm:justify-end sm:pt-0">
                {result.count} {result.count === 1 ? "response" : "responses"}
              </p>
            </div>
            <ProgressBar barColor="bg-brand" progress={result.percentage} />
            {result.otherValues.length > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200">
                <div className="grid h-12 grid-cols-2 content-center rounded-t-lg bg-slate-100 text-left text-sm font-semibold text-slate-900">
                  <div className="col-span-1 pl-6 ">Specified &quot;Other&quot; answers</div>
                  <div className="col-span-1 pl-6 ">{workflowType === "web" && "User"}</div>
                </div>
                {result.otherValues
                  .filter((otherValue) => otherValue !== "")
                  .slice(0, otherDisplayCount)
                  .map((otherValue, idx) => (
                    <div key={idx}>
                      {workflowType === "link" && (
                        <div
                          key={idx}
                          className="ph-no-capture col-span-1 m-2 flex h-10 items-center rounded-lg pl-4 text-sm font-medium text-slate-900">
                          <span>{otherValue.value}</span>
                        </div>
                      )}
                      {workflowType === "web" && (
                        <Link
                          href={
                            otherValue.person.id
                              ? `/environments/${environmentId}/people/${otherValue.person.id}`
                              : { pathname: null }
                          }
                          key={idx}
                          className="m-2 grid h-16 grid-cols-2 items-center rounded-lg text-sm hover:bg-slate-100">
                          <div className="ph-no-capture col-span-1 pl-4 font-medium text-slate-900">
                            <span>{otherValue.value}</span>
                          </div>
                          <div className="ph-no-capture col-span-1 flex items-center space-x-4 pl-6 font-medium text-slate-900">
                            {otherValue.person.id && <PersonAvatar personId={otherValue.person.id} />}
                            <span>{getPersonIdentifier(otherValue.person)}</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                {otherDisplayCount < result.otherValues.length && (
                  <div className="flex w-full items-center justify-center">
                    <button
                      onClick={() => setOtherDisplayCount(otherDisplayCount + responsesPerPage)}
                      className="my-2 flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                      Show more
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
