"use client";

import revalidateWorkflowIdPath from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/actions";
import { PresentationIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { SecondaryNavigation } from "@typeflowai/ui/SecondaryNavigation";

interface WorkflowAnalysisNavigationProps {
  environmentId: string;
  workflowId: string;
  responseCount: number | null;
  activeId: string;
}

export const WorkflowAnalysisNavigation = ({
  environmentId,
  workflowId,
  responseCount,
  activeId,
}: WorkflowAnalysisNavigationProps) => {
  const pathname = usePathname();
  const params = useParams();
  const sharingKey = params.sharingKey as string;
  const isSharingPage = !!sharingKey;

  const url = isSharingPage
    ? `/share/${sharingKey}`
    : `/environments/${environmentId}/workflows/${workflowId}`;

  const navigation = [
    {
      id: "summary",
      label: `Summary ${responseCount !== null ? `(${responseCount} resp.)` : ""}`,
      icon: <PresentationIcon className="h-5 w-5" />,
      href: `${url}/summary?referer=true`,
      current: pathname?.includes("/summary"),
      onClick: () => {
        revalidateWorkflowIdPath(environmentId, workflowId);
      },
    },
  ];

  return <SecondaryNavigation navigation={navigation} activeId={activeId} />;
};
