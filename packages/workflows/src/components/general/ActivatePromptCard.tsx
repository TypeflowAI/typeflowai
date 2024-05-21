interface ActivatePromptProps {
  headline?: string;
  subheader?: string;
}

export default function ActivatePromptCard({ headline, subheader }: ActivatePromptProps) {
  return (
    <div className="relative pt-6 text-center">
      <div className="text-brand flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-24 w-24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
      </div>

      <span className="bg-shadow mb-[10px] inline-block h-1 w-16 rounded-[100%]"></span>

      <div>
        <label
          htmlFor="ActivatePrompt"
          className="text-heading mb-1.5 block text-base font-semibold leading-6">
          <div className="flex items-center justify-center">{headline}</div>
        </label>
        <label htmlFor="ActivatePrompt" className="text-subheading block text-sm font-normal leading-6">
          {subheader}
        </label>
      </div>
    </div>
  );
}
