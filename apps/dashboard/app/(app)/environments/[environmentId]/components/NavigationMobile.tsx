"use client";

import EnvironmentAlert from "@/app/(app)/environments/[environmentId]/components/EnvironmentAlert";
import Logo from "@/images/icon.svg";
import clsx from "clsx";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TTeam } from "@typeflowai/types/teams";
import CreateTeamModal from "@typeflowai/ui/CreateTeamModal";
import { Popover, PopoverContent, PopoverTrigger } from "@typeflowai/ui/Popover";
import { CustomersIcon, DashboardIcon, FilterIcon, FormIcon, SettingsIcon } from "@typeflowai/ui/icons";

import AddProductModal from "./AddProductModal";
import UrlShortenerModal from "./UrlShortenerModal";

interface NavigationProps {
  environment: TEnvironment;
  teams: TTeam[];
  team: TTeam;
  products: TProduct[];
  environments: TEnvironment[];
  isTypeflowAICloud: boolean;
  webAppUrl: string;
  membershipRole?: TMembershipRole;
}

export default function NavigationMobile({
  environment,
  products,
  webAppUrl,
  membershipRole,
}: NavigationProps) {
  const pathname = usePathname();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showLinkShortenerModal, setShowLinkShortenerModal] = useState(false);
  const product = products.find((product) => product.id === environment.productId);
  const [mobileNavMenuOpen, setMobileNavMenuOpen] = useState(false);
  const { isViewer } = getAccessFlags(membershipRole);

  const navigation = useMemo(
    () => [
      {
        name: "Workflows",
        href: `/environments/${environment.id}/workflows`,
        icon: FormIcon,
        current: pathname?.includes("/workflows"),
        hidden: false,
      },
      {
        name: "People",
        href: `/environments/${environment.id}/people`,
        icon: CustomersIcon,
        current: pathname?.includes("/people"),
        hidden: false,
      },
      {
        name: "Actions & Attributes",
        href: `/environments/${environment.id}/actions`,
        icon: FilterIcon,
        current: pathname?.includes("/actions") || pathname?.includes("/attributes"),
        hidden: false,
      },
      {
        name: "Integrations",
        href: `/environments/${environment.id}/integrations`,
        icon: DashboardIcon,
        current: pathname?.includes("/integrations"),
        hidden: isViewer,
      },
      {
        name: "Settings",
        href: `/environments/${environment.id}/settings/profile`,
        icon: SettingsIcon,
        current: pathname?.includes("/settings"),
        hidden: false,
      },
    ],
    [environment.id, pathname]
  );

  if (pathname?.includes("/edit")) return null;

  return (
    <>
      {product && (
        <>
          <nav className="top-0 w-full border-b border-slate-200 bg-white lg:hidden">
            <EnvironmentAlert environment={environment} />
            {/* Mobile Menu */}
            <div className="w-full px-4 sm:px-6">
              <div className="flex h-14 justify-between">
                <div className="flex space-x-4 py-2">
                  <Link
                    href={`/environments/${environment.id}/workflows/`}
                    className="flex items-center justify-center rounded-md bg-gradient-to-b text-white transition-all ease-in-out hover:scale-105">
                    <Image src={Logo} width={25} height={25} alt="faveicon" />
                  </Link>

                  {navigation.map((item) => {
                    const IconComponent: React.ElementType = item.icon;

                    return (
                      !item.hidden && (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            item.current
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-900 hover:bg-slate-50 hover:text-slate-900",
                            "hidden items-center rounded-md px-2 py-1 text-sm font-medium lg:inline-flex"
                          )}
                          aria-current={item.current ? "page" : undefined}>
                          <IconComponent className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    );
                  })}
                </div>
                <div className="flex items-center lg:hidden">
                  <Popover open={mobileNavMenuOpen} onOpenChange={setMobileNavMenuOpen}>
                    <PopoverTrigger onClick={() => setMobileNavMenuOpen(!mobileNavMenuOpen)}>
                      <span>
                        <MenuIcon className="h-6 w-6 rounded-md bg-slate-200 p-1 text-slate-600" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="mr-4 bg-slate-100 shadow">
                      <div className="flex flex-col">
                        {navigation.map(
                          (navItem) =>
                            !navItem.hidden && (
                              <Link key={navItem.name} href={navItem.href}>
                                <div
                                  onClick={() => setMobileNavMenuOpen(false)}
                                  className={cn(
                                    "flex items-center space-x-2 rounded-md p-2",
                                    navItem.current && "bg-slate-200"
                                  )}>
                                  <navItem.icon className="h-5 w-5" />
                                  <span className="font-medium text-slate-600">{navItem.name}</span>
                                </div>
                              </Link>
                            )
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </nav>
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
        </>
      )}
    </>
  );
}
