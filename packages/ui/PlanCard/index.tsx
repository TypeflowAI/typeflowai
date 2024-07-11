import { CheckIcon } from "lucide-react";
import { TTeam } from "@typeflowai/types/teams";
import { Badge } from "../Badge";
import { BillingSlider } from "../BillingSlider";
import { Button } from "../Button";

export const PlanCard = ({
  title,
  subtitle,
  plan,
  sliderFeatureName,
  price,
  actionText,
  team,
  metric,
  sliderValue,
  sliderLimit,
  tierLimit,
  paidFeatures,
  loading,
  onUpgrade,
  onDowngrade,
  onUnsubscribe,
  onReactivate,
}: {
  title: string;
  subtitle: string;
  plan: string;
  sliderFeatureName: string;
  price?: number;
  actionText: string;
  team: TTeam;
  metric?: string;
  sliderValue?: number;
  sliderLimit?: number;
  tierLimit?: number;
  paidFeatures: {
    title: string;
    comingSoon?: boolean;
    unlimited?: boolean;
  }[];
  loading: boolean;
  onUpgrade?: any;
  onDowngrade?: any;
  onUnsubscribe: any;
  onReactivate: any;
}) => {
  const sliderFeatureNameKey = sliderFeatureName as keyof typeof team.billing.features;
  return (
    <div
      className={`mt-8 rounded-lg border ${
        team.billing.subscriptionType === plan && team.billing.subscriptionStatus !== "inactive"
          ? "border-brand"
          : "border-slate-300"
      } bg-slate-100 shadow-sm`}>
      <div className="relative p-8">
        <h2 className="mr-2 inline-flex text-2xl font-bold text-slate-700">{title}</h2>
        {team.billing.subscriptionType === plan && (
          <>
            {team.billing.subscriptionStatus === "active" ? (
              <>
                <Badge text="Current subscription" size="normal" type="brand" />
                <Button
                  variant="secondary"
                  onClick={(e) => onUnsubscribe(e)}
                  className="absolute right-12 top-10">
                  Unsubscribe
                </Button>
              </>
            ) : team.billing.subscriptionStatus === "canceled" ||
              team.billing.subscriptionStatus === "scheduled" ? (
              <>
                <Badge
                  text={
                    team.billing.subscriptionStatus === "canceled"
                      ? "Cancelling at End of this Month"
                      : "Change Scheduled"
                  }
                  size="normal"
                  type="warning"
                />
                <Button
                  variant="secondary"
                  onClick={(e) => onReactivate(e)}
                  className="absolute right-12 top-10">
                  Re-activate
                </Button>
              </>
            ) : null}
          </>
        )}
        <p className=" whitespace-pre-wrap text-sm text-slate-600">{subtitle}</p>

        {team.billing.subscriptionType === plan && metric && (
          <div className="rounded-xl bg-slate-100 py-4">
            <div className="mb-2 flex items-center gap-x-4"></div>
            {team.billing.features[sliderFeatureNameKey].unlimited ? (
              <p>
                <span className="text-sm font-medium text-slate-400">
                  Usage this month: {sliderValue} {metric}
                </span>
              </p>
            ) : (
              <>
                {tierLimit && (
                  <div className="relative mb-16 mt-4">
                    <BillingSlider
                      className="slider-class"
                      value={sliderValue || 0}
                      max={sliderLimit || 100}
                      tierLimit={tierLimit || 0}
                      metric={metric}
                    />
                  </div>
                )}
              </>
            )}
            <hr className="mt-6" />
          </div>
        )}

        <div className="flex py-3">
          <div className="w-4/6">
            <ul className="mt-4 space-y-4">
              {paidFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="rounded-full border border-violet-300 bg-violet-100 p-0.5">
                    <CheckIcon className="h-5 w-5 p-0.5 text-violet-700" />
                  </div>
                  <span className="ml-2 text-sm text-slate-500">{feature.title}</span>
                  {feature.comingSoon && (
                    <span className=" mx-2 bg-blue-100 p-1 text-xs text-slate-400">coming soon</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-2/6">
            <div className="flex">
              <div className="w-1/4"></div>
              <div className="w-3/4">
                <div className="my-2">
                  {plan !== "enterprise" ? (
                    <div>
                      {actionText && (
                        <>
                          <span className="text-sm font-medium text-slate-400">{actionText}</span>
                          <br />
                        </>
                      )}
                      <span className="text-3xl font-bold text-slate-800">${price}</span>
                      <span className="text-base font-medium text-slate-400">/ month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xl font-medium text-slate-800">Let&apos;s talk!</span>
                    </div>
                  )}
                </div>

                {team.billing.subscriptionType !== plan && (
                  <>
                    {team.billing.subscriptionType === "basic" && plan === "pro" ? (
                      <Button
                        variant="primary"
                        className="w-full justify-center py-2 text-white shadow-sm"
                        loading={loading}
                        onClick={() => onUpgrade()}>
                        Upgrade
                      </Button>
                    ) : null}
                    {team.billing.subscriptionType === "pro" && plan === "basic" ? (
                      <Button
                        variant="secondary"
                        className="w-full justify-center py-2"
                        loading={loading}
                        onClick={() => onDowngrade()}>
                        Downgrade
                      </Button>
                    ) : null}
                    {plan === "enterprise" ? (
                      <Button
                        variant="primary"
                        className="w-full justify-center py-2 text-white shadow-sm"
                        loading={loading}
                        onClick={() => {
                          if (typeof window !== "undefined" && window.Beacon) {
                            const beaconContainer = document.getElementById("beacon-container");
                            if (beaconContainer) {
                              beaconContainer.style.display = "block";
                              window.Beacon("open");
                            }
                            window.Beacon("on", "close", () => {
                              if (beaconContainer) {
                                beaconContainer.style.display = "none";
                              }
                            });
                          }
                        }}>
                        Contact us
                      </Button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
