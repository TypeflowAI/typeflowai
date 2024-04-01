import WorkflowNavBarName from "@/app/(app)/environments/[environmentId]/(actionsAndAttributes)/attributes/components/WorkflowNavBarName";
import Link from "next/link";

import { cn } from "@typeflowai/lib/cn";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

interface SecondNavbarProps {
  tabs: { id: string; label: string; href: string; icon?: React.ReactNode }[];
  activeId: string;
  workflowId?: string;
  environmentId: string;
}

export default async function SecondNavbar({
  tabs,
  activeId,
  workflowId,
  environmentId,
  ...props
}: SecondNavbarProps) {
  const product = await getProductByEnvironmentId(environmentId!);
  if (!product) {
    throw new Error("Product not found");
  }

  let workflow;
  if (workflowId) {
    workflow = await getWorkflow(workflowId);
  }

  return (
    <div {...props}>
      <div className="grid h-14 w-full grid-cols-3 items-center justify-items-stretch border-b bg-white px-4">
        <div className="justify-self-start">
          {workflow && environmentId && (
            <WorkflowNavBarName workflowName={workflow.name} productName={product.name} />
          )}
        </div>{" "}
        <nav className="flex h-full items-center space-x-4 justify-self-center" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                tab.id === activeId
                  ? " border-brand-dark border-b-2 font-semibold text-slate-900"
                  : "text-slate-500 hover:text-slate-700",
                "flex h-full items-center px-3 text-sm font-medium"
              )}
              aria-current={tab.id === activeId ? "page" : undefined}>
              {tab.icon && <div className="mr-2 h-5 w-5">{tab.icon}</div>}
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="justify-self-end"></div>
      </div>
    </div>
  );
}
