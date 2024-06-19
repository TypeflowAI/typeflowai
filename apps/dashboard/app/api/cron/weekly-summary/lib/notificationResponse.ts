import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { convertResponseValue } from "@typeflowai/lib/responses";
import { replaceHeadlineRecall } from "@typeflowai/lib/utils/recall";
import {
  TWeeklySummaryEnvironmentData,
  TWeeklySummaryNotificationDataWorkflow,
  TWeeklySummaryNotificationResponse,
  TWeeklySummaryWorkflowResponseData,
} from "@typeflowai/types/weeklySummary";

export const getNotificationResponse = (
  environment: TWeeklySummaryEnvironmentData,
  productName: string
): TWeeklySummaryNotificationResponse => {
  const insights = {
    totalCompletedResponses: 0,
    totalDisplays: 0,
    totalResponses: 0,
    completionRate: 0,
    numLiveWorkflow: 0,
  };

  const workflows: TWeeklySummaryNotificationDataWorkflow[] = [];
  // iterate through the workflows and calculate the overall insights
  for (const workflow of environment.workflows) {
    const parsedWorkflow = replaceHeadlineRecall(workflow, "default", environment.attributeClasses);
    const workflowData: TWeeklySummaryNotificationDataWorkflow = {
      id: parsedWorkflow.id,
      name: parsedWorkflow.name,
      status: parsedWorkflow.status,
      responseCount: parsedWorkflow.responses.length,
      responses: [],
    };
    // iterate through the responses and calculate the workflow insights
    for (const response of parsedWorkflow.responses) {
      // only take the first 3 responses
      if (workflowData.responses.length >= 3) {
        break;
      }
      const workflowResponses: TWeeklySummaryWorkflowResponseData[] = [];
      for (const question of parsedWorkflow.questions) {
        const headline = question.headline;
        const responseValue = convertResponseValue(response.data[question.id], question);
        const workflowResponse: TWeeklySummaryWorkflowResponseData = {
          headline: getLocalizedValue(headline, "default"),
          responseValue,
          questionType: question.type,
        };
        workflowResponses.push(workflowResponse);
      }
      workflowData.responses = workflowResponses;
    }
    workflows.push(workflowData);
    // calculate the overall insights
    if (workflow.status == "inProgress") {
      insights.numLiveWorkflow += 1;
    }
    insights.totalCompletedResponses += workflow.responses.filter((r) => r.finished).length;
    insights.totalDisplays += workflow.displays.length;
    insights.totalResponses += workflow.responses.length;
    insights.completionRate = Math.round((insights.totalCompletedResponses / insights.totalResponses) * 100);
  }
  // build the notification response needed for the emails
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  return {
    environmentId: environment.id,
    currentDate: new Date(),
    lastWeekDate,
    productName: productName,
    workflows,
    insights,
  };
};
