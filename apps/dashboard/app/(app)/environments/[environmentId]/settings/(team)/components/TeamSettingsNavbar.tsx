"use client";

import { CreditCardIcon, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { SecondaryNavigation } from "@typeflowai/ui/SecondaryNavigation";

export const TeamSettingsNavbar = ({
  environmentId,
  isTypeflowAICloud,
  membershipRole,
  activeId,
}: {
  environmentId: string;
  isTypeflowAICloud: boolean;
  membershipRole?: TMembershipRole;
  activeId: string;
}) => {
  const pathname = usePathname();
  const { isAdmin, isOwner } = getAccessFlags(membershipRole);
  const isPricingDisabled = !isOwner && !isAdmin;

  // console.log("hidden: ", !isTypeflowAICloud || isPricingDisabled);

  const navigation = [
    {
      id: "members",
      label: "Members",
      href: `/environments/${environmentId}/settings/members`,
      icon: <UsersIcon className="h-5 w-5" />,
      current: pathname?.includes("/members"),
      hidden: false,
    },
    {
      id: "billing",
      label: "Billing & Plan",
      href: `/environments/${environmentId}/settings/billing`,
      icon: <CreditCardIcon className="h-5 w-5" />,
      hidden: !isTypeflowAICloud || isPricingDisabled,
      current: pathname?.includes("/billing"),
    },
  ];

  return <SecondaryNavigation navigation={navigation} activeId={activeId} />;
};
