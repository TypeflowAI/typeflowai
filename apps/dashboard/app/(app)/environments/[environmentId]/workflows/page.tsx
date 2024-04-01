import WidgetStatusIndicator from "@/app/(app)/environments/[environmentId]/components/WidgetStatusIndicator";
import { Metadata } from "next";

import ContentWrapper from "@typeflowai/ui/ContentWrapper";

import WorkflowsList from "./components/WorkflowList";

export const metadata: Metadata = {
  title: "Your Workflows",
};

export default async function WorkflowsPage({ params }) {
  return (
    <>
      <div className="h-full lg:ml-64">
        <ContentWrapper className="flex h-full flex-col justify-between">
          <WorkflowsList environmentId={params.environmentId} />
          <WidgetStatusIndicator environmentId={params.environmentId} type="mini" />
        </ContentWrapper>
      </div>
    </>
  );
}
