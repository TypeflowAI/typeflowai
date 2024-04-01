import revalidateWorkflowIdPath from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/actions";
import { InboxStackIcon, PresentationChartLineIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { cn } from "@typeflowai/lib/cn";

interface WorkflowResultsTabProps {
  activeId: string;
  environmentId: string;
  workflowId: string;
  sharingKey: string;
}

export default function WorkflowResultsTab({
  activeId,
  environmentId,
  workflowId,
  sharingKey,
}: WorkflowResultsTabProps) {
  const tabs = [
    {
      id: "summary",
      label: "Summary",
      icon: <PresentationChartLineIcon />,
      href: `/share/${sharingKey}/summary?referer=true`,
    },
    {
      id: "responses",
      label: "Responses",
      icon: <InboxStackIcon />,
      href: `/share/${sharingKey}/responses?referer=true`,
    },
  ];

  return (
    <div>
      <div className="mb-7 h-14 w-full border-b">
        <nav className="flex h-full items-center space-x-4 justify-self-center" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              onClick={() => {
                revalidateWorkflowIdPath(environmentId, workflowId);
              }}
              href={tab.href}
              className={cn(
                tab.id === activeId
                  ? " border-brand-dark text-brand-dark border-b-2 font-semibold"
                  : "text-slate-500 hover:text-slate-700",
                "flex h-full items-center px-3 text-sm font-medium"
              )}
              aria-current={tab.id === activeId ? "page" : undefined}>
              {tab.icon && <div className="mr-2 h-5 w-5">{tab.icon}</div>}
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
