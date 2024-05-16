import { Container, Hr, Link, Tailwind, Text } from "@react-email/components";
import React from "react";

import { WEBAPP_URL } from "@typeflowai/lib/constants";
import {
  TWeeklySummaryNotificationDataWorkflow,
  TWeeklySummaryWorkflowResponseData,
} from "@typeflowai/types/weeklySummary";

import { EmailButton } from "../general/EmailButton";
import { renderEmailResponseValue } from "../workflow/ResponseFinishedEmail";

const getButtonLabel = (count: number): string => {
  if (count === 1) {
    return "View Response";
  }
  return `View ${count > 2 ? count - 1 : "1"} more Response${count > 2 ? "s" : ""}`;
};

const convertWorkflowStatus = (status: string): string => {
  const statusMap = {
    inProgress: "In Progress",
    paused: "Paused",
    completed: "Completed",
    draft: "Draft",
    scheduled: "Scheduled",
  };

  return statusMap[status] || status;
};

interface LiveWorkflowNotificationProps {
  environmentId: string;
  workflows: TWeeklySummaryNotificationDataWorkflow[];
}

export const LiveWorkflowNotification = ({ environmentId, workflows }: LiveWorkflowNotificationProps) => {
  const createWorkflowFields = (workflowResponses: TWeeklySummaryWorkflowResponseData[]) => {
    if (workflowResponses.length === 0) {
      return (
        <Container className="mt-4">
          <Text className="m-0 font-bold">No Responses yet!</Text>
        </Container>
      );
    }
    let workflowFields: JSX.Element[] = [];
    const responseCount = workflowResponses.length;

    workflowResponses.forEach((workflowResponse, index) => {
      if (!workflowResponse.responseValue) {
        return;
      }

      workflowFields.push(
        <Container className="mt-4" key={`${index}-${workflowResponse.headline}`}>
          <Text className="m-0">{workflowResponse.headline}</Text>
          {renderEmailResponseValue(workflowResponse.responseValue, workflowResponse.questionType)}
        </Container>
      );

      // Add <hr/> only when there are 2 or more responses to display, and it's not the last response
      if (responseCount >= 2 && index < responseCount - 1) {
        workflowFields.push(<Hr key={`hr-${index}`} />);
      }
    });

    return workflowFields;
  };

  if (!workflows.length) return "";

  return workflows.map((workflow, index) => {
    const displayStatus = convertWorkflowStatus(workflow.status);
    const isInProgress = displayStatus === "In Progress";
    const noResponseLastWeek = isInProgress && workflow.responses.length === 0;
    return (
      <Tailwind key={index}>
        <Container className="mt-12">
          <Text className="mb-0 inline">
            <Link
              href={`${WEBAPP_URL}/environments/${environmentId}/workflows/${workflow.id}/responses?utm_source=weekly&utm_medium=email&utm_content=ViewResponsesCTA`}
              className="text-xl text-black underline">
              {workflow.name}
            </Link>
          </Text>

          <Text
            className={`ml-2 inline ${
              isInProgress ? "bg-green-400 text-gray-100" : "bg-gray-300 text-blue-800"
            } rounded-full px-2 py-1 text-sm`}>
            {displayStatus}
          </Text>
          {noResponseLastWeek ? (
            <Text>No new response received this week 🕵️</Text>
          ) : (
            createWorkflowFields(workflow.responses)
          )}
          {workflow.responseCount > 0 && (
            <Container className="mt-4 block">
              <EmailButton
                label={
                  noResponseLastWeek ? "View previous responses" : getButtonLabel(workflow.responseCount)
                }
                href={`${WEBAPP_URL}/environments/${environmentId}/workflows/${workflow.id}/responses?utm_source=weekly&utm_medium=email&utm_content=ViewResponsesCTA`}
              />
            </Container>
          )}
        </Container>
      </Tailwind>
    );
  });
};
