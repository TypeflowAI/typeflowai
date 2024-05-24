"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import {
  getResponseCountAction,
  getWorkflowSummaryAction,
} from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/actions";
import { SummaryDropOffs } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryDropOffs";
import { CustomFilter } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/CustomFilter";
import { ResultsShareButton } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/ResultsShareButton";
import { getFormattedFilters } from "@/app/lib/workflows/workflows";
import {
  getResponseCountByWorkflowSharingKeyAction,
  getSummaryByWorkflowSharingKeyAction,
} from "@/app/share/[sharingKey]/action";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import { TEnvironment } from "@typeflowai/types/environment";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow, TWorkflowSummary } from "@typeflowai/types/workflows";

import { SummaryList } from "./SummaryList";
import { SummaryMetadata } from "./SummaryMetadata";

const initialWorkflowSummary: TWorkflowSummary = {
  meta: {
    completedPercentage: 0,
    completedResponses: 0,
    displayCount: 0,
    dropOffPercentage: 0,
    dropOffCount: 0,
    startsPercentage: 0,
    totalResponses: 0,
    ttcAverage: 0,
  },
  dropOff: [],
  summary: [],
};

interface SummaryPageProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  workflowId: string;
  webAppUrl: string;
  user?: TUser;
  totalResponseCount: number;
}

const SummaryPage = ({
  environment,
  workflow,
  workflowId,
  webAppUrl,
  user,
  totalResponseCount,
}: SummaryPageProps) => {
  const params = useParams();
  const sharingKey = params.sharingKey as string;
  const isSharingPage = !!sharingKey;

  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [workflowSummary, setWorkflowSummary] = useState<TWorkflowSummary>(initialWorkflowSummary);
  const [showDropOffs, setShowDropOffs] = useState<boolean>(false);
  const [isFetchingSummary, setFetchingSummary] = useState<boolean>(true);

  const { selectedFilter, dateRange, resetState } = useResponseFilter();

  const filters = useMemo(
    () => getFormattedFilters(workflow, selectedFilter, dateRange),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilter, dateRange]
  );

  useEffect(() => {
    const handleInitialData = async () => {
      try {
        setFetchingSummary(true);
        let updatedResponseCount;
        if (isSharingPage) {
          updatedResponseCount = await getResponseCountByWorkflowSharingKeyAction(sharingKey, filters);
        } else {
          updatedResponseCount = await getResponseCountAction(workflowId, filters);
        }
        setResponseCount(updatedResponseCount);

        let updatedWorkflowSummary;
        if (isSharingPage) {
          updatedWorkflowSummary = await getSummaryByWorkflowSharingKeyAction(sharingKey, filters);
        } else {
          updatedWorkflowSummary = await getWorkflowSummaryAction(workflowId, filters);
        }

        setWorkflowSummary(updatedWorkflowSummary);
      } finally {
        setFetchingSummary(false);
      }
    };

    handleInitialData();
  }, [filters, isSharingPage, sharingKey, workflowId]);

  const searchParams = useSearchParams();

  workflow = useMemo(() => {
    return checkForRecallInHeadline(workflow, "default");
  }, [workflow]);

  useEffect(() => {
    if (!searchParams?.get("referer")) {
      resetState();
    }
  }, [searchParams, resetState]);

  return (
    <>
      <SummaryMetadata
        workflowSummary={workflowSummary.meta}
        showDropOffs={showDropOffs}
        setShowDropOffs={setShowDropOffs}
      />
      {showDropOffs && <SummaryDropOffs dropOff={workflowSummary.dropOff} />}
      <div className="flex gap-1.5">
        <CustomFilter workflow={workflow} />
        {!isSharingPage && <ResultsShareButton workflow={workflow} webAppUrl={webAppUrl} user={user} />}
      </div>
      <SummaryList
        summary={workflowSummary.summary}
        responseCount={responseCount}
        workflow={workflow}
        environment={environment}
        fetchingSummary={isFetchingSummary}
        totalResponseCount={totalResponseCount}
      />
    </>
  );
};

export default SummaryPage;
