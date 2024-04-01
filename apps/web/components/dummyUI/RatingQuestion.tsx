import { useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { TWorkflowRatingQuestion } from "@typeflowai/types/workflows";

import Headline from "./Headline";
import Subheader from "./Subheader";

interface RatingQuestionProps {
  question: TWorkflowRatingQuestion;
  onSubmit: (data: { [x: string]: any }) => void;
  lastQuestion: boolean;
  brandColor: string;
}

export default function RatingQuestion({
  question,
  onSubmit,
  lastQuestion,
  brandColor,
}: RatingQuestionProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleSelect = (number: number) => {
    setSelectedChoice(number);
    if (question.required) {
      onSubmit({
        [question.id]: number,
      });
      setSelectedChoice(null); // reset choice
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const data = {
          [question.id]: selectedChoice,
        };

        setSelectedChoice(null); // reset choice

        onSubmit(data);
      }}>
      <Headline headline={question.headline} questionId={question.id} />
      <Subheader subheader={question.subheader} questionId={question.id} />
      <div className="my-4">
        <fieldset>
          <legend className="sr-only">Options</legend>
          <div className="flex">
            {Array.from({ length: question.range }, (_, i) => i + 1).map((number) => (
              <label
                key={number}
                className={cn(
                  selectedChoice === number
                    ? "z-10 border-slate-400 bg-slate-50"
                    : "bg-white hover:bg-gray-100",
                  "relative h-10 flex-1 cursor-pointer border border-slate-100 text-center text-sm leading-10 text-slate-800 first:rounded-l-md last:rounded-r-md  focus:outline-none"
                )}>
                <input
                  type="radio"
                  name="rating"
                  value={number}
                  className="absolute h-full w-full cursor-pointer opacity-0"
                  onChange={() => handleSelect(number)}
                  required={question.required}
                />
                {number}
              </label>
            ))}
          </div>
          <div className="flex justify-between px-1.5 text-xs leading-6 text-slate-500">
            <p>{question.lowerLabel}</p>
            <p>{question.upperLabel}</p>
          </div>
        </fieldset>
      </div>
      {!question.required && (
        <div className="mt-4 flex w-full justify-between">
          <div></div>
          <button
            type="submit"
            className="flex items-center rounded-md border border-transparent px-3 py-3 text-base font-medium leading-4 text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            style={{ backgroundColor: brandColor }}>
            {question.buttonLabel || (lastQuestion ? "Finish" : "Next")}
          </button>
        </div>
      )}
    </form>
  );
}
