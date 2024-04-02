import TestimonialsAvatars from "@/components/shared/TestimonialsAvatars";
import heroImageAdd from "@/images/hero-asset2.svg";
import heroImage from "@/images/hero-asset.svg";
import Sprite1 from "@/images/sprites/sprite1.svg";
import Sprite2 from "@/images/sprites/sprite2.svg";
import Sprite3 from "@/images/sprites/sprite3.svg";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

export const Hero: React.FC = () => {
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <section className="relative mb-10">
      <Image
        src={Sprite3}
        alt="sprite3"
        className="absolute left-1/2 top-[-6rem]  z-[1] hidden h-[22.319rem] w-[15.125rem] lg:block"
      />
      <div className="flex max-w-full shrink-0 flex-row items-start justify-start self-stretch overflow-hidden bg-violet-950 pb-10 text-left text-[4rem] font-semibold text-white">
        <Image
          src={Sprite1}
          alt="sprite1"
          className="absolute bottom-[-2rem] left-[-5rem]  z-[1] !m-[0] hidden h-[22rem] w-[15rem] lg:block"
        />
        <div className="max-w-8xl z-[2] mx-auto px-4 sm:px-6">
          <div className="relative isolate">
            <div className="max-w-8xl mx-auto px-6 pt-10 lg:flex lg:px-8 lg:pt-20">
              <div className="relative mx-auto my-auto max-w-2xl items-center text-center lg:mx-0 lg:min-w-[620px] lg:max-w-xl lg:flex-shrink-0 lg:text-left">
                <h1 className="text-5xl font-semibold leading-tight sm:text-6xl sm:leading-tight">
                  <span>Next-Gen AI Forms with GPT </span>
                  <span className="text-lime-300">superpowers</span>
                </h1>

                <p className="mt-6 text-xl font-normal leading-8 text-white">
                  Convert form questions into dynamic merge tags to craft high-level prompts and build
                  sophisticated AI tools.
                </p>

                <Button
                  variant="lightCTA"
                  size="xl"
                  className="mb-10 mr-3 px-6 py-3 text-xl"
                  onClick={() => {
                    router.push("https://dashboard.typeflowai.com/auth/signup");
                    plausible("Hero_CTA_GetStartedItsFree");
                  }}>
                  Create free account
                </Button>

                <TestimonialsAvatars />

                <Image
                  src={Sprite2}
                  alt="sprite2"
                  className="absolute bottom-[2rem] left-[20rem]  z-[1] hidden max-h-full w-auto max-w-full flex-1 self-stretch self-stretch overflow-hidden lg:block"
                />
              </div>
              <div className="mx-auto mt-16 flex max-w-2xl justify-center sm:mt-24 lg:my-12 lg:ml-10 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                <div className="relative max-w-3xl max-w-full flex-none sm:max-w-5xl lg:max-w-none ">
                  <div className="ring-outset  relative z-[1100] -m-2 rounded-xl bg-gray-900/50 p-2 ring-1 ring-gray-900/50 lg:-m-4 lg:rounded-2xl lg:p-3">
                    <Image
                      className="w-[40rem] rounded-md shadow-2xl ring-1 ring-gray-900/20"
                      alt="Hero Image"
                      loading="lazy"
                      src={heroImage}
                    />
                    <Image
                      className="absolute bottom-[2rem] left-[-4rem]  z-[1] !m-[0] hidden w-[22rem] lg:block"
                      alt="Hero Image Addon"
                      loading="lazy"
                      src={heroImageAdd}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
