import { XMarkIcon } from "@heroicons/react/24/outline";

import { BillingSlider } from "@typeflowai/ui/BillingSlider";

export const FreeTrialCard = ({
  title,
  subtitle,
  metric,
  sliderValue,
  sliderLimit,
  tierLimit,
  perMetricCharge,
}: {
  title: string;
  subtitle: string;
  metric?: string;
  sliderValue?: number;
  sliderLimit?: number;
  tierLimit?: number;
  perMetricCharge?: number;
}) => {
  return (
    <div className="mt-8 rounded-lg border border-slate-300 bg-slate-100 shadow-sm">
      <div className="relative p-8">
        <h2 className="mr-2 inline-flex text-2xl font-bold text-slate-700">{title}</h2>
        <p className=" whitespace-pre-wrap text-sm text-slate-600">{subtitle}</p>

        {metric && perMetricCharge && (
          <div className="rounded-xl bg-slate-100 py-4">
            <div className="mb-2 flex items-center gap-x-4"></div>
            <div className="relative mb-16 mt-4">
              <BillingSlider
                className="slider-class"
                value={sliderValue || 0}
                max={sliderLimit || 100}
                tierLimit={tierLimit || 0}
                metric={metric}
              />
            </div>
            <hr className="mt-6" />
          </div>
        )}

        <p className=" whitespace-pre-wrap text-sm text-slate-600">
          You&apos;re on the <b>Free Trial plan</b>.
        </p>
        <div className="flex py-3">
          <div className="w-1/2">
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <div className="rounded-full border border-red-300 bg-red-100 p-0.5">
                  <XMarkIcon className="h-5 w-5 p-0.5 text-red-500" />
                </div>
                <span className="ml-2 text-sm text-slate-500">Limited responses</span>
              </li>
              <li className="flex items-center">
                <div className="rounded-full border border-red-300 bg-red-100 p-0.5">
                  <XMarkIcon className="h-5 w-5 p-0.5 text-red-500" />
                </div>
                <span className="ml-2 text-sm text-slate-500">Workflows AI responses</span>
              </li>
            </ul>
          </div>

          <div className="w-1/2">
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <div className="rounded-full border border-red-300 bg-red-100 p-0.5">
                  <XMarkIcon className="h-5 w-5 p-0.5 text-red-500" />
                </div>
                <span className="ml-2 text-sm text-slate-500">Remove TypeflowAI Branding</span>
              </li>
              <li className="flex items-center">
                <div className="rounded-full border border-red-300 bg-red-100 p-0.5">
                  <XMarkIcon className="h-5 w-5 p-0.5 text-red-500" />
                </div>
                <span className="ml-2 text-sm text-slate-500">Team Roles</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
