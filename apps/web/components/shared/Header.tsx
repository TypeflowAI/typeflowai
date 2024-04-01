import { Popover, Transition } from "@headlessui/react";
import {
  ArrowLongRightIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  GiftIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePlausible } from "next-plausible";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

import { Button } from "@typeflowai/ui/v2/Button";

import GitHubButton from "./GithubButton";
import { Logo, LogoDark } from "./Logo";

function GitHubIcon(props: any) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  );
}

const TeamUsers = [
  {
    name: "Marketing",
    href: "/solutions/marketing",
    description: "AI Forms for Marketing",
  },
  {
    name: "Sales",
    href: "/solutions/sales",
    description: "AI Forms for Sales",
  },
  {
    name: "Business",
    href: "/solutions/business",
    description: "AI Forms for Business",
  },
  {
    name: "HR",
    href: "/solutions/hr",
    description: "AI Forms for HR",
  },
  {
    name: "Customer Service",
    href: "/solutions/customer-service",
    description: "AI Forms for Customer Service",
  },
];

const UseCaseUsers1 = [
  {
    name: "Content Marketing Ideas",
    href: "/use-cases/content-marketing-ideas-generator",
    description: "Generate fresh and engaging ideas for your content marketing strategy.",
  },
  {
    name: "LinkedIn Post Gen.",
    href: "/use-cases/linkedin-post-generator",
    description: "Craft compelling posts for LinkedIn to engage with your professional network.",
  },
  {
    name: "Google Ads Copy Gen.",
    href: "/use-cases/google-ads-copy-generator",
    description: "Create effective ad copy that resonates with your Google Ads audience.",
  },
  {
    name: "Tweet Generator",
    href: "/use-cases/tweet-generator",
    description: "Produce creative and catchy tweets to capture your audience's attention.",
  },
];

const UseCaseUsers2 = [
  {
    name: "Dynamic Lead Magnet",
    href: "/use-cases/dynamic-lead-magnet",
    description: "Design lead magnets that convert and captivate your potential customers.",
  },
  {
    name: "Cold Email Generator",
    href: "/use-cases/cold-email-generator",
    description: "Write cold emails that get responses and start meaningful business conversations.",
  },
  {
    name: "AI Keyword Research",
    href: "/use-cases/seo-keyword-generator",
    description: "Leverage AI to discover and analyze top-performing keywords for SEO.",
  },
  {
    name: "Buyer Persona Gen.",
    href: "/use-cases/buyer-persona-generator",
    description: "Develop detailed buyer personas to better understand your target audience.",
  },
];

interface HeaderProps {
  inverted?: boolean;
  isWhite?: boolean;
}

