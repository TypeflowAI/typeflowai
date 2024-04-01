import Sprite5 from "@/images/sprites/sprite5.svg";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

interface Props {
  teaser: string;
  headline: string;
  subheadline: string;
  cta: string;
  href: string;
  image: string;
}

export default function TryItCTA({ teaser, headline, subheadline, cta, href, image }: Props) {
  const router = useRouter();
  const plausible = usePlausible();
  return (
    <section className="lg:py-15 relative px-4 py-10">
      <div className="xs:mx-auto xs:w-full max-w-7xl rounded-xl bg-violet-950">
        <div className="relative px-6 pt-8 sm:px-8  sm:pt-12 lg:px-10 lg:pt-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col">
              <div className="mx-10">
                <Image src={image} alt="CTA" className="mb-[-1px]" />
              </div>
            </div>
            <div className="relative flex flex-col">
              <Image
                src={Sprite5}
                alt="Sprite Arrow"
                className="absolute left-[-8rem] top-[-5.5rem]  z-[1] !m-[0] hidden w-[10rem] lg:block"
              />
              <p className="lg:text-md text-sm font-semibold uppercase text-lime-400">{teaser}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white lg:text-4xl ">{headline}</h2>
              <p className="text-md mt-4 max-w-lg text-white lg:text-xl">{subheadline}</p>
              <div className="my-4">
                <Button
                  variant="lightCTA"
                  target="_blank"
                  onClick={() => {
                    plausible("TryIt_CTAs");
                    router.push(`${href}`);
                  }}>
                  {cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
