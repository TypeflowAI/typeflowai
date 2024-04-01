import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import articleIcon from "@typeflowai/ui/icons/templates/article.svg";
import buyerPersonaIcon from "@typeflowai/ui/icons/templates/buyerpersona.svg";
import coldEmailIcon from "@typeflowai/ui/icons/templates/coldemail.svg";
import googleAdsIcon from "@typeflowai/ui/icons/templates/googleads.svg";
import ideaIcon from "@typeflowai/ui/icons/templates/idea.svg";
import linkedinIcon from "@typeflowai/ui/icons/templates/linkedin.svg";
import magnetIcon from "@typeflowai/ui/icons/templates/magnet.svg";
import seoIcon from "@typeflowai/ui/icons/templates/seo.svg";
import twitterIcon from "@typeflowai/ui/icons/templates/twitter.svg";

export default function BestTemplates() {
  const BestTemplates = [
    {
      name: "Content Marketing Ideas",
      href: "/use-cases/content-marketing-ideas-generator",
      icon: articleIcon,
      description: "Generate fresh and engaging ideas for your content marketing strategy.",
      category: "SEO & Content strategy",
    },
    {
      name: "LinkedIn Post Gen.",
      href: "/use-cases/linkedin-post-generator",
      icon: linkedinIcon,
      description: "Craft compelling posts for LinkedIn to engage with your professional network.",
      category: "Enhance online presence",
    },
    {
      name: "Google Ads Copy Gen.",
      href: "/use-cases/google-ads-copy-generator",
      icon: googleAdsIcon,
      description: "Create effective ad copy that resonates with your Google Ads audience.",
      category: "Enhance online presence",
    },
    {
      name: "Tweet Generator",
      href: "/use-cases/tweet-generator",
      icon: twitterIcon,
      description: "Produce creative and catchy tweets to capture your audience's attention.",
      category: "Enhance online presence",
    },
    {
      name: "Dynamic Lead Magnet",
      href: "/use-cases/dynamic-lead-magnet",
      icon: magnetIcon,
      description: "Design lead magnets that convert and captivate your potential customers.",
      category: "Lead Generation",
    },
    {
      name: "Cold Email Generator",
      href: "/use-cases/cold-email-generator",
      icon: coldEmailIcon,
      description: "Write cold emails that get responses and start meaningful business conversations.",
      category: "Email",
    },
    {
      name: "AI Keyword Research",
      href: "/use-cases/seo-keyword-generator",
      icon: seoIcon,
      description: "Leverage AI to discover and analyze top-performing keywords for SEO.",
      category: "SEO & Content strategy",
    },
    {
      name: "Buyer Persona Gen.",
      href: "/use-cases/buyer-persona-generator",
      icon: buyerPersonaIcon,
      description: "Develop detailed buyer personas to better understand your target audience.",
      category: "Business Strategy",
    },
    {
      name: "Business Model Ideas",
      href: "/use-cases/business-model-ideas-generator",
      icon: ideaIcon,
      description: "Generate low-investment, digital business ideas with a business model canvas.",
      category: "Business Strategy",
    },
  ];

  return (
    <section className="lg:py-15 relative px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="px-4 pb-10 text-center sm:px-6 lg:px-8" id="best-templates">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
            Get started with{" "}
            <span className="from-brand-light to-brand-dark bg-gradient-to-b bg-clip-text text-transparent xl:inline">
              Best Templates
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Simplify everything: from business strategy to marketing and sales efforts
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-6 px-2 md:grid-cols-3">
          {BestTemplates.map((bestPractice) => (
            <Link className="relative block" href={bestPractice.href} key={bestPractice.name}>
              <div className="drop-shadow-card duration-120 hover:border-brand-dark relative h-full rounded-lg border border-violet-50 bg-violet-50 p-6 transition-all ease-in-out hover:scale-105 hover:cursor-pointer">
                <div
                  className={clsx(
                    // base styles independent what type of button it is
                    "absolute right-6 rounded-lg px-3 py-1 text-xs lg:text-sm",
                    bestPractice.category === "SEO & Content strategy"
                      ? "border-blue-300 bg-blue-50 text-blue-500"
                      : bestPractice.category === "Enhance online presence"
                        ? "border-pink-300 bg-pink-50 text-pink-500"
                        : bestPractice.category === "Lead Generation"
                          ? "border-orange-300 bg-orange-50 text-orange-500"
                          : bestPractice.category === "Email"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-500"
                            : bestPractice.category === "Business Strategy"
                              ? "border-violet-300 bg-violet-50 text-violet-500"
                              : bestPractice.category === "Agency"
                                ? "border-yellow-300 bg-yellow-50 text-yellow-500"
                                : bestPractice.category === "Human Resources"
                                  ? "border-red-300 bg-red-50 text-red-500"
                                  : "border-slate-300 bg-slate-50 text-slate-500" // default color
                  )}>
                  {bestPractice.category}
                </div>
                <div className="h-12 w-12">
                  {/* <bestPractice.icon className="h-12 w-12 " /> */}
                  <Image
                    width={16}
                    height={16}
                    src={bestPractice.icon}
                    style={{
                      objectFit: "cover",
                    }}
                    className="text-brand h-12 w-12 "
                    alt="Template icon"
                  />
                </div>
                <h3 className="mb-1 mt-3 text-xl font-bold text-slate-700">{bestPractice.name}</h3>
                <p className="flex self-end text-sm text-slate-600">{bestPractice.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
