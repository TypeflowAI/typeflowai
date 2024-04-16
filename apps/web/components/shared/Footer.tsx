import Sprite4 from "@/images/sprites/sprite4.svg";
import Image from "next/image";
import Link from "next/link";
// import { FaDiscord, FaGithub } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";

import { Logo } from "./Logo";

const navigation = {
  solutions: [
    {
      name: "Marketing",
      href: "/solutions/marketing",
    },
    {
      name: "Sales",
      href: "/solutions/sales",
    },
    {
      name: "Business",
      href: "/solutions/business",
    },
    {
      name: "HR",
      href: "/solutions/hr",
    },
    {
      name: "Customer Service",
      href: "/solutions/customer-service",
    },
  ],
  footernav: [
    { name: "Pricing", href: "#pricing" },
    // { name: "Blog", href: "/blog" },
    { name: "Docs", href: "/docs" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "GDPR FAQ", href: "/gdpr" },
    { name: "GDPR Guide", href: "/gdpr-guide" },
  ],
  useCases: [
    {
      name: "Content Marketing Ideas",
      href: "/use-cases/content-marketing-ideas",
    },
    {
      name: "LinkedIn Post Gen.",
      href: "/use-cases/linkedin-post-generation",
    },
    {
      name: "Google Ads Copy Gen.",
      href: "/use-cases/google-ads-copy-generator",
    },
    {
      name: "Tweets Generator",
      href: "/use-cases/tweets-generator",
    },
    {
      name: "Dynamic Lead Magnet",
      href: "/use-cases/dynamic-lead-magnet",
    },
    {
      name: "Cold Email Generator",
      href: "/use-cases/cold-email-generator",
    },
    {
      name: "AI Keyword Research",
      href: "/use-cases/ai-keyword-research",
    },
    {
      name: "Buyer Persona Gen.",
      href: "/use-cases/buyer-persona-generator",
    },
  ],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/TypeflowAI/typeflowai",
      icon: FaGithub,
    },
    // {
    //   name: "Discord",
    //   href: "https://typeflowai.com/discord",
    //   icon: FaDiscord,
    // },
  ],
};
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-violet-950" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="relative z-[2] mx-auto  grid max-w-7xl content-center gap-12 px-4 py-12 md:grid-cols-2 lg:grid-cols-3 lg:py-16">
        <div className="space-y-6">
          <Link href="/">
            <span className="sr-only">TypeflowAI</span>
            <Logo className="h-7 w-auto " />
          </Link>
          <p className="text-base text-white">Next-Gen AI Forms with GPT superpowers</p>
          <div className="border-slate-500">
            <p className="text-sm text-slate-400">
              TypeflowAI &copy; {currentYear}. All rights reserved.
              <br />
              <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms</Link>
            </p>
          </div>
          <div className="flex space-x-6">
            {navigation.social.map((item) => (
              <Link key={item.name} href={item.href} className="text-slate-400 hover:text-slate-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">TypeflowAI</h3>
            {navigation.footernav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="my-1 block text-slate-300 hover:text-lime-400">
                {item.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Solutions</h3>
            {navigation.solutions.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="my-1 block text-slate-300 hover:text-lime-400">
                {item.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Use cases</h3>
            {navigation.useCases.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="my-1 block text-slate-300 hover:text-lime-400">
                {item.name}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Legal</h3>
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="my-1 block text-slate-300 hover:text-lime-400">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Image
        src={Sprite4}
        alt="Sprite4"
        className="absolute right-[3rem] top-[3rem]  z-[1] hidden max-h-full w-auto max-w-full flex-1 self-stretch self-stretch overflow-hidden lg:block"
      />
    </footer>
  );
}
