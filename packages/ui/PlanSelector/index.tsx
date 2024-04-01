import { CheckIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

import { Button } from "../Button";

interface Feature {
  title: string;
  comingSoon: boolean;
  unlimited: boolean;
}

interface Plan {
  lookupKey: string;
  planName: string;
  description: string;
  price: number;
  billingInterval: string;
  features: Feature[];
}

interface PlanSelectorProps {
  title: string;
  subtitle?: string;
  plans: Plan[];
  loading: boolean;
  onSelectPlan: (key: string) => void;
  onSelectFreePlan: () => void;
  lookupKeys: Record<string, string>;
  productNames: Record<string, string>;
  freePlanAvailable: boolean;
}

export const PlanSelector = ({
  title,
  subtitle,
  plans,
  loading,
  onSelectPlan,
  onSelectFreePlan,
  lookupKeys,
  freePlanAvailable,
}: PlanSelectorProps) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);

  useEffect(() => {
    setSelectedPlan(plans[0]);
  }, [plans]);

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const getPlanKey = (lookupKey: string) => {
    const productName = Object.keys(lookupKeys).find((key) => lookupKeys[key] === lookupKey);
    const planKey = productName ? lookupKeys[productName] : lookupKeys.basic;
    return planKey;
  };

  return (
    <div>
      <div className="mb-5 rounded-lg border border-slate-300 bg-slate-100 shadow-sm">
        <div className="relative p-8 text-center">
          <p className="mt-2 text-2xl font-bold text-slate-700 sm:text-3xl">{title}</p>
          {subtitle && <p className="whitespace-pre-wrap text-sm text-slate-600">{subtitle}</p>}
          <div className="">
            <div id="stripe-plans" className="mx-auto py-4">
              <div className="max-w-3xl md:m-auto">
                <div className="sm:text-center">
                  <div className="mt-5">
                    <div className="flex flex-col justify-center md:flex-row">
                      {/* Plans list */}
                      <div className="flex flex-1 flex-col space-y-3 md:mr-4">
                        {plans.map((plan) => (
                          <div
                            key={plan.lookupKey}
                            className={`flex-1 cursor-pointer rounded-lg border bg-slate-200 ${
                              selectedPlan.lookupKey === plan.lookupKey ? "border-brand" : "border-slate-300"
                            } p-4`}
                            onClick={() => handlePlanSelection(plan)}>
                            <div className="flex">
                              <div className="ml-4 w-auto text-left">
                                <div className="text-slate-headline flex items-center text-xl font-medium">
                                  <div className="flex items-center">{plan.planName}</div>
                                  <div className="ml-auto font-bold">
                                    <span className="text-slate-800">${plan.price}</span>
                                    <span className="text-sm font-medium text-slate-500">
                                      {" "}
                                      /{plan.billingInterval}
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                  {plan.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Selected plan features */}
                      <div className="flex-1">
                        <div className="mt-6 flex h-full flex-col rounded-lg border border-slate-300 bg-slate-200 p-4 px-6 md:mt-0">
                          <p className="text-xl font-semibold capitalize">
                            {selectedPlan.planName} -
                            <span>
                              {" "}
                              ${selectedPlan.price}/{selectedPlan.billingInterval}
                            </span>
                          </p>
                          <div className="mb-4 mt-4 text-left text-lg">
                            <ul>
                              {selectedPlan.features.map((feature, index) => (
                                <li key={index} className="mb-2 flex w-full items-center">
                                  <div className="rounded-full border border-violet-300 bg-violet-200 p-0.5">
                                    <CheckIcon className="h-5 w-5 p-0.5 text-violet-500" />
                                  </div>
                                  <span className="ml-2 text-sm text-slate-500">{feature.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mb-4 mt-3">
                            <Button
                              variant="primary"
                              size="xl"
                              className="w-full justify-center font-bold text-white shadow-sm hover:opacity-90"
                              loading={loading}
                              onClick={() => onSelectPlan(getPlanKey(selectedPlan.lookupKey))}>
                              {freePlanAvailable
                                ? `Buy ${selectedPlan.planName} - $${selectedPlan.price}/${selectedPlan.billingInterval}`
                                : `Upgrade to ${selectedPlan.planName} - $${selectedPlan.price}/${selectedPlan.billingInterval}`}
                            </Button>

                            <div className="pt-2 text-sm font-medium opacity-75"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {freePlanAvailable && (
        <>
          <p className="mb-4 text-center text-lg">or</p>
          <p className="text-center text-lg">
            Try our{" "}
            <a
              className="text-brand cursor-pointer font-semibold underline"
              onClick={() => onSelectFreePlan()}>
              Free plan
            </a>{" "}
            <span className="text-base">(25 AI Credits) - No credit card required</span>
          </p>
        </>
      )}
    </div>
  );
};
