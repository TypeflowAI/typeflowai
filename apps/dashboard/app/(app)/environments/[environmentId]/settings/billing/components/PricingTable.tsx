"use client";

import {
  createPlanAction,
  manageSubscriptionAction,
  reactivateSubscriptionAction,
  removeSubscriptionAction,
  updatePlanAction,
} from "@/app/(app)/environments/[environmentId]/settings/billing/actions";
import { basicFeatures, enterpriseFeatures, plansAndFeatures, proFeatures } from "@/app/paywall/plans";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  ProductSubscriptionTypes,
  StripePriceLookupKeys,
  StripeProductNames,
} from "@typeflowai/ee/stripe/lib/constants";
import { TTeam } from "@typeflowai/types/teams";
import AlertDialog from "@typeflowai/ui/AlertDialog";
import { Button } from "@typeflowai/ui/Button";
import { PlanCard } from "@typeflowai/ui/PlanCard";
import { PlanSelector } from "@typeflowai/ui/PlanSelector";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

import { FreeTrialCard } from "./FreeTrialCard";

interface aiLimits {
  basic: number;
  pro: number;
}

interface PricingTableProps {
  team: TTeam;
  environmentId: string;
  responseCount: number;
  aiResponseCount: number | null;
  aiLimits: aiLimits;
}

