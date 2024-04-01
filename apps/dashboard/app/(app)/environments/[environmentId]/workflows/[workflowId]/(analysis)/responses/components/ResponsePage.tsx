"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import WorkflowResultsTabs from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/WorkflowResultsTabs";
import ResponseTimeline from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/responses/components/ResponseTimeline";
import CustomFilter from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/CustomFilter";
import SummaryHeader from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/SummaryHeader";
import { getFilterResponses } from "@/app/lib/workflows/workflows";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import ContentWrapper from "@typeflowai/ui/ContentWrapper";

interface ResponsePageProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  workflowId: string;
  responses: TResponse[];
  webAppUrl: string;
  product: TProduct;
  user: TUser;
  environmentTags: TTag[];
  responsesPerPage: number;
  membershipRole?: TMembershipRole;
}

const ResponsePage = ({
  environment,
  workflow,
  workflowId,
  responses,
  webAppUrl,
  product,
  user,
  environmentTags,
  responsesPerPage,
  membershipRole,
}: ResponsePageProps) => {
  const { selectedFilter, dateRange, resetState } = useResponseFilter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams?.get("referer")) {
      resetState();
    }
  }, [searchParams]);

  // get the filtered array when the selected filter value changes
  const filterResponses: TResponse[] = useMemo(() => {
    return getFilterResponses(responses, selectedFilter, workflow, dateRange);
  }, [selectedFilter, responses, workflow, dateRange]);
  return (
    <ContentWrapper>
      <SummaryHeader
        environment={environment}
        workflow={workflow}
        workflowId={workflowId}
        webAppUrl={webAppUrl}
        product={product}
        user={user}
        membershipRole={membershipRole}
      />
      <CustomFilter
        environmentTags={environmentTags}
        responses={filterResponses}
        workflow={workflow}
        totalResponses={responses}
      />
      <WorkflowResultsTabs activeId="responses" environmentId={environment.id} workflowId={workflowId} />
      <ResponseTimeline
        environment={environment}
        workflowId={workflowId}
        responses={filterResponses}
        workflow={workflow}
        user={user}
        environmentTags={environmentTags}
        responsesPerPage={responsesPerPage}
      />
    </ContentWrapper>
  );
};

export default ResponsePage;
