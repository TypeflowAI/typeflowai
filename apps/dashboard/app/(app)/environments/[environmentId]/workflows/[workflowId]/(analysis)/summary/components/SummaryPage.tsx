"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import {
  getResponseCountAction,
  getResponsesAction,
  getWorkflowSummaryAction,
} from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/actions";
import { ResponseTimeline } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/ResponseTimeline";
import { SummaryDropOffs } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryDropOffs";
import { SummaryMetadata } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/SummaryMetadata";
import { CustomFilter } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/CustomFilter";
import { ResultsShareButton } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/ResultsShareButton";
import { getFormattedFilters } from "@/app/lib/workflows/workflows";
import {
  getResponseCountByWorkflowSharingKeyAction,
  getResponsesByWorkflowSharingKeyAction,
  getSummaryByWorkflowSharingKeyAction,
} from "@/app/share/[sharingKey]/actions";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow, TWorkflowSummary } from "@typeflowai/types/workflows";

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
  environmentTags: TTag[];
  responsesPerPage: number;
  totalResponseCount: number;
}

export const SummaryPage = ({
  environment,
  workflow,
  workflowId,
  webAppUrl,
  user,
  environmentTags,
  responsesPerPage,
  totalResponseCount,
}: SummaryPageProps) => {
  const params = useParams();
  const sharingKey = params.sharingKey as string;
  const isSharingPage = !!sharingKey;

  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [responses, setResponses] = useState<TResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingFirstPage, setFetchingFirstPage] = useState<boolean>(true);
  const [workflowSummary, setWorkflowSummary] = useState<TWorkflowSummary>(initialWorkflowSummary);
  const [showDropOffs, setShowDropOffs] = useState<boolean>(false);

  const { selectedFilter, dateRange, resetState } = useResponseFilter();

  const filters = useMemo(
    () => getFormattedFilters(workflow, selectedFilter, dateRange),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilter, dateRange]
  );

  const searchParams = useSearchParams();

  const fetchNextPage = useCallback(async () => {
    const newPage = page + 1;

    let newResponses: TResponse[] = [];

    if (isSharingPage) {
      newResponses = await getResponsesByWorkflowSharingKeyAction(
        sharingKey,
        responsesPerPage,
        (newPage - 1) * responsesPerPage,
        filters
      );
    } else {
      newResponses = await getResponsesAction(
        workflowId,
        responsesPerPage,
        (newPage - 1) * responsesPerPage,
        filters
      );
    }

    if (newResponses.length === 0 || newResponses.length < responsesPerPage) {
      setHasMore(false);
    }
    setResponses([...responses, ...newResponses]);
    setPage(newPage);
  }, [filters, isSharingPage, page, responses, responsesPerPage, sharingKey, workflowId]);

  const deleteResponse = (responseId: string) => {
    setResponses(responses.filter((response) => response.id !== responseId));
    if (responseCount) {
      setResponseCount(responseCount - 1);
    }
  };

  const updateResponse = (responseId: string, updatedResponse: TResponse) => {
    setResponses(responses.map((response) => (response.id === responseId ? updatedResponse : response)));
  };

  useEffect(() => {
    if (!searchParams?.get("referer")) {
      resetState();
    }
  }, [searchParams, resetState]);

  useEffect(() => {
    const handleResponsesCount = async () => {
      let responseCount = 0;

      if (isSharingPage) {
        responseCount = await getResponseCountByWorkflowSharingKeyAction(sharingKey, filters);
      } else {
        responseCount = await getResponseCountAction(workflowId, filters);
      }

      setResponseCount(responseCount);
    };
    handleResponsesCount();
  }, [filters, isSharingPage, sharingKey, workflowId]);

  useEffect(() => {
    const fetchInitialResponses = async () => {
      try {
        setFetchingFirstPage(true);

        let responses: TResponse[] = [];

        if (isSharingPage) {
          responses = await getResponsesByWorkflowSharingKeyAction(sharingKey, responsesPerPage, 0, filters);
        } else {
          responses = await getResponsesAction(workflowId, responsesPerPage, 0, filters);
        }

        if (responses.length < responsesPerPage) {
          setHasMore(false);
        }
        setResponses(responses);

        let updatedWorkflowSummary;
        if (isSharingPage) {
          updatedWorkflowSummary = await getSummaryByWorkflowSharingKeyAction(sharingKey, filters);
        } else {
          updatedWorkflowSummary = await getWorkflowSummaryAction(workflowId, filters);
        }

        setWorkflowSummary(updatedWorkflowSummary);
      } finally {
        setFetchingFirstPage(false);
      }
    };
    fetchInitialResponses();
  }, [workflowId, filters, responsesPerPage, sharingKey, isSharingPage]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setResponses([]);
  }, [filters]);

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
      <ResponseTimeline
        environment={environment}
        workflowId={workflowId}
        responses={responses}
        workflow={workflow}
        user={user}
        environmentTags={environmentTags}
        fetchNextPage={fetchNextPage}
        hasMore={hasMore}
        deleteResponse={deleteResponse}
        updateResponse={updateResponse}
        isFetchingFirstPage={isFetchingFirstPage}
        responseCount={responseCount}
        totalResponseCount={totalResponseCount}
        isSharingPage={isSharingPage}
      />
    </>
  );
};
