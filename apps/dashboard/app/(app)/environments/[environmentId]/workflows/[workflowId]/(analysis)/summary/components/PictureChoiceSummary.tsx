import Image from "next/image";

import { TWorkflowQuestionSummaryPictureSelection } from "@typeflowai/types/workflows";
import { ProgressBar } from "@typeflowai/ui/ProgressBar";

import { convertFloatToNDecimal } from "../lib/util";
import { QuestionSummaryHeader } from "./QuestionSummaryHeader";

interface PictureChoiceSummaryProps {
  questionSummary: TWorkflowQuestionSummaryPictureSelection;
}

export const PictureChoiceSummary = ({ questionSummary }: PictureChoiceSummaryProps) => {
  const results = questionSummary.choices.sort((a, b) => b.count - a.count);

  return (
    <div className=" rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <QuestionSummaryHeader questionSummary={questionSummary} />
      <div className="space-y-5 rounded-b-lg bg-white px-4 pb-6 pt-4 text-sm md:px-6 md:text-base">
        {results.map((result) => (
          <div key={result.id}>
            <div className="text flex flex-col justify-between px-2 pb-2 sm:flex-row">
              <div className="mr-8 flex w-full justify-between space-x-1 sm:justify-normal ">
                <div className="relative h-32 w-[220px]">
                  <Image
                    src={result.imageUrl}
                    alt="choice-image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="self-end">
                  <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                    {convertFloatToNDecimal(result.percentage, 1)}%
                  </p>
                </div>
              </div>
              <p className="flex w-full pt-1 text-slate-600 sm:items-end sm:justify-end sm:pt-0">
                {result.count} {result.count === 1 ? "response" : "responses"}
              </p>
            </div>
            <ProgressBar barColor="bg-brand" progress={result.percentage / 100 || 0} />
          </div>
        ))}
      </div>
    </div>
  );
};
