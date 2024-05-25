import { TI18nString } from "@typeflowai/types/workflows";

interface HeadlineProps {
  headline?: TI18nString | string;
  questionId: string;
  required?: boolean;
  alignTextCenter?: boolean;
}

export default function Headline({
  headline,
  questionId,
  required = true,
  alignTextCenter = false,
}: HeadlineProps) {
  return (
    <label htmlFor={questionId} className="text-heading mb-1.5 block text-base font-semibold leading-6">
      <div className={`flex items-center  ${alignTextCenter ? "justify-center" : "justify-between"}`}>
        {headline}
        {!required && (
          <span
            className="text-heading mx-2 self-start text-sm font-normal leading-7 opacity-60"
            tabIndex={-1}>
            Optional
          </span>
        )}
      </div>
    </label>
  );
}
