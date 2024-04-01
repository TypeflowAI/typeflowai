import LeadMagnet from "@/images/magnets/lead-magnet.svg";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

const steps = [
  "Create a form",
  "Embed in your website",
  "Ask your lead to fill it",
  "Customer Loyalty",
  "AI automatically creates a lead magnet for this specific lead",
];

export const DynamicAILeadMagnet: React.FC = () => {
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <section className="relative px-4 py-10 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-xl bg-violet-50">
        <div className="mx-auto max-w-lg py-10 md:max-w-none  md:py-20">
          <div className="px-4 sm:max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="xs:grid md:grid-cols-2 md:gap-16">
              <div className="pb-8 sm:pl-10 md:pb-0">
                <h2 className="xs:text-5xl text-3xl font-semibold tracking-tight text-slate-800">
                  Dynamic AI Lead Magnets{" "}
                </h2>
                <p className="mt-6 max-w-lg text-xl leading-7 text-slate-500">
                  The automatic perfect-fit content for every single lead.
                </p>
                <ul role="list" className="mt-8 space-y-6 text-lg leading-6 text-slate-500">
                  {steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-950 text-white">
                        {index + 1}
                      </div>
                      {step}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-10 px-6 py-3 text-xl"
                  onClick={() => {
                    router.push("https://dashboard.typeflowai.com/auth/signup");
                    plausible("Solutions_CTA_LeadMagnet");
                  }}>
                  See more examples
                </Button>
              </div>
              <div className="relative w-full pl-8 pr-[4rem]">
                <Image alt="AI Lead Magnet" loading="lazy" src={LeadMagnet} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicAILeadMagnet;
