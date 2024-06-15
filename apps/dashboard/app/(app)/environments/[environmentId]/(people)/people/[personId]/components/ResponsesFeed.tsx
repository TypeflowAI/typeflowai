"use client";

import { useEffect, useState } from "react";
import { useMembershipRole } from "@typeflowai/lib/membership/hooks/useMembershipRole";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { replaceHeadlineRecall } from "@typeflowai/lib/utils/recall";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import { EmptySpaceFiller } from "@typeflowai/ui/EmptySpaceFiller";
import { SingleResponseCard } from "@typeflowai/ui/SingleResponseCard";

interface ResponseTimelineProps {
  workflows: TWorkflow[];
  user: TUser;
  responses: TResponse[];
  environment: TEnvironment;
  environmentTags: TTag[];
  attributeClasses: TAttributeClass[];
}

export const ResponseFeed = ({
  responses,
  environment,
  workflows,
  user,
  environmentTags,
  attributeClasses,
}: ResponseTimelineProps) => {
  const [fetchedResponses, setFetchedResponses] = useState(responses);

  useEffect(() => {
    setFetchedResponses(responses);
  }, [responses]);

  const deleteResponse = (responseId: string) => {
    setFetchedResponses(responses.filter((response) => response.id !== responseId));
  };

  const updateResponse = (responseId: string, updatedResponse: TResponse) => {
    setFetchedResponses(
      responses.map((response) => (response.id === responseId ? updatedResponse : response))
    );
  };

  return (
    <>
      {fetchedResponses.length === 0 ? (
        <EmptySpaceFiller type="response" environment={environment} />
      ) : (
        fetchedResponses.map((response) => (
          <ResponseWorkflowCard
            key={response.id}
            response={response}
            workflows={workflows}
            user={user}
            environmentTags={environmentTags}
            environment={environment}
            deleteResponse={deleteResponse}
            updateResponse={updateResponse}
            attributeClasses={attributeClasses}
          />
        ))
      )}
    </>
  );
};

const ResponseWorkflowCard = ({
  response,
  workflows,
  user,
  environmentTags,
  environment,
  deleteResponse,
  updateResponse,
  attributeClasses,
}: {
  response: TResponse;
  workflows: TWorkflow[];
  user: TUser;
  environmentTags: TTag[];
  environment: TEnvironment;
  deleteResponse: (responseId: string) => void;
  updateResponse: (responseId: string, response: TResponse) => void;
  attributeClasses: TAttributeClass[];
}) => {
  const workflow = workflows.find((workflow) => {
    return workflow.id === response.workflowId;
  });

  const { membershipRole } = useMembershipRole(workflow?.environmentId || "");
  const { isViewer } = getAccessFlags(membershipRole);

  return (
    <div key={response.id}>
      {workflow && (
        <SingleResponseCard
          response={response}
          workflow={replaceHeadlineRecall(workflow, "default", attributeClasses)}
          user={user}
          pageType="people"
          environmentTags={environmentTags}
          environment={environment}
          deleteResponse={deleteResponse}
          updateResponse={updateResponse}
          isViewer={isViewer}
        />
      )}
    </div>
  );
};