export default function Header({ inverted, isWhite }: HeaderProps) {
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const plausible = usePlausible();
  const router = useRouter();
  const [stickyNav, setStickyNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setStickyNav(true);
      } else {
        setStickyNav(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let headerBaseClass = "bg-violet-950";
  if (inverted) {
    if (isWhite) {
      headerBaseClass = "bg-white";
    } else {
      headerBaseClass = "bg-violet-50";
    }
  }
  const popoverButtonOpenedClass = inverted ? "text-brand" : "text-lime-400";
  const popoverButtonClosedClass = inverted ? "text-gray-900" : "text-white";
  const stickyNavClass = stickyNav
    ? `${headerBaseClass} shadow-md md:shadow-lg bg-opacity-90 backdrop-blur-lg fixed top-0 z-30 w-full border-b border-white/20`
    : `relative ${headerBaseClass}`;
  return (
    <Popover className={`${stickyNavClass}`} as="header">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-6 sm:px-6 md:justify-start lg:px-10 xl:px-12 ">
        <div className="mr-5 flex-none justify-start">
          <Link href="/">
            <span className="sr-only">TypeflowAI</span>
            {inverted ? <LogoDark className="h-7 w-auto" /> : <Logo className="h-7 w-auto" />}
          </Link>
        </div>
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button
            className={clsx(
              inverted ? "bg-brand text-white" : "bg-lime-400 text-violet-950",
              "inline-flex items-center justify-center rounded-md p-2 focus:outline-none"
            )}>
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <Popover.Group as="nav" className="ml-10 hidden space-x-6 md:flex lg:space-x-10">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className={clsx(
                    open ? `${popoverButtonOpenedClass}` : `${popoverButtonClosedClass}`,
                    `group inline-flex items-center rounded-md px-2 text-base font-medium hover:${popoverButtonOpenedClass} focus:px-2 focus:outline-none`
                  )}>
                  <span className="text-sm lg:text-base">Solutions</span>
                  <ChevronDownIcon
                    className={clsx(
                      open ? `${popoverButtonOpenedClass}` : `${popoverButtonClosedClass}`,
                      `ml-2 h-5 w-5 group-hover:${popoverButtonOpenedClass}`
                    )}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1">
                  <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-lg transform lg:left-1/2 lg:ml-0 lg:max-w-3xl lg:-translate-x-1/2">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-6 sm:p-8 lg:grid-cols-3">
                        <div>
                          <div className="-m-3 flex p-3 py-4 text-lg font-semibold text-slate-900">
                            <UsersIcon className="mx-3 h-6 w-6" />
                            <div className="ml-1">
                              <h4 className="mb-3">By team</h4>

                              {TeamUsers.map((brick) => (
                                <Link
                                  key={brick.name}
                                  href={brick.href}
                                  className="group mb-3 flex cursor-pointer items-center hover:underline">
                                  <p className="text-base font-normal text-slate-600">{brick.name}</p>
                                  <ArrowLongRightIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-2">
                          <div className="-m-3 flex p-3 py-4 text-lg font-semibold text-slate-900">
                            <GiftIcon className="mx-3 h-6 w-6" />
                            <div className="ml-1">
                              <h4 className="mb-3">By use case</h4>
                              <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                  {UseCaseUsers1.map((brick) => (
                                    <Link
                                      key={brick.name}
                                      href={brick.href}
                                      className="group mb-3 flex cursor-pointer items-center hover:underline">
                                      <p className="text-base font-normal text-slate-600">{brick.name}</p>
                                      <ArrowLongRightIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />
                                    </Link>
                                  ))}
                                </div>
                                <div className="flex flex-col">
                                  {UseCaseUsers2.map((brick) => (
                                    <Link
                                      key={brick.name}
                                      href={brick.href}
                                      className="group mb-3 flex cursor-pointer items-center hover:underline">
                                      <p className="text-base font-normal text-slate-600">{brick.name}</p>
                                      <ArrowLongRightIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                              <Link
                                href="https://dashboard.typeflowai.com/auth/signup"
                                className="group mb-3 flex cursor-pointer items-center underline">
                                <p className="text-lg font-medium text-gray-900">See all use cases</p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <Link
            href="#pricing"
            className={clsx(
              inverted ? "hover:text-brand text-gray-900" : "text-white hover:text-lime-400",
              "text-sm font-medium lg:text-base"
            )}>
            Pricing
          </Link>
          <Link
            href="/docs"
            className={clsx(
              inverted ? "hover:text-brand text-gray-900" : "text-white hover:text-lime-400",
              "text-sm font-medium lg:text-base"
            )}>
            Docs
          </Link>
          {/* <Link
            href="/blog"
            className="text-sm font-medium text-slate-400 hover:text-slate-700 lg:text-base">
            Blog
          </Link> */}
        </Popover.Group>
        <div className="hidden flex-1 items-center justify-end md:flex">
          <Button
            variant="minimal"
            className={clsx(
              inverted ? "hover:text-brand text-gray-900" : "text-white hover:text-lime-400",
              "ml-2 text-xs lg:text-base"
            )}
            size="lg"
            onClick={() => {
              router.push("https://dashboard.typeflowai.com/auth/login");
              plausible("NavBar_CTA_Login");
            }}>
            Login
          </Button>
          {inverted ? (
            <Button
              variant="primary"
              className="ml-2 px-6 text-xs lg:text-base"
              size="lg"
              onClick={() => {
                router.push("https://dashboard.typeflowai.com/auth/signup");
                plausible("NavBar_CTA_Register");
              }}>
              Register
            </Button>
          ) : (
            <Button
              variant="lightCTA"
              className="ml-2 px-6 text-xs lg:text-base"
              size="lg"
              onClick={() => {
                router.push("https://dashboard.typeflowai.com/auth/signup");
                plausible("NavBar_CTA_Register");
              }}>
              Register
            </Button>
          )}
          <div className="ml-2"></div>
          <GitHubButton inverted={inverted} />
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95">
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-20 origin-top-right transform p-2 transition md:hidden">
          <div className="divide-y-2 divide-slate-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pb-6 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <LogoDark className="h-7 w-auto" />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-brand inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="px-5 py-6">
              <div className="flex flex-col space-y-5 text-left text-sm">
                <div>
                  {mobileSubOpen ? (
                    <ChevronDownIcon className="mr-2 inline h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="mr-2 inline h-4 w-4" />
                  )}
                  <button onClick={() => setMobileSubOpen(!mobileSubOpen)}>Solutions</button>
                </div>
                {mobileSubOpen && (
                  <div className="text-normal flex flex-col space-y-5 text-center">
                    <div className="text-normal flex p-3 py-2 font-semibold text-slate-900">
                      <UsersIcon className="mt-1 h-5 w-5" />
                      <div className="ml-2 flex flex-col items-start">
                        <h4 className="mb-3 text-base">By team</h4>
                        {TeamUsers.map((brick) => (
                          <Link
                            key={brick.name}
                            href={brick.href}
                            className="group mb-2 flex cursor-pointer items-center hover:underline">
                            <p className="text-base font-normal text-slate-600">{brick.name}</p>
                            <ArrowLongRightIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="text-normal flex p-3 py-2 font-semibold text-slate-900">
                      <GiftIcon className="mt-1 h-5 w-5" />
                      <div className="ml-2 flex flex-col items-start">
                        <h4 className="mb-3 text-base">By use case</h4>
                        {UseCaseUsers1.map((brick) => (
                          <Link
                            key={brick.name}
                            href={brick.href}
                            className="group mb-2 flex cursor-pointer items-center hover:underline">
                            <p className="text-base font-normal text-slate-600">{brick.name}</p>
                            <ArrowLongRightIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />
                          </Link>
                        ))}
                        {UseCaseUsers2.map((brick) => (
                          <Link
                            key={brick.name}
                            href={brick.href}
                            className="group mb-2 flex cursor-pointer items-center hover:underline">
                            <p className="text-base font-normal text-slate-600">{brick.name}</p>
                            <ArrowLongRightIcon className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <hr className="mx-20 my-6 opacity-25" />
                  </div>
                )}
                <Link href="#pricing">Pricing</Link>
                <Link href="/docs">Docs</Link>
                {/* <Link href="/blog">Blog</Link> */}
                <span className="flex cursor-pointer text-slate-800" onClick={() => router.push("/github")}>
                  View on Github<GitHubIcon className="ml-3 h-5 w-5"></GitHubIcon>
                </span>
                <Button
                  variant="secondary"
                  onClick={() => router.push("https://dashboard.typeflowai.com/auth/login")}
                  className="flex w-full justify-center">
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push("https://dashboard.typeflowai.com/auth/signup")}
                  className="flex w-full justify-center">
                  Register
                </Button>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
