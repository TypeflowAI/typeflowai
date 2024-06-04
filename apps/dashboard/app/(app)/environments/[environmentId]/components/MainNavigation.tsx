"use client";

import { NavigationLink } from "@/app/(app)/environments/[environmentId]/components/NavigationLink";
import { typeflowAILogout } from "@/app/lib/typeflowai";
import Logo from "@/images/logo.svg";
import {
  ArrowUpRightIcon,
  BlocksIcon,
  BotIcon,
  ChevronRightIcon,
  Cog,
  CreditCardIcon,
  LogOutIcon, // MousePointerClick,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlusIcon,
  SparklesIcon,
  UserCircleIcon, // UserIcon,
  UsersIcon,
} from "lucide-react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { capitalizeFirstLetter, truncate } from "@typeflowai/lib/strings";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TTeam } from "@typeflowai/types/teams";
import { ProfileAvatar } from "@typeflowai/ui/Avatars";
import { Button } from "@typeflowai/ui/Button";
import { CreateTeamModal } from "@typeflowai/ui/CreateTeamModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";

import { AddProductModal } from "./AddProductModal";

interface NavigationProps {
  environment: TEnvironment;
  teams: TTeam[];
  session: Session;
  team: TTeam;
  products: TProduct[];
  isTypeflowAICloud: boolean;
  isEnterprise?: boolean;
  membershipRole?: TMembershipRole;
}

