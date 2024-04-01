import { useState } from "react";

import { TWorkflowOpenTextQuestion } from "@typeflowai/types/workflows";

import Headline from "./Headline";
import Subheader from "./Subheader";

interface OpenTextQuestionProps {
  question: TWorkflowOpenTextQuestion;
  onSubmit: (data: { [x: string]: any }) => void;
  lastQuestion: boolean;
  brandColor: string;
}

export default function OpenTextQuestion({
  question,
  onSubmit,
  lastQuestion,
  brandColor,
}: OpenTextQuestionProps) {
  const [value, setValue] = useState<string>("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const data = {
          [question.id]: value,
        };
        setValue(""); // reset value
        onSubmit(data);
      }}>
      <Headline headline={question.headline} questionId={question.id} />
      <Subheader subheader={question.subheader} questionId={question.id} />
      <div className="mt-4">
        <textarea
          rows={3}
          name={question.id}
          id={question.id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={question.placeholder}
          required={question.required}
          className="block w-full rounded-md border border-slate-100 bg-slate-50 p-2 shadow-sm focus:border-slate-500 focus:ring-0 sm:text-sm"></textarea>
      </div>
      <div className="mt-4 flex w-full justify-between">
        <div></div>
        <button
          type="submit"
          className="flex items-center rounded-md border border-transparent px-3 py-3 text-base font-medium leading-4 text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          style={{ backgroundColor: brandColor }}>
          {question.buttonLabel || (lastQuestion ? "Finish" : "Next")}
        </button>
      </div>
    </form>
  );
}
