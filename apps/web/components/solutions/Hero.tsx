import Sprite8 from "@/images/sprites/sprite8.svg";
import Sprite9 from "@/images/sprites/sprite9.svg";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

interface HeroSolutionsProps {
  title: string;
  highlight: string;
  subtitle: string;
}

export default function HeroSolutions({ title, highlight, subtitle }: HeroSolutionsProps) {
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <section className="relative mb-10 overflow-hidden">
      <Image
        src={Sprite8}
        alt="sprite8"
        className="absolute left-[-6rem] top-[4rem]  z-[1] hidden w-[25rem] lg:block"
      />
      <Image
        src={Sprite9}
        alt="sprite9"
        className="absolute bottom-[-6rem] right-[-6rem]  z-[1] hidden w-[20rem] lg:block"
      />
      <div className="flex max-w-full shrink-0 flex-row items-start justify-start self-stretch bg-violet-50 pb-10 text-center font-semibold">
        <div className="max-w-8xl mx-auto px-6 py-10 lg:flex lg:px-8 lg:py-16">
          <div className="relative mx-auto my-auto max-w-2xl items-center text-center lg:mx-0 lg:min-w-[620px] lg:max-w-xl lg:flex-shrink-0">
            <h1 className="text-5xl font-semibold leading-tight text-slate-800 sm:text-6xl sm:leading-tight ">
              <span>
                {title}
                <br />
                {highlight}
              </span>
            </h1>

            <p className="my-6 text-2xl font-normal leading-8 text-slate-500">{subtitle}</p>

            <Button
              variant="primary"
              size="xl"
              className="mt-10 px-6 py-3 text-xl"
              onClick={() => {
                router.push("https://dashboard.typeflowai.com/auth/signup");
                plausible("Hero_CTA_GetStartedItsFree");
              }}>
              Create free account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
