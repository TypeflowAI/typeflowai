import { convertFloatToNDecimal } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/lib/util";

import { TWorkflowQuestionSummaryCal } from "@typeflowai/types/workflows";
import { ProgressBar } from "@typeflowai/ui/ProgressBar";

import { QuestionSummaryHeader } from "./QuestionSummaryHeader";

interface CalSummaryProps {
  questionSummary: TWorkflowQuestionSummaryCal;
  environmentId: string;
}

export const CalSummary = ({ questionSummary }: CalSummaryProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <QuestionSummaryHeader questionSummary={questionSummary} />
      <div className="space-y-5 rounded-b-lg bg-white px-4 pb-6 pt-4 text-sm md:px-6 md:text-base">
        <div>
          <div className="text flex justify-between px-2 pb-2">
            <div className="mr-8 flex space-x-1">
              <p className="font-semibold text-slate-700">Booked</p>
              <div>
                <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                  {convertFloatToNDecimal(questionSummary.booked.percentage, 1)}%
                </p>
              </div>
            </div>
            <p className="flex w-32 items-end justify-end text-slate-600">
              {questionSummary.booked.count} {questionSummary.booked.count === 1 ? "response" : "responses"}
            </p>
          </div>
          <ProgressBar barColor="bg-brand" progress={questionSummary.booked.percentage / 100} />
        </div>
        <div>
          <div className="text flex justify-between px-2 pb-2">
            <div className="mr-8 flex space-x-1">
              <p className="font-semibold text-slate-700">Dismissed</p>
              <div>
                <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                  {convertFloatToNDecimal(questionSummary.skipped.percentage, 1)}%
                </p>
              </div>
            </div>
            <p className="flex w-32 items-end justify-end text-slate-600">
              {questionSummary.skipped.count} {questionSummary.skipped.count === 1 ? "response" : "responses"}
            </p>
          </div>
          <ProgressBar barColor="bg-brand" progress={questionSummary.skipped.percentage / 100} />
        </div>
      </div>
    </div>
  );
};
