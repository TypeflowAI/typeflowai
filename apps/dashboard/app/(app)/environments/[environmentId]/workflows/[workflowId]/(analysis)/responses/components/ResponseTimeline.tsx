"use client";

import { EmptyAppWorkflows } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/EmptyInAppWorkflows";
import { useEffect, useRef, useState } from "react";
import { getMembershipByUserIdTeamIdAction } from "@typeflowai/lib/membership/hooks/actions";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { EmptySpaceFiller } from "@typeflowai/ui/EmptySpaceFiller";
import { SingleResponseCard } from "@typeflowai/ui/SingleResponseCard";
import { SkeletonLoader } from "@typeflowai/ui/SkeletonLoader";

interface ResponseTimelineProps {
  environment: TEnvironment;
  workflowId: string;
  responses: TResponse[];
  workflow: TWorkflow;
  user?: TUser;
  environmentTags: TTag[];
  fetchNextPage: () => void;
  hasMore: boolean;
  updateResponse: (responseId: string, responses: TResponse) => void;
  deleteResponse: (responseId: string) => void;
  isFetchingFirstPage: boolean;
  responseCount: number | null;
  totalResponseCount: number;
  isSharingPage?: boolean;
}

export const ResponseTimeline = ({
  environment,
  responses,
  workflow,
  user,
  environmentTags,
  fetchNextPage,
  hasMore,
  updateResponse,
  deleteResponse,
  isFetchingFirstPage,
  responseCount,
  totalResponseCount,
  isSharingPage = false,
}: ResponseTimelineProps) => {
  const [isViewer, setIsViewer] = useState(false);
  const loadingRef = useRef(null);

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (hasMore) fetchNextPage();
        }
      },
      { threshold: 0.8 }
    );

    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [fetchNextPage, hasMore]);

  useEffect(() => {
    const getRole = async () => {
      if (isSharingPage) return setIsViewer(true);

      const membershipRole = await getMembershipByUserIdTeamIdAction(workflow.environmentId);
      const { isViewer } = getAccessFlags(membershipRole);
      setIsViewer(isViewer);
    };
    getRole();
  }, [workflow.environmentId, isSharingPage]);

  return (
    <div className="space-y-4">
      {(workflow.type === "app" || workflow.type === "website") &&
      responses.length === 0 &&
      !environment.widgetSetupCompleted ? (
        <EmptyAppWorkflows environment={environment} workflowType={workflow.type} />
      ) : isFetchingFirstPage ? (
        <SkeletonLoader type="response" />
      ) : responseCount === 0 ? (
        <EmptySpaceFiller
          type="response"
          environment={environment}
          noWidgetRequired={workflow.type === "link"}
          emptyMessage={totalResponseCount === 0 ? undefined : "No response matches your filter"}
        />
      ) : (
        <div>
          {responses.map((response) => {
            return (
              <div key={response.id}>
                <SingleResponseCard
                  workflow={workflow}
                  response={response}
                  user={user}
                  environmentTags={environmentTags}
                  pageType="response"
                  environment={environment}
                  updateResponse={updateResponse}
                  deleteResponse={deleteResponse}
                  isViewer={isViewer}
                />
              </div>
            );
          })}
          <div ref={loadingRef}></div>
        </div>
      )}
    </div>
  );
};
