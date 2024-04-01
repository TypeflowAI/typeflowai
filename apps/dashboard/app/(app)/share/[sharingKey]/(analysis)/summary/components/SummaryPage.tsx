"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import SummaryDropOffs from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryDropOffs";
import SummaryList from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryList";
import SummaryMetadata from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryMetadata";
import CustomFilter from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/CustomFilter";
import WorkflowResultsTabs from "@/app/(app)/share/[sharingKey]/(analysis)/components/WorkflowResultsTabs";
import SummaryHeader from "@/app/(app)/share/[sharingKey]/components/SummaryHeader";
import { getFilterResponses } from "@/app/lib/workflows/workflows";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TProduct } from "@typeflowai/types/product";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflow } from "@typeflowai/types/workflows";
import ContentWrapper from "@typeflowai/ui/ContentWrapper";

interface SummaryPageProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  workflowId: string;
  responses: TResponse[];
  product: TProduct;
  sharingKey: string;
  environmentTags: TTag[];
  displayCount: number;
  responsesPerPage: number;
}

const SummaryPage = ({
  environment,
  workflow,
  workflowId,
  responses,
  product,
  sharingKey,
  environmentTags,
  displayCount,
  responsesPerPage: openTextResponsesPerPage,
}: SummaryPageProps) => {
  const { selectedFilter, dateRange, resetState } = useResponseFilter();
  const [showDropOffs, setShowDropOffs] = useState<boolean>(false);
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
      <SummaryHeader workflow={workflow} product={product} />
      <CustomFilter
        environmentTags={environmentTags}
        responses={filterResponses}
        workflow={workflow}
        totalResponses={responses}
      />
      <WorkflowResultsTabs
        activeId="summary"
        environmentId={environment.id}
        workflowId={workflowId}
        sharingKey={sharingKey}
      />
      <SummaryMetadata
        responses={filterResponses}
        workflow={workflow}
        displayCount={displayCount}
        showDropOffs={showDropOffs}
        setShowDropOffs={setShowDropOffs}
      />
      {showDropOffs && (
        <SummaryDropOffs workflow={workflow} responses={responses} displayCount={displayCount} />
      )}
      <SummaryList
        responses={filterResponses}
        workflow={workflow}
        environment={environment}
        responsesPerPage={openTextResponsesPerPage}
      />
    </ContentWrapper>
  );
};

export default SummaryPage;