export const MainNavigation = ({
  environment,
  teams,
  team,
  session,
  products,
  isTypeflowAICloud,
  isEnterprise,
  membershipRole,
}: NavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentTeamName, setCurrentTeamName] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const product = products.find((product) => product.id === environment.productId);
  const { isAdmin, isOwner, isViewer } = getAccessFlags(membershipRole);
  const isPricingDisabled = !isOwner && !isAdmin;
  const hasAnActiveSubscription = ["active", "canceled"].includes(team.billing.subscriptionStatus);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("isMainNavCollapsed", isCollapsed ? "false" : "true");
  };

  useEffect(() => {
    const isCollapsedValueFromLocalStorage = localStorage.getItem("isMainNavCollapsed") === "true";
    setIsCollapsed(isCollapsedValueFromLocalStorage);
  }, []);

  useEffect(() => {
    const toggleTextOpacity = () => {
      setIsTextVisible(isCollapsed ? true : false);
    };
    const timeoutId = setTimeout(toggleTextOpacity, 150);
    return () => clearTimeout(timeoutId);
  }, [isCollapsed]);

  useEffect(() => {
    if (team && team.name !== "") {
      setCurrentTeamName(team.name);
      setCurrentTeamId(team.id);
    }
  }, [team]);

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => a.name.localeCompare(b.name));
  }, [teams]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const handleEnvironmentChangeByProduct = (productId: string) => {
    router.push(`/products/${productId}/`);
  };

  const handleEnvironmentChangeByTeam = (teamId: string) => {
    router.push(`/teams/${teamId}/`);
  };

  const mainNavigation = useMemo(
    () => [
      {
        name: "AI Tools",
        href: `/environments/${environment.id}/workflows`,
        icon: BotIcon,
        isActive: pathname?.includes("/workflows"),
        isHidden: false,
      },
      // {
      //   name: "People",
      //   href: `/environments/${environment.id}/people`,
      //   icon: UserIcon,
      //   isActive:
      //     pathname?.includes("/people") ||
      //     pathname?.includes("/segments") ||
      //     pathname?.includes("/attributes"),
      // },
      // {
      //   name: "Actions",
      //   href: `/environments/${environment.id}/actions`,
      //   icon: MousePointerClick,
      //   isActive: pathname?.includes("/actions") || pathname?.includes("/actions"),
      //   isHidden: false,
      // },
      {
        name: "Integrations",
        href: `/environments/${environment.id}/integrations`,
        icon: BlocksIcon,
        isActive: pathname?.includes("/integrations"),
        isHidden: isViewer,
      },
      {
        name: "Configuration",
        href: `/environments/${environment.id}/product/general`,
        icon: Cog,
        isActive: pathname?.includes("/product"),
        isHidden: false,
      },
    ],
    [environment.id, pathname, isViewer]
  );

  const dropdownNavigation = [
    {
      label: "Account",
      href: `/environments/${environment.id}/settings/profile`,
      icon: UserCircleIcon,
    },
    {
      label: "Team",
      href: `/environments/${environment.id}/settings/members`,
      icon: UsersIcon,
    },
    {
      label: "Billing",
      href: `/environments/${environment.id}/settings/billing`,
      hidden: !isTypeflowAICloud || isPricingDisabled,
      icon: CreditCardIcon,
    },
    {
      name: "OpenAI",
      href: `/environments/${environment.id}/settings/openai`,
      icon: SparklesIcon,
      hidden: !isTypeflowAICloud || !isEnterprise,
      current: pathname?.includes("/openai"),
    },
    {
      label: "Documentation",
      href: "https://typeflowai.com/docs",
      target: "_blank",
      icon: ArrowUpRightIcon,
    },
    // {
    //   label: "Join Discord",
    //   href: "https://typeflowai.com/discord",
    //   target: "_blank",
    //   icon: ArrowUpRightIcon,
    // },
  ];

  return (
    <>
      {product && (
        <aside
          className={cn(
            "z-40 flex flex-col justify-between border-r bg-violet-950 pt-3 shadow-md transition-all duration-100",
            !isCollapsed ? "w-sidebar-collapsed" : "w-sidebar-expanded",
            environment.type === "development" ? `h-[calc(100vh-1.25rem)]` : "h-screen"
          )}>
          <div>
            {/* Logo and Toggle */}

            <div className="flex items-center justify-between px-3 pb-4">
              {!isCollapsed && (
                <Link
                  href={`/environments/${environment.id}/workflows/`}
                  className={cn(
                    "flex items-center justify-center transition-opacity duration-100",
                    isTextVisible ? "opacity-0" : "opacity-100"
                  )}>
                  <Image src={Logo} width={120} height={25} alt="TypeflowAI Logo" />
                </Link>
              )}
              <Button
                size="icon"
                tooltipSide="right"
                onClick={toggleSidebar}
                className={cn("rounded-xl border-none bg-violet-900 p-1 text-white")}>
                {isCollapsed ? (
                  <PanelLeftOpenIcon strokeWidth={1.5} />
                ) : (
                  <PanelLeftCloseIcon strokeWidth={1.5} />
                )}
              </Button>
            </div>

            {/* Main Nav Switch */}
            <ul>
              {mainNavigation.map(
                (item) =>
                  !item.isHidden && (
                    <NavigationLink
                      key={item.name}
                      href={item.href}
                      isActive={item.isActive}
                      isCollapsed={isCollapsed}
                      isTextVisible={isTextVisible}
                      linkText={item.name}>
                      <item.icon strokeWidth={1.5} />
                    </NavigationLink>
                  )
              )}
            </ul>
          </div>
          {/* Product Switch */}
          <div>
            {!hasAnActiveSubscription && !isCollapsed && (
              <div className="m-4">
                <Button
                  variant="primary"
                  size="base"
                  className="w-full justify-center font-bold text-white shadow-sm hover:opacity-90"
                  onClick={() => router.push(`/environments/${environment.id}/settings/billing`)}>
                  Upgrade Plan
                </Button>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                id="productDropdownTrigger"
                className="w-full rounded-br-xl border-t border-violet-900 py-4 transition-colors duration-200 hover:bg-violet-900 focus:outline-none">
                <div
                  tabIndex={0}
                  className={cn(
                    "flex cursor-pointer flex-row items-center space-x-5",
                    isCollapsed ? "pl-2" : "pl-4"
                  )}>
                  <div className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 font-bold text-slate-50">
                    XM
                  </div>
                  {!isCollapsed && !isTextVisible && (
                    <>
                      <div>
                        <p
                          className={cn(
                            "ph-no-capture ph-no-capture -mb-0.5 text-sm font-bold text-white transition-opacity duration-200 ",
                            isTextVisible ? "opacity-0" : "opacity-100"
                          )}>
                          {product.name}
                        </p>
                        <p
                          className={cn(
                            "text-sm text-gray-400 transition-opacity duration-200",
                            isTextVisible ? "opacity-0" : "opacity-100"
                          )}>
                          Product
                        </p>
                      </div>
                      <ChevronRightIcon
                        className={cn(
                          "h-5 w-5 text-white transition-opacity duration-200 hover:text-slate-500",
                          isTextVisible ? "opacity-0" : "opacity-100"
                        )}
                      />
                    </>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 space-y-1 rounded-xl border border-slate-200 shadow-sm"
                id="userDropdownInnerContentWrapper"
                side="right"
                sideOffset={10}
                alignOffset={-1}
                align="end">
                <DropdownMenuRadioGroup
                  value={product!.id}
                  onValueChange={(v) => handleEnvironmentChangeByProduct(v)}>
                  {sortedProducts.map((product) => (
                    <DropdownMenuRadioItem
                      value={product.id}
                      className="cursor-pointer break-all rounded-lg"
                      key={product.id}>
                      {product?.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                {!isViewer && (
                  <DropdownMenuItem onClick={() => setShowAddProductModal(true)} className="rounded-lg">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>Add product</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Switch */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  id="userDropdownTrigger"
                  className="w-full rounded-br-xl border-t border-violet-900 py-4 transition-colors duration-200 hover:bg-violet-900 focus:outline-none">
                  <div
                    tabIndex={0}
                    className={cn(
                      "flex cursor-pointer flex-row items-center space-x-5",
                      isCollapsed ? "pl-2" : "pl-4"
                    )}>
                    <ProfileAvatar userId={session.user.id} imageUrl={session.user.imageUrl} />
                    {!isCollapsed && !isTextVisible && (
                      <>
                        <div className={cn(isTextVisible ? "opacity-0" : "opacity-100")}>
                          <p
                            className={cn(
                              "ph-no-capture ph-no-capture -mb-0.5 text-sm font-bold text-white"
                            )}>
                            {session?.user?.name ? (
                              <span>{truncate(session?.user?.name, 30)}</span>
                            ) : (
                              <span>{truncate(session?.user?.email, 30)}</span>
                            )}
                          </p>
                          <p className={cn("text-text-sm text-sm text-gray-400")}>
                            {capitalizeFirstLetter(team?.name)}
                          </p>
                        </div>
                        <ChevronRightIcon className={cn("h-5 w-5 text-white hover:text-slate-500")} />
                      </>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-xl border border-slate-200 shadow-sm"
                  id="userDropdownInnerContentWrapper"
                  side="right"
                  sideOffset={10}
                  alignOffset={5}
                  align="end">
                  {/* Dropdown Items */}

                  {dropdownNavigation.map(
                    (link) =>
                      !link.hidden && (
                        <Link
                          href={link.href}
                          target={link.target}
                          key={link.label}
                          className="flex items-center">
                          <DropdownMenuItem
                            className="w-full gap-x-2 rounded-lg font-normal"
                            key={link.label}>
                            <link.icon className="h-4 w-4" strokeWidth={1.5} />
                            {link.label}
                          </DropdownMenuItem>
                        </Link>
                      )
                  )}

                  {/* Logout */}

                  <DropdownMenuItem
                    className="w-full gap-x-2 rounded-lg font-normal"
                    onClick={async () => {
                      await signOut({ callbackUrl: "/auth/login" });
                      await typeflowAILogout();
                    }}>
                    <LogOutIcon className="h-4 w-4" strokeWidth={1.5} />
                    Logout
                  </DropdownMenuItem>

                  {/* Team Switch */}

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-lg">
                      <div>
                        <p>{currentTeamName}</p>
                        <p className="block text-xs text-slate-500">Switch team</p>
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent
                        className="rounded-xl border border-slate-200 shadow-sm"
                        sideOffset={10}
                        alignOffset={5}>
                        <DropdownMenuRadioGroup
                          value={currentTeamId}
                          onValueChange={(teamId) => handleEnvironmentChangeByTeam(teamId)}>
                          {sortedTeams.map((team) => (
                            <DropdownMenuRadioItem
                              value={team.id}
                              className="cursor-pointer rounded-lg"
                              key={team.id}>
                              {team.name}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setShowCreateTeamModal(true)} className="rounded-lg">
                          <PlusIcon className="mr-2 h-4 w-4" />
                          <span>Create new team</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>
      )}
      <CreateTeamModal open={showCreateTeamModal} setOpen={(val) => setShowCreateTeamModal(val)} />
      <AddProductModal
        open={showAddProductModal}
        setOpen={(val) => setShowAddProductModal(val)}
        environmentId={environment.id}
      />
    </>
  );
};
