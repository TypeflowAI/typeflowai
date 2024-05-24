"use client";

import { useEffect, useState } from "react";

import { useMembershipRole } from "@typeflowai/lib/membership/hooks/useMembershipRole";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";
import SingleResponseCard from "@typeflowai/ui/SingleResponseCard";

export default function ResponseFeed({
  responses,
  environment,
  workflows,
  user,
  environmentTags,
}: {
  responses: TResponse[];
  environment: TEnvironment;
  workflows: TWorkflow[];
  user: TUser;
  environmentTags: TTag[];
}) {
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
          />
        ))
      )}
    </>
  );
}

const ResponseWorkflowCard = ({
  response,
  workflows,
  user,
  environmentTags,
  environment,
  deleteResponse,
  updateResponse,
}: {
  response: TResponse;
  workflows: TWorkflow[];
  user: TUser;
  environmentTags: TTag[];
  environment: TEnvironment;
  deleteResponse: (responseId: string) => void;
  updateResponse: (responseId: string, response: TResponse) => void;
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
          workflow={checkForRecallInHeadline(workflow, "default")}
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
