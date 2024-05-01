"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import CustomFilter from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/CustomFilter";
import WorkflowResultsTabs from "@/app/(app)/share/[sharingKey]/(analysis)/components/WorkflowResultsTabs";
import ResponseTimeline from "@/app/(app)/share/[sharingKey]/(analysis)/responses/components/ResponseTimeline";
import SummaryHeader from "@/app/(app)/share/[sharingKey]/components/SummaryHeader";
import { getFilterResponses } from "@/app/lib/workflows/workflows";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TProduct } from "@typeflowai/types/product";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflow } from "@typeflowai/types/workflows";
import ContentWrapper from "@typeflowai/ui/ContentWrapper";

interface ResponsePageProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  workflowId: string;
  responses: TResponse[];
  webAppUrl: string;
  product: TProduct;
  sharingKey: string;
  environmentTags: TTag[];
  responsesPerPage: number;
}

const ResponsePage = ({
  environment,
  workflow,
  workflowId,
  responses,
  product,
  sharingKey,
  environmentTags,
  responsesPerPage,
}: ResponsePageProps) => {
  const { selectedFilter, dateRange, resetState } = useResponseFilter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams?.get("referer")) {
      resetState();
    }
  }, [searchParams, resetState]);

  // get the filtered array when the selected filter value changes
  const filterResponses: TResponse[] = useMemo(() => {
    return getFilterResponses(responses, selectedFilter, workflow, dateRange);
  }, [selectedFilter, responses, workflow, dateRange]);
  return (
    <ContentWrapper>
      <SummaryHeader workflow={workflow} product={product} />
      <CustomFilter
        environmentTags={environmentTags}
        responses={filterResponses}
        workflow={workflow}
        totalResponses={responses}
      />
      <WorkflowResultsTabs
        activeId="responses"
        environmentId={environment.id}
        workflowId={workflowId}
        sharingKey={sharingKey}
      />
      <ResponseTimeline
        environment={environment}
        workflowId={workflowId}
        responses={filterResponses}
        workflow={workflow}
        environmentTags={environmentTags}
        responsesPerPage={responsesPerPage}
      />
    </ContentWrapper>
  );
};

export default ResponsePage;
