"use client";

import EmptyInAppWorkflows from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/EmptyInAppWorkflows";
import { useEffect, useRef, useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflow } from "@typeflowai/types/workflows";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";
import SingleResponseCard from "@typeflowai/ui/SingleResponseCard";

interface ResponseTimelineProps {
  environment: TEnvironment;
  workflowId: string;
  responses: TResponse[];
  workflow: TWorkflow;
  environmentTags: TTag[];
  responsesPerPage: number;
}

export default function ResponseTimeline({
  environment,
  responses,
  workflow,
  environmentTags,
  responsesPerPage,
}: ResponseTimelineProps) {
  const [displayedResponses, setDisplayedResponses] = useState<TResponse[]>([]);
  const loadingRef = useRef(null);

  useEffect(() => {
    setDisplayedResponses(responses.slice(0, responsesPerPage));
  }, [responses]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedResponses((prevResponses) => [
            ...prevResponses,
            ...responses.slice(prevResponses.length, prevResponses.length + responsesPerPage),
          ]);
        }
      },
      { threshold: 0.8 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [responses]);

  return (
    <div className="space-y-4">
      {workflow.type === "web" && displayedResponses.length === 0 && !environment.widgetSetupCompleted ? (
        <EmptyInAppWorkflows environment={environment} />
      ) : displayedResponses.length === 0 ? (
        <EmptySpaceFiller
          type="response"
          environment={environment}
          noWidgetRequired={workflow.type === "link"}
        />
      ) : (
        <div>
          {displayedResponses.map((response) => {
            return (
              <div key={response.id}>
                <SingleResponseCard
                  workflow={workflow}
                  response={response}
                  environmentTags={environmentTags}
                  pageType="response"
                  environment={environment}
                  user={undefined}
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
