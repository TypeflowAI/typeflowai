"use client";

import { getMoreResponses } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/actions";
import EmptyInAppWorkflows from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/EmptyInAppWorkflows";
import React, { useEffect, useRef, useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";
import SingleResponseCard from "@typeflowai/ui/SingleResponseCard";

interface ResponseTimelineProps {
  environment: TEnvironment;
  workflowId: string;
  responses: TResponse[];
  workflow: TWorkflow;
  user: TUser;
  environmentTags: TTag[];
  responsesPerPage: number;
}

export default function ResponseTimeline({
  environment,
  responses,
  workflow,
  user,
  environmentTags,
  responsesPerPage,
}: ResponseTimelineProps) {
  const loadingRef = useRef(null);
  const [fetchedResponses, setFetchedResponses] = useState<TResponse[]>(responses);
  const [page, setPage] = useState(2);
  const [hasMoreResponses, setHasMoreResponses] = useState<boolean>(responses.length > 0);

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;

    const loadResponses = async () => {
      const newResponses = await getMoreResponses(workflow.id, page);
      if (newResponses.length === 0) {
        setHasMoreResponses(false);
      } else {
        setPage(page + 1);
      }
      setFetchedResponses((prevResponses) => [...prevResponses, ...newResponses]);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (hasMoreResponses) loadResponses();
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
  }, [responses, responsesPerPage, page, workflow.id, fetchedResponses.length, hasMoreResponses]);

  return (
    <div className="space-y-4">
      {workflow.type === "web" && fetchedResponses.length === 0 && !environment.widgetSetupCompleted ? (
        <EmptyInAppWorkflows environment={environment} />
      ) : fetchedResponses.length === 0 ? (
        <EmptySpaceFiller
          type="response"
          environment={environment}
          noWidgetRequired={workflow.type === "link"}
        />
      ) : (
        <div>
          {fetchedResponses.map((response) => {
            return (
              <div key={response.id}>
                <SingleResponseCard
                  workflow={workflow}
                  response={response}
                  user={user}
                  environmentTags={environmentTags}
                  pageType="response"
                  environment={environment}
                />
              </div>
            );
          })}
          <div ref={loadingRef}></div>
        </div>
      )}
    </div>
  );
}