export default function PricingTableComponent({
  team,
  environmentId,
  responseCount,
  aiResponseCount,
  aiLimits,
}: PricingTableProps) {
  const router = useRouter();
  const [loadingCustomerPortal, setLoadingCustomerPortal] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [activeLookupKey, setActiveLookupKey] = useState<StripePriceLookupKeys>();
  const hasAnActiveSubscription = ["active", "canceled"].includes(team.billing.subscriptionStatus);

  const openCustomerPortal = async () => {
    setLoadingCustomerPortal(true);
    const sessionUrl = await manageSubscriptionAction(team.id, environmentId);
    router.push(sessionUrl);
    setLoadingCustomerPortal(true);
  };

  const changePlan = async (actionType, priceLookupKey) => {
    try {
      setChangingPlan(true);
      const response = await updatePlanAction(actionType, team.id, environmentId, priceLookupKey);
      setChangingPlan(false);

      if (response.status === 200) {
        capturePosthogEvent("PlanChanged", {
          actionType: capitalizeFirstLetter(actionType),
          plan: capitalizeFirstLetter(priceLookupKey),
        });
        toast.success(`Plan ${actionType}d successfully`);
        if (response.url) {
          router.push(response.url);
        } else {
          router.refresh();
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Unable to ${actionType} plan`);
    } finally {
      setChangingPlan(false);
    }
  };

  const handleUnsubscribe = async (e, lookupKey) => {
    try {
      e.preventDefault();
      setActiveLookupKey(lookupKey);
      setOpenDeleteModal(true);
    } catch (err) {
      toast.error("Unable to open delete modal");
    }
  };

  const handleDeleteSubscription = async () => {
    try {
      if (!activeLookupKey) throw new Error("No active lookup key");
      await removeSubscriptionAction(team.id, environmentId);
      capturePosthogEvent("PlanDeleted", { plan: capitalizeFirstLetter(activeLookupKey) });
      router.refresh();
      toast.success("Subscription deleted successfully");
    } catch (err) {
      toast.error("Unable to delete subscription");
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscriptionAction(team.id, environmentId);
      capturePosthogEvent("PlanReactivated", { plan: capitalizeFirstLetter(activeLookupKey) });
      router.refresh();
      toast.success("Subscription re-activated successfully");
    } catch (err) {
      toast.error("Unable to re-activate subscription");
    }
  };

  const [selectingPlan, setSelectingPlan] = useState(false);

  const selectPlan = async (priceLookupKey) => {
    try {
      setSelectingPlan(true);
      const response = await createPlanAction(team.id, environmentId, priceLookupKey);

      if (!response) {
        throw new Error("No response from createPlanAction");
      }

      setSelectingPlan(false);

      if (response.status === 200) {
        capturePosthogEvent("PlanCreated", {
          plan: capitalizeFirstLetter(priceLookupKey),
          isPaywall: false,
        });
        if (response.url) {
          router.push(response.url);
        } else {
          toast.success("Plan created successfully");
          router.refresh();
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      toast.error(`Unable to plan`);
    } finally {
      setSelectingPlan(false);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="relative">
      <div className="justify-between gap-4 rounded-lg">
        {team.billing.stripeCustomerId ? (
          <div className="flex w-full justify-end">
            <Button
              variant="secondary"
              className="justify-center py-2 shadow-sm"
              loading={loadingCustomerPortal}
              onClick={openCustomerPortal}>
              Manage Subscription
            </Button>
          </div>
        ) : (
          <>
            <div className="relative isolate mt-8 overflow-hidden rounded-lg bg-violet-950 px-3 pt-8 shadow-2xl sm:px-8 md:pt-12 lg:flex lg:gap-x-10 lg:px-12 lg:pt-0">
              <svg
                viewBox="0 0 1024 1024"
                className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                aria-hidden="true">
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                  fillOpacity="0.7"
                />
                <defs>
                  <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                    <stop offset="0" stopColor="var(--typeflowai-brand, #7b4cfa)" />
                    <stop offset="1" stopColor="#7b4cfa" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-16 lg:text-left">
                <h2 className="text-2xl font-bold text-lime-300 sm:text-3xl">
                  Get the most out of TypeflowAI
                </h2>
                <p className="text-md mt-6 leading-8 text-gray-300">
                  Get access to all features by upgrading to a paid plan.
                </p>
              </div>
            </div>
          </>
        )}

        {hasAnActiveSubscription ? (
          <>
            <PlanCard
              title={StripeProductNames[ProductSubscriptionTypes.basic]}
              subtitle={"Get up to 500 AI responses every month"}
              plan={ProductSubscriptionTypes.basic}
              sliderFeatureName="ai"
              price={29}
              isYearlyPrice={false}
              actionText={""}
              team={team}
              metric="AI responses"
              sliderValue={aiLimits.basic - (aiResponseCount ?? 0)}
              sliderLimit={aiLimits.basic * 1.2}
              tierLimit={aiLimits.basic}
              paidFeatures={basicFeatures}
              loading={changingPlan}
              onDowngrade={() => changePlan("downgrade", StripePriceLookupKeys.basic)}
              onUnsubscribe={(e) =>
                handleUnsubscribe(e, ProductSubscriptionTypes[ProductSubscriptionTypes.basic])
              }
              onReactivate={() => handleReactivateSubscription()}
            />

            <PlanCard
              title={StripeProductNames[ProductSubscriptionTypes.pro]}
              subtitle={"Get up to 2500 AI responses every month"}
              plan={ProductSubscriptionTypes.pro}
              sliderFeatureName="ai"
              price={99}
              isYearlyPrice={false}
              actionText={""}
              team={team}
              metric="AI responses"
              sliderValue={aiLimits.pro - (aiResponseCount ?? 0)}
              sliderLimit={aiLimits.pro * 1.2}
              tierLimit={aiLimits.pro}
              paidFeatures={proFeatures}
              loading={changingPlan}
              onUpgrade={() => changePlan("upgrade", StripePriceLookupKeys.pro)}
              onDowngrade={() => changePlan("downgrade", StripePriceLookupKeys.pro)}
              onUnsubscribe={(e) =>
                handleUnsubscribe(e, ProductSubscriptionTypes[ProductSubscriptionTypes.pro])
              }
              onReactivate={() => handleReactivateSubscription()}
            />

            <PlanCard
              title={StripeProductNames[ProductSubscriptionTypes.enterprise]}
              subtitle={"Unlimited AI responses"}
              plan={ProductSubscriptionTypes.enterprise}
              sliderFeatureName="ai"
              price={499}
              isYearlyPrice={true}
              actionText={""}
              team={team}
              metric="AI responses"
              paidFeatures={enterpriseFeatures}
              loading={changingPlan}
              onUpgrade={() => changePlan("upgrade", StripePriceLookupKeys.enterprise)}
              onUnsubscribe={(e) =>
                handleUnsubscribe(e, ProductSubscriptionTypes[ProductSubscriptionTypes.enterprise])
              }
              onReactivate={() => handleReactivateSubscription()}
            />
          </>
        ) : (
          <>
            <div className="mt-10">
              <FreeTrialCard
                title={"Free Trial"}
                subtitle={"Get up to 250 free responses every month"}
                metric="responses"
                sliderValue={responseCount}
                sliderLimit={350}
                tierLimit={250}
                perMetricCharge={0.15}
              />
            </div>
            <div className="mt-10">
              <PlanSelector
                title="Upgrade your plan"
                subtitle={plansAndFeatures.subtitle}
                plans={plansAndFeatures.plans}
                lookupKeys={StripePriceLookupKeys}
                productNames={StripeProductNames}
                loading={selectingPlan}
                onSelectPlan={(plan) => selectPlan(plan)}
                onSelectFreePlan={() => {}}
                freePlanAvailable={false}
              />
            </div>
          </>
        )}
      </div>

      <AlertDialog
        confirmWhat="that you want to unsubscribe?"
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onDiscard={() => {
          setOpenDeleteModal(false);
        }}
        text="Your subscription for this product will be canceled at the end of the month. After that, you won't have access to the pro features anymore"
        onSave={() => handleDeleteSubscription()}
        confirmButtonLabel="Unsubscribe"
      />
    </div>
  );
}
