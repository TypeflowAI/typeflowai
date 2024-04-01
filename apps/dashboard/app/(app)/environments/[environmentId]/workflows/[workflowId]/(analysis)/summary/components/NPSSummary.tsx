import Headline from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/Headline";
import { questionTypes } from "@/app/lib/questions";
import { InboxStackIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";

import type { TWorkflowQuestionSummary } from "@typeflowai/types/workflows";
import { TWorkflowNPSQuestion } from "@typeflowai/types/workflows";
import { HalfCircle, ProgressBar } from "@typeflowai/ui/ProgressBar";

interface NPSSummaryProps {
  questionSummary: TWorkflowQuestionSummary<TWorkflowNPSQuestion>;
}

interface Result {
  promoters: number;
  passives: number;
  detractors: number;
  total: number;
  score: number;
}

interface ChoiceResult {
  label: string;
  count: number;
  percentage: number;
}

export default function NPSSummary({ questionSummary }: NPSSummaryProps) {
  const percentage = (count, total) => {
    const result = count / total;
    return result || 0;
  };

  const questionTypeInfo = questionTypes.find((type) => type.id === questionSummary.question.type);

  const result: Result = useMemo(() => {
    let data = {
      promoters: 0,
      passives: 0,
      detractors: 0,
      total: 0,
      score: 0,
    };

    for (let response of questionSummary.responses) {
      const value = response.value;
      if (typeof value !== "number") continue;

      data.total++;
      if (value >= 9) {
        data.promoters++;
      } else if (value >= 7) {
        data.passives++;
      } else {
        data.detractors++;
      }
    }

    data.score = (percentage(data.promoters, data.total) - percentage(data.detractors, data.total)) * 100;
    return data;
  }, [questionSummary]);

  const dismissed: ChoiceResult = useMemo(() => {
    if (questionSummary.question.required) return { count: 0, label: "Dismissed", percentage: 0 };

    const total = questionSummary.responses.length;
    let count = 0;
    for (const response of questionSummary.responses) {
      if (!response.value) {
        count += 1;
      }
    }
    return {
      count,
      label: "Dismissed",
      percentage: count / total,
    };
  }, [questionSummary]);

  return (
    <div className=" rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <div className="space-y-2 px-4 pb-5 pt-6 md:px-6">
        <Headline headline={questionSummary.question.headline} />

        <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm">
          <div className="flex items-center rounded-lg bg-slate-100 p-2">
            {questionTypeInfo && <questionTypeInfo.icon className="mr-2 h-4 w-4 " />}
            {questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"}
          </div>
          <div className=" flex items-center rounded-lg bg-slate-100 p-2">
            <InboxStackIcon className="mr-2 h-4 w-4 " />
            {result.total} responses
          </div>
          {!questionSummary.question.required && (
            <div className="flex items-center  rounded-lg bg-slate-100 p-2">Optional</div>
          )}
        </div>
      </div>
      <div className="space-y-5 rounded-b-lg bg-white px-4 pb-6 pt-4 text-sm md:px-6 md:text-base">
        {["promoters", "passives", "detractors"].map((group) => (
          <div key={group}>
            <div className="mb-2 flex justify-between">
              <div className="mr-8 flex space-x-1">
                <p className="font-semibold capitalize text-slate-700">{group}</p>
                <div>
                  <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                    {Math.round(percentage(result[group], result.total) * 100)}%
                  </p>
                </div>
              </div>
              <p className="flex w-32 items-end justify-end text-slate-600">
                {result[group]} {result[group] === 1 ? "response" : "responses"}
              </p>
            </div>
            <ProgressBar barColor="bg-brand" progress={percentage(result[group], result.total)} />
          </div>
        ))}
      </div>
      {dismissed.count > 0 && (
        <div className="border-t bg-white px-4 pb-6 pt-4 text-sm md:px-6 md:text-base">
          <div key={dismissed.label}>
            <div className="text flex justify-between px-2 pb-2">
              <div className="mr-8 flex space-x-1">
                <p className="font-semibold text-slate-700">{dismissed.label}</p>
                <div>
                  <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                    {Math.round(dismissed.percentage * 100)}%
                  </p>
                </div>
              </div>
              <p className="flex w-32 items-end justify-end text-slate-600">
                {dismissed.count} {dismissed.count === 1 ? "response" : "responses"}
              </p>
            </div>
            <ProgressBar barColor="bg-slate-600" progress={dismissed.percentage} />
          </div>
        </div>
      )}
      <div className="flex justify-center rounded-b-lg bg-white pb-4 pt-4">
        <HalfCircle value={result.score} />
      </div>
    </div>
  );
}
