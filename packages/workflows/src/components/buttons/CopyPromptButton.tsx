import { cn } from "@/lib/utils";

interface CopyPromptButtonProps {
  title?: string;
  ariaLabel?: string;
  onClick: () => void;
  copyButtonLabel?: string;
}

export default function CopyPromptButton({
  title,
  ariaLabel,
  onClick,
  copyButtonLabel,
}: CopyPromptButtonProps) {
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
        {copyButtonLabel}
        <div className="h-5">
          {copyButtonLabel === "Copy" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
              class="-mr-1 ml-2 inline h-5 w-5 rtl:mr-2">
              <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z"></path>
              <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z"></path>
            </svg>
          )}
        </div>
      </button>
    </>
  );
}
