import { cn } from "@/lib/utils";

interface StartOverButtonProps {
  title?: string;
  ariaLabel?: string;
  onClick: () => void;
  label?: string;
}

export default function StartOverButton({ title, ariaLabel, onClick, label }: StartOverButtonProps) {
  return (
    <>
      <button
        type={"button"}
        title={title}
        aria-label={ariaLabel}
        className={cn(
          "border-back-button-border text-heading focus:ring-focus bg-brand mr-2 flex items-center rounded-md border px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:text-slate-50 hover:opacity-90 focus:outline-none  focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
        )}
        onClick={onClick}>
        <div className="h-5">
          {label === "Start Over" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="mr-2 inline h-5 w-5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          )}
        </div>
        {label}
      </button>
    </>
  );
}
