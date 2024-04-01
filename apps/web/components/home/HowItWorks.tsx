import Arrow from "@/images/sprites/arrow.png";
import Sprite6 from "@/images/sprites/sprite6.svg";
import Step1 from "@/images/steps/step1.svg";
import Step2 from "@/images/steps/step2.svg";
import Step3 from "@/images/steps/step3.svg";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

export const HowItWorks: React.FC = () => {
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <section className="relative px-4 py-10 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-xl bg-violet-50">
        <div className="mx-auto max-w-4xl">
          <div className="px-2 py-16 pb-4 text-center md:pb-12 lg:pt-20">
            <p className="text-md text-brand-dark mx-auto mb-8 max-w-2xl font-semibold uppercase sm:mt-4">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
              Build <span className="bg-clip-text text-lime-500 xl:inline">AI Forms</span> that generate
              contextual adaptative responses
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-xl text-slate-500 sm:mt-4">
              TypeflowAI empowers you to build forms from scratch with just a few simple steps or utilize its
              extensive library of over 350 pre-configured templates, tailorable to your unique needs.
            </p>
          </div>
        </div>
        <div id="howitworks" className="xs:m-auto mb-12 mt-16 max-w-lg md:mb-0 md:mt-16 md:max-w-none">
          <div className="px-4 sm:max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid md:grid-cols-2 md:items-center md:gap-16">
              <div className="relative w-full pl-10 pr-[4rem]">
                <Image alt="How it works - Step 1" loading="lazy" src={Step1} />
                <Image
                  src={Arrow}
                  alt="Arrow"
                  className="absolute bottom-[-15rem] left-1/2  z-[1] !m-[0] hidden w-[10rem] lg:block"
                />
              </div>
              <div className="pb-8 md:pb-0">
                <h3 className="text-brand-dark font-bold">Step 1</h3>
                <h4 className="xs:text-4xl text-2xl font-bold tracking-tight text-slate-800">
                  Define your questions
                </h4>
                <p className="mt-6 max-w-lg text-lg leading-7 text-slate-500">
                  Everything begins with a series of questions designed to create a form that can be used
                  internally or shared with your customers.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-12 mt-8 max-w-lg md:mb-0 md:mt-32  md:max-w-none">
          <div className="px-4 sm:max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="xs:grid md:grid-cols-2 md:items-center md:gap-16">
              <div className="pb-8 sm:pl-10 md:pb-0">
                <h3 className="text-brand-dark font-bold">Step 2</h3>
                <h4 className="xs:text-4xl text-2xl font-bold tracking-tight text-slate-800">
                  Include questions in your prompt
                </h4>
                <p className="mt-6 max-w-lg text-lg leading-7 text-slate-500">
                  Turn questions into variables to be used as merge tags in the prompt, and choose formatting
                  options for the best results.
                </p>
              </div>
              <div className="relative w-full pl-8 pr-[4rem]">
                <Image alt="How it works - Step 2" loading="lazy" src={Step2} />
                <Image
                  src={Sprite6}
                  alt="Sprite Arrow"
                  className="absolute bottom-[0rem] left-[4rem]  z-[1] !m-[0] hidden w-[10rem] lg:block"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-12 mt-8 max-w-lg pb-12 md:mb-0 md:mt-20  md:max-w-none">
          <div className="px-4 sm:max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid md:grid-cols-2 md:items-center md:gap-16">
              <div className="order-last w-full rounded-lg bg-slate-100 p-4 sm:py-8 md:order-first">
                <Image alt="How it works - Step 3" loading="lazy" src={Step3} />
              </div>
              <div className="pb-8 md:pb-0">
                <h3 className="text-brand-dark font-bold">Step 3</h3>
                <h4 className="xs:text-4xl text-2xl font-bold tracking-tight text-slate-800">
                  Deliver custom made responses
                </h4>
                <p className="mt-6 max-w-lg text-lg leading-7 text-slate-500">
                  Generate mind-blowing responses that adapt to changing contexts, delivering precision and
                  creativity at every turn.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="my-8 mr-3 px-6"
                  onClick={() => {
                    router.push("https://dashboard.typeflowai.com/auth/signup");
                    plausible("HowItWorks_CTA_BuildAIForm");
                  }}>
                  Build AI form
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
