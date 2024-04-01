import Sprite10 from "@/images/sprites/sprite10.svg";
import clsx from "clsx";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

interface ThreeColumnFeaturesProps {
  title: string;
  highlight: string;
  subtitle: string;
  features: Feature[];
  cta: string;
  isMark?: boolean;
}

export default function ThreeColumnFeatures({
  title,
  highlight,
  subtitle,
  features,
  cta,
  isMark,
}: ThreeColumnFeaturesProps) {
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <section className={clsx(isMark ? "mt-20" : "mt-0", "lg:py-15 relative px-4 py-10")}>
      {isMark && (
        <Image
          src={Sprite10}
          alt="sprite10"
          className="] absolute left-1/2 top-[-1rem] z-[1] w-[15rem] -translate-x-1/2 transform "
        />
      )}
      <div className="relative mx-auto max-w-7xl text-center">
        <div className="lgpy-20 mx-auto max-w-5xl py-10 text-center sm:px-6 lg:px-8" id="features">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl md:text-5xl ">
            {title}
            <br />
            <span className="from-brand-light to-brand-dark bg-gradient-to-b bg-clip-text text-transparent xl:inline">
              {highlight}
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-slate-500 sm:text-xl md:mt-5 md:max-w-3xl md:text-2xl">
            {subtitle}
          </p>
        </div>

        <ul role="list" className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
          {features.map((feature) => {
            const IconComponent: React.ElementType = feature.icon;

            return (
              <li
                key={feature.id}
                className="relative col-span-1 flex flex-col rounded-xl bg-violet-950 text-left">
                <div className="flex flex-1 flex-col p-10">
                  <div className="my-4 flex flex-row">
                    <IconComponent className="my-auto h-8 w-8 flex-shrink-0 text-white" />
                    <h3 className="ml-4 text-2xl font-semibold text-white">{feature.name}</h3>
                  </div>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Description</dt>
                    <dd className="text-lg text-white">{feature.description}</dd>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
        <Button
          variant="primary"
          size="lg"
          className="mt-20 px-6 py-3 text-xl"
          onClick={() => {
            router.push("https://dashboard.typeflowai.com/auth/signup");
            plausible("Solutions_CTA_Features");
          }}>
          {cta}
        </Button>
      </div>
    </section>
  );
}
