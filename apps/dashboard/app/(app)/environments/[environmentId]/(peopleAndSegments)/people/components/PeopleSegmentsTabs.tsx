import SecondNavbar from "@/app/(app)/environments/[environmentId]/(peopleAndSegments)/attributes/components/SecondNavbar";
import { TagIcon, UserIcon, UsersIcon } from "lucide-react";

interface PeopleSegmentsTabsProps {
  activeId: string;
  environmentId: string;
  isUserTargetingAllowed?: boolean;
}

export default function PeopleSegmentsTabs({ activeId, environmentId }: PeopleSegmentsTabsProps) {
  let tabs = [
    {
      id: "people",
      label: "People",
      icon: <UserIcon className="h-5 w-5" />,
      href: `/environments/${environmentId}/people`,
    },
    {
      id: "segments",
      label: "Segments",
      icon: <UsersIcon className="h-5 w-5" />,
      href: `/environments/${environmentId}/segments`,
    },
    {
      id: "attributes",
      label: "Attributes",
      icon: <TagIcon className="h-5 w-5" />,
      href: `/environments/${environmentId}/attributes`,
    },
  ];

  return <SecondNavbar tabs={tabs} activeId={activeId} environmentId={environmentId} />;
}
