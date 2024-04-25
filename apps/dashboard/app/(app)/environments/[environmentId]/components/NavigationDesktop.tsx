"use client";

import { typeflowaiLogout } from "@/app/lib/typeflowai";
import Logo from "@/images/logo.svg";
import {
  AdjustmentsVerticalIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  EnvelopeIcon, // FunnelIcon,
  HeartIcon,
  LinkIcon,
  PaintBrushIcon,
  PlusIcon,
  PuzzlePieceIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import typeflowai from "@typeflowai/js";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { capitalizeFirstLetter, truncate } from "@typeflowai/lib/strings";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TTeam } from "@typeflowai/types/teams";
import { ProfileAvatar } from "@typeflowai/ui/Avatars";
import { Button } from "@typeflowai/ui/Button";
import CreateTeamModal from "@typeflowai/ui/CreateTeamModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@typeflowai/ui/Tooltip";

// import { CustomersIcon, DashboardIcon, FilterIcon, FormIcon, SettingsIcon } from "@typeflowai/ui/icons";
import AddProductModal from "./AddProductModal";
import UrlShortenerModal from "./UrlShortenerModal";

interface NavigationProps {
  environment: TEnvironment;
  teams: TTeam[];
  session: Session;
  team: TTeam;
  products: TProduct[];
  environments: TEnvironment[];
  isTypeflowAICloud: boolean;
  webAppUrl: string;
  membershipRole?: TMembershipRole;
}

