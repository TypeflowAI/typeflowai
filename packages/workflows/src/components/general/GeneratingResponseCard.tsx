interface GeneratingResponseCardProps {
  headline?: string;
  subheader?: string;
}

export const GeneratingResponseCard = ({ headline, subheader }: GeneratingResponseCardProps) => {
  return (
    <div className="text-center">
      <div className="text-brand flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          class="h-20 w-20">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      </div>

      <span className="bg-shadow mb-[10px] inline-block h-1 w-16 rounded-[100%]"></span>

      <div>
        <label htmlFor="Saving" className="text-heading mb-1.5 block text-base font-semibold leading-6">
          <div className="flex items-center justify-center">{headline}</div>
        </label>
        <label htmlFor="Saving" className="text-subheading block text-sm font-normal leading-6">
          {subheader}
        </label>
      </div>
    </div>
  );
};
