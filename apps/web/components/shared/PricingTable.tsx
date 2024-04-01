import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

const tiers = [
  {
    name: "Basic",
    id: "tier-basic",
    href: "#",
    price: "$29",
    frequency: "month",
    description: "Get up to 500 AI responses every month.",
    features: [
      "Unlimited workflows",
      "500 Workflow AI responses",
      "Access to +350 Templates",
      "GPT-3.5Turbo",
      "Integrations (Webhooks, Zapier, Notion, Google Sheets, Airtable)",
      "Unlimited Team members",
    ],
    mostPopular: false,
    isYearly: false,
    inverted: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    price: "$99",
    frequency: "month",
    description: "Get up to 2500 AI responses every month.",
    features: [
      "Unlimited workflows",
      "2500 Workflow AI responses",
      "Access to +350 Templates",
      "GPT-4",
      "Integrations (Webhooks, Zapier, Notion, Google Sheets, Airtable)",
      "Unlimited Team members",
    ],
    mostPopular: true,
    isYearly: false,
    inverted: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    price: "$499",
    frequency: "year",
    description: "Unlimited AI responses.",
    features: [
      "Unlimited workflows",
      "Unlimited Workflow AI responses (OpenAI API key required)",
      "Access to +350 Templates",
      "All GPT Engines",
      "Integrations (Webhooks, Zapier, Notion, Google Sheets, Airtable)",
      "Unlimited Team members",
    ],
    mostPopular: false,
    isYearly: true,
    inverted: false,
  },
];

export default function PricingTable() {
  const router = useRouter();
  const plausible = usePlausible();
  return (
    <section className="lg:py-15 relativepy-10" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pb-6 text-center">
          <h2 className="text-md text-brand-dark mx-auto mb-3 max-w-2xl font-semibold uppercase sm:mt-4">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:text-5xl">
            Flexible plans to grow at your pace
          </p>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Whether you&apos;re creating your first AI form for the first time or scaling automation across
            your business, we have flexible plans that meet your needs.
          </p>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={clsx(
                tier.inverted ? "bg-violet-950" : "bg-violet-50",
                "flex h-full flex-col rounded-xl p-8 xl:p-10"
              )}>
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={clsx(
                    tier.inverted ? "text-white" : "text-gray-900",
                    "text-3xl font-semibold leading-8"
                  )}>
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p
                    className={clsx(
                      tier.inverted ? "bg-brand text-white" : "bg-lime-400 text-violet-950",
                      "text-normal rounded px-2.5 py-1 font-medium leading-5"
                    )}>
                    Popular
                  </p>
                ) : null}
                {tier.isYearly ? (
                  <p
                    className={clsx(
                      tier.inverted ? "bg-brand text-white" : "bg-lime-300 text-violet-950",
                      "text-normal rounded px-2.5 py-1 font-medium leading-5"
                    )}>
                    Yearly
                  </p>
                ) : null}
              </div>
              <p
                className={clsx(
                  tier.inverted ? " text-white" : "text-slate-500",
                  "text-normal mt-4 leading-6"
                )}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={clsx(
                    tier.inverted ? " text-white" : "text-gray-900",
                    "text-4xl font-bold tracking-tight"
                  )}>
                  {tier.price}
                </span>
                <span
                  className={clsx(
                    tier.inverted ? " text-white" : "text-slate-500",
                    "text-normal my-auto font-medium leading-6"
                  )}>
                  /{tier.frequency}
                </span>
              </p>
              <ul
                role="list"
                className={clsx(
                  tier.inverted ? " text-white" : "text-gray-900",
                  "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                )}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <div className="mt-[1px] h-6 w-6 rounded-full border border-lime-400 bg-lime-300 p-0.5">
                      <CheckIcon className="mx-auto h-full w-5 p-0.5 text-violet-950" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto text-center">
                {tier.inverted ? (
                  <Button
                    variant="lightCTA"
                    target="_blank"
                    size="lg"
                    className="mb-4 mt-10 px-12"
                    onClick={() => {
                      plausible("Pricing_CTAs");
                      router.push("https://dashboard.typeflowai.com/auth/signup");
                    }}>
                    Get started
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    target="_blank"
                    size="lg"
                    className="mb-4 mt-10 px-12"
                    onClick={() => {
                      plausible("Pricing_CTAs");
                      router.push("https://dashboard.typeflowai.com/auth/signup");
                    }}>
                    Get started
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