export default function NavigationDesktop({
  environment,
  teams,
  team,
  session,
  products,
  environments,
  isTypeflowAICloud,
  webAppUrl,
  membershipRole,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState("");
  const [widgetSetupCompleted, setWidgetSetupCompleted] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showLinkShortenerModal, setShowLinkShortenerModal] = useState(false);
  const product = products.find((product) => product.id === environment.productId);
  const { isAdmin, isOwner, isViewer } = getAccessFlags(membershipRole);
  const isPricingDisabled = !isOwner && !isAdmin;
  const hasAnActiveSubscription = ["active", "canceled"].includes(team.billing.subscriptionStatus);

  useEffect(() => {
    if (environment && environment.widgetSetupCompleted) {
      setWidgetSetupCompleted(true);
    } else {
      setWidgetSetupCompleted(false);
    }
  }, [environment]);

  useEffect(() => {
    if (team && team.name !== "") {
      setCurrentTeamName(team.name);
      setCurrentTeamId(team.id);
    }
  }, [team]);

  const navigation = useMemo(
    () => [
      {
        name: "Workflows",
        href: `/environments/${environment.id}/workflows`,
        icon: BoltIcon,
        current: pathname?.includes("/workflows"),
        hidden: false,
      },
      // {
      //   name: "People",
      //   href: `/environments/${environment.id}/people`,
      //   icon: UsersIcon,
      //   current: pathname?.includes("/people"),
      //   hidden: false,
      // },
      // {
      //   name: "Actions & Attributes",
      //   href: `/environments/${environment.id}/actions`,
      //   icon: FunnelIcon,
      //   current: pathname?.includes("/actions") || pathname?.includes("/attributes"),
      //   hidden: false,
      // },
      {
        name: "Integrations",
        href: `/environments/${environment.id}/integrations`,
        icon: PuzzlePieceIcon,
        current: pathname?.includes("/integrations"),
        hidden: isViewer,
      },
      {
        name: "Settings",
        href: `/environments/${environment.id}/settings/profile`,
        icon: Cog6ToothIcon,
        current: pathname?.includes("/settings"),
        hidden: false,
      },
    ],
    [environment.id, pathname]
  );

  const dropdownnavigation = [
    {
      title: "Workflow",
      links: [
        {
          icon: AdjustmentsVerticalIcon,
          label: "Product Settings",
          href: `/environments/${environment.id}/settings/product`,
          hidden: false,
        },
        {
          icon: PaintBrushIcon,
          label: "Look & Feel",
          href: `/environments/${environment.id}/settings/lookandfeel`,
          hidden: isViewer,
        },
      ],
    },
    {
      title: "Account",
      links: [
        {
          icon: UserCircleIcon,
          label: "Profile",
          href: `/environments/${environment.id}/settings/profile`,
        },
        { icon: UsersIcon, label: "Team", href: `/environments/${environment.id}/settings/members` },
        {
          icon: CreditCardIcon,
          label: "Billing & Plan",
          href: `/environments/${environment.id}/settings/billing`,
          hidden: !isTypeflowAICloud || isPricingDisabled,
        },
      ],
    },
    {
      title: "Setup",
      links: [
        {
          icon: DocumentCheckIcon,
          label: "Setup checklist",
          href: `/environments/${environment.id}/settings/setup`,
          hidden: widgetSetupCompleted,
        },
        {
          icon: LinkIcon,
          label: "Link Shortener",
          href: pathname,
          onClick: () => {
            setShowLinkShortenerModal(true);
          },
        },
        {
          icon: CodeBracketIcon,
          label: "Developer Docs",
          href: "https://typeflowai.com/docs",
          target: "_blank",
        },
        {
          icon: HeartIcon,
          label: "Contribute to TypeflowAI",
          href: "https://github.com/TypeflowAI/typeflowai",
          target: "_blank",
        },
      ],
    },
  ];

  const handleEnvironmentChange = (environmentType: "production" | "development") => {
    const newEnvironmentId = environments.find((e) => e.type === environmentType)?.id;
    if (newEnvironmentId) {
      router.push(`/environments/${newEnvironmentId}/`);
    }
  };

  const handleEnvironmentChangeByProduct = (productId: string) => {
    router.push(`/products/${productId}/`);
  };

  const handleEnvironmentChangeByTeam = (teamId: string) => {
    router.push(`/teams/${teamId}/`);
  };

  if (pathname?.includes("/edit")) return null;

  return (
    <>
      {product && (
        <>
          <div className="fixed hidden h-full w-64 grow flex-col gap-y-5 overflow-y-auto bg-violet-950 md:block">
            <div className="hidden h-full grow flex-col gap-y-5 overflow-y-auto bg-violet-950 px-6 lg:flex">
              <div className="flex h-24 shrink-0 items-center">
                <Link
                  href={`/environments/${environment.id}/workflows/`}
                  className="flex items-center justify-center rounded-md bg-gradient-to-b text-white transition-all ease-in-out hover:scale-105">
                  <Image className="my-3" src={Logo} width={150} height={30} alt="favicon" />
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const IconComponent: React.ElementType = item.icon;

                        return (
                          !item.hidden && (
                            <li key={item.name}>
                              <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                  item.current
                                    ? "bg-violet-900 text-lime-300"
                                    : "font-sm text-gray-300 hover:bg-violet-900 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 leading-6"
                                )}
                                aria-current={item.current ? "page" : undefined}>
                                <IconComponent className="mr-2 h-5 w-5 shrink-0" />
                                {item.name}
                              </Link>
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </li>
                  <li className="-mx-6 mt-auto">
                    {!hasAnActiveSubscription && (
                      <div className="mx-4 mb-3">
                        <Button
                          variant="primary"
                          size="base"
                          className="w-full justify-center font-bold text-white shadow-sm hover:opacity-90"
                          onClick={() => router.push(`/environments/${environment.id}/settings/billing`)}>
                          Upgrade Plan
                        </Button>
                      </div>
                    )}
                    {/* User Dropdown */}
                    <div className="hidden lg:mx-6 lg:flex lg:items-center lg:py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div tabIndex={0} className="flex cursor-pointer flex-row items-center space-x-5">
                            {session.user &&
                              (session.user.imageUrl ? (
                                <Image
                                  src={session.user.imageUrl}
                                  width="40"
                                  height="40"
                                  className="ph-no-capture h-10 w-10 rounded-full"
                                  alt="Profile picture"
                                />
                              ) : (
                                <ProfileAvatar userId={session.user.id} />
                              ))}
                            <div>
                              <p className="ph-no-capture ph-no-capture -mb-0.5 font-semibold text-white">
                                {truncate(product!.name, 30)}
                              </p>
                              <p className="text-sm text-gray-400">{capitalizeFirstLetter(team?.name)}</p>
                            </div>
                            <ChevronDownIcon className="h-5 w-5 text-white hover:text-slate-500" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mx-auto mb-2 w-56">
                          <DropdownMenuLabel className="cursor-default break-all">
                            <span className="ph-no-capture font-normal">Signed in as </span>
                            {session?.user?.name && session?.user?.name.length > 30 ? (
                              <TooltipProvider delayDuration={50}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>{truncate(session?.user?.name, 30)}</span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="max-w-[45rem] break-all"
                                    side="left"
                                    sideOffset={5}>
                                    {session?.user?.name}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              session?.user?.name
                            )}
                          </DropdownMenuLabel>

                          <DropdownMenuSeparator />

                          {/* Product Switch */}

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <div>
                                <div className="flex items-center space-x-1">
                                  <p className="">{truncate(product!.name, 20)}</p>
                                  {!widgetSetupCompleted && (
                                    <TooltipProvider delayDuration={50}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 hover:bg-amber-600"></div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Your app is not connected to TypeflowAI.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <p className=" block text-xs text-slate-500">Product</p>
                              </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="max-w-[45rem]">
                                <DropdownMenuRadioGroup
                                  value={product!.id}
                                  onValueChange={(v) => handleEnvironmentChangeByProduct(v)}>
                                  {products.map((product) => (
                                    <DropdownMenuRadioItem
                                      value={product.id}
                                      className="cursor-pointer break-all"
                                      key={product.id}>
                                      {product?.name}
                                    </DropdownMenuRadioItem>
                                  ))}
                                </DropdownMenuRadioGroup>

                                <DropdownMenuSeparator />
                                {!isViewer && (
                                  <DropdownMenuItem onClick={() => setShowAddProductModal(true)}>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    <span>Add product</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {/* Team Switch */}

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <div>
                                <p>{currentTeamName}</p>
                                <p className="block text-xs text-slate-500">Team</p>
                              </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                  value={currentTeamId}
                                  onValueChange={(teamId) => handleEnvironmentChangeByTeam(teamId)}>
                                  {teams?.map((team) => (
                                    <DropdownMenuRadioItem
                                      value={team.id}
                                      className="cursor-pointer"
                                      key={team.id}>
                                      {team.name}
                                    </DropdownMenuRadioItem>
                                  ))}
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setShowCreateTeamModal(true)}>
                                  <PlusIcon className="mr-2 h-4 w-4" />
                                  <span>Create team</span>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {/* Environment Switch */}

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <div>
                                <p>{capitalizeFirstLetter(environment?.type)}</p>
                                <p className=" block text-xs text-slate-500">Environment</p>
                              </div>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                  value={environment?.type}
                                  onValueChange={(v) =>
                                    handleEnvironmentChange(v as "production" | "development")
                                  }>
                                  <DropdownMenuRadioItem value="production" className="cursor-pointer">
                                    Production
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="development" className="cursor-pointer">
                                    Development
                                  </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {dropdownnavigation.map((item) => (
                            <DropdownMenuGroup key={item.title}>
                              <DropdownMenuSeparator />
                              {item.links.map(
                                (link) =>
                                  !link.hidden && (
                                    <Link href={link.href} target={link.target} key={link.label}>
                                      <DropdownMenuItem key={link.label} onClick={link?.onClick}>
                                        <div className="flex items-center">
                                          <link.icon className="mr-2 h-4 w-4" />
                                          <span>{link.label}</span>
                                        </div>
                                      </DropdownMenuItem>
                                    </Link>
                                  )
                              )}
                            </DropdownMenuGroup>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {isTypeflowAICloud && (
                              <>
                                <DropdownMenuItem>
                                  <a href="mailto:support@typeflowai.com">
                                    <div className="flex items-center">
                                      <EnvelopeIcon className="mr-2 h-4 w-4" />
                                      <span>Email us!</span>
                                    </div>
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <button
                                    onClick={() => {
                                      typeflowai.track("Top Menu: Product Feedback");
                                    }}>
                                    <div className="flex items-center">
                                      <ChatBubbleBottomCenterTextIcon className="mr-2 h-4 w-4" />
                                      <span>Product Feedback</span>
                                    </div>
                                  </button>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={async () => {
                                await signOut();
                                await typeflowaiLogout();
                              }}>
                              <div className="flex h-full w-full items-center">
                                <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                                Logout
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
            <AddProductModal
              open={showAddProductModal}
              setOpen={(val) => setShowAddProductModal(val)}
              environmentId={environment.id}
            />
            <CreateTeamModal open={showCreateTeamModal} setOpen={(val) => setShowCreateTeamModal(val)} />
            <UrlShortenerModal
              open={showLinkShortenerModal}
              setOpen={(val) => setShowLinkShortenerModal(val)}
              webAppUrl={webAppUrl}
            />
          </div>
        </>
      )}
    </>
  );
}
