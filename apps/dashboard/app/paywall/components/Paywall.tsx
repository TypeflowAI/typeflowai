"use client";

import { createPlanAction } from "@/app/(app)/environments/[environmentId]/settings/(team)/billing/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { StripePriceLookupKeys, StripeProductNames } from "@typeflowai/ee/stripe/lib/constants";
import { TTeam } from "@typeflowai/types/teams";
import { Logo } from "@typeflowai/ui/Logo";
import { PlanSelector } from "@typeflowai/ui/PlanSelector";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";
import { startFreeTrialAction } from "../actions";

interface Feature {
  title: string;
  comingSoon: boolean;
  unlimited: boolean;
}

interface Plan {
  lookupKey: string;
  planName: string;
  description: string;
  price?: number;
  billingInterval?: string;
  features: Feature[];
}

interface PlansAndFeatures {
  title: string;
  subtitle: string;
  plans: Plan[];
}

interface PaywallProps {
  team: TTeam;
  environmentId: string;
  plansAndFeatures: PlansAndFeatures;
}

export default function Paywall({ plansAndFeatures, team, environmentId }: PaywallProps) {
  const router = useRouter();
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
          isPaywall: true,
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

  const selectFreePlan = async (team) => {
    try {
      setSelectingPlan(true);
      await startFreeTrialAction(team);
      capturePosthogEvent("FreeTrialCreated");
      router.push("/");
      setSelectingPlan(false);
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
    <div className="flex h-full w-full flex-col bg-slate-50">
      <div className="mx-auto mb-10 grid w-full max-w-7xl grid-cols-6 items-center pt-8">
        <div className="col-span-2" />
        <div className="col-span-2">
          <Logo className="mx-auto w-1/2" />
        </div>
        <div className="col-span-2" />
      </div>
      <div className="mt-10 flex grow justify-center">
        <PlanSelector
          title={plansAndFeatures.title}
          subtitle={plansAndFeatures.subtitle}
          plans={plansAndFeatures.plans}
          lookupKeys={StripePriceLookupKeys}
          productNames={StripeProductNames}
          loading={selectingPlan}
          onSelectPlan={(plan) => selectPlan(plan)}
          onSelectFreePlan={() => selectFreePlan(team)}
          freePlanAvailable={true}
        />
      </div>
    </div>
  );
}
