"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import {
  getResponseCountAction,
  getResponsesAction,
} from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/actions";
import { WorkflowResultsTabs } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/WorkflowResultsTabs";
import ResponseTimeline from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/responses/components/ResponseTimeline";
import { CustomFilter } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/CustomFilter";
import { ResultsShareButton } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/ResultsShareButton";
import { SummaryHeader } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/SummaryHeader";
import { getFormattedFilters } from "@/app/lib/workflows/workflows";
import {
  getResponseCountByWorkflowSharingKeyAction,
  getResponsesByWorkflowSharingKeyAction,
} from "@/app/share/[sharingKey]/action";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";

interface ResponsePageProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  workflowId: string;
  webAppUrl: string;
  product: TProduct;
  user?: TUser;
  environmentTags: TTag[];
  responsesPerPage: number;
  membershipRole?: TMembershipRole;
  totalResponseCount: number;
}

const ResponsePage = ({
  environment,
  workflow,
  workflowId,
  webAppUrl,
  product,
  user,
  environmentTags,
  responsesPerPage,
  membershipRole,
  totalResponseCount,
}: ResponsePageProps) => {
  const params = useParams();
  const sharingKey = params.sharingKey as string;
  const isSharingPage = !!sharingKey;

  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [responses, setResponses] = useState<TResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingFirstPage, setFetchingFirstPage] = useState<boolean>(true);

  const { selectedFilter, dateRange, resetState } = useResponseFilter();

  const filters = useMemo(
    () => getFormattedFilters(workflow, selectedFilter, dateRange),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFilter, dateRange]
  );

  const searchParams = useSearchParams();

  workflow = useMemo(() => {
    return checkForRecallInHeadline(workflow, "default");
  }, [workflow]);

  const fetchNextPage = useCallback(async () => {
    const newPage = page + 1;

    let newResponses: TResponse[] = [];

    if (isSharingPage) {
      newResponses = await getResponsesByWorkflowSharingKeyAction(
        sharingKey,
        newPage,
        responsesPerPage,
        filters
      );
    } else {
      newResponses = await getResponsesAction(workflowId, newPage, responsesPerPage, filters);
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
          responses = await getResponsesByWorkflowSharingKeyAction(sharingKey, 1, responsesPerPage, filters);
        } else {
          responses = await getResponsesAction(workflowId, 1, responsesPerPage, filters);
        }

        if (responses.length < responsesPerPage) {
          setHasMore(false);
        }
        setResponses(responses);
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
      <div className="flex gap-1.5">
        <CustomFilter workflow={workflow} />
        {!isSharingPage && <ResultsShareButton workflow={workflow} webAppUrl={webAppUrl} user={user} />}
      </div>
      <WorkflowResultsTabs
        activeId="responses"
        environmentId={environment.id}
        workflowId={workflowId}
        responseCount={responseCount}
      />
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
    </ContentWrapper>
  );
};

export default ResponsePage;
