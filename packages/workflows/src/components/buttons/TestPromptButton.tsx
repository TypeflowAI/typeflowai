import { cn } from "@/lib/utils";

interface TestPromptButtonProps {
  title?: string;
  ariaLabel?: string;
  onClick: () => void;
  label?: string;
}

export default function TestPromptButton({ title, ariaLabel, onClick, label }: TestPromptButtonProps) {
  return (
    <>
      <button
        type={"button"}
        title={title}
        aria-label={ariaLabel}
        className={cn(
          "border-back-button-border text-heading focus:ring-focus bg-brand flex items-center rounded-md border px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:text-slate-50 hover:opacity-90 focus:outline-none  focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
        )}
        onClick={onClick}>
        {label}
        <div className="h-5">
          {label === "Test Prompt" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="-mr-1 ml-2 inline h-5 w-5 rtl:mr-2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
          )}
        </div>
      </button>
    </>
  );
}
