import { writeData as airtableWriteData } from "@typeflowai/lib/airtable/service";
import { writeData } from "@typeflowai/lib/googleSheet/service";
import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { writeData as writeNotionData } from "@typeflowai/lib/notion/service";
import { processResponseData } from "@typeflowai/lib/responses";
import { writeDataToSlack } from "@typeflowai/lib/slack/service";
import { TIntegration } from "@typeflowai/types/integration";
import { TIntegrationAirtable } from "@typeflowai/types/integration/airtable";
import { TIntegrationGoogleSheets } from "@typeflowai/types/integration/googleSheet";
import { TIntegrationNotion, TIntegrationNotionConfigData } from "@typeflowai/types/integration/notion";
import { TIntegrationSlack } from "@typeflowai/types/integration/slack";
import { TPipelineInput } from "@typeflowai/types/pipelines";
import { TWorkflow, TWorkflowQuestionType } from "@typeflowai/types/workflows";

export async function handleIntegrations(
  integrations: TIntegration[],
  data: TPipelineInput,
  workflow: TWorkflow
) {
  for (const integration of integrations) {
    switch (integration.type) {
      case "googleSheets":
        await handleGoogleSheetsIntegration(integration as TIntegrationGoogleSheets, data, workflow);
        break;
      case "slack":
        await handleSlackIntegration(integration as TIntegrationSlack, data, workflow);
        break;
      case "airtable":
        await handleAirtableIntegration(integration as TIntegrationAirtable, data, workflow);
        break;
      case "notion":
        await handleNotionIntegration(integration as TIntegrationNotion, data, workflow);
        break;
    }
  }
}

async function handleAirtableIntegration(
  integration: TIntegrationAirtable,
  data: TPipelineInput,
  workflow: TWorkflow
) {
  if (integration.config.data.length > 0) {
    for (const element of integration.config.data) {
      if (element.workflowId === data.workflowId) {
        const values = await extractResponses(data, element.questionIds as string[], workflow);

        await airtableWriteData(integration.config.key, element, values);
      }
    }
  }
}

async function handleGoogleSheetsIntegration(
  integration: TIntegrationGoogleSheets,
  data: TPipelineInput,
  workflow: TWorkflow
) {
  if (integration.config.data.length > 0) {
    for (const element of integration.config.data) {
      if (element.workflowId === data.workflowId) {
        const values = await extractResponses(data, element.questionIds as string[], workflow);
        await writeData(integration.config.key, element.spreadsheetId, values);
      }
    }
  }
}

async function handleSlackIntegration(
  integration: TIntegrationSlack,
  data: TPipelineInput,
  workflow: TWorkflow
) {
  if (integration.config.data.length > 0) {
    for (const element of integration.config.data) {
      if (element.workflowId === data.workflowId) {
        const values = await extractResponses(data, element.questionIds as string[], workflow);
        await writeDataToSlack(integration.config.key, element.channelId, values, workflow?.name);
      }
    }
  }
}

async function extractResponses(
  data: TPipelineInput,
  questionIds: string[],
  workflow: TWorkflow
): Promise<string[][]> {
  const responses: string[] = [];
  const questions: string[] = [];

  for (const questionId of questionIds) {
    const question = workflow?.questions.find((q) => q.id === questionId);
    if (!question) {
      continue;
    }

    const responseValue = data.response.data[questionId];

    if (responseValue !== undefined) {
      let answer: typeof responseValue;
      if (question.type === TWorkflowQuestionType.PictureSelection) {
        const selectedChoiceIds = responseValue as string[];
        answer = question?.choices
          .filter((choice) => selectedChoiceIds.includes(choice.id))
          .map((choice) => choice.imageUrl)
          .join("\n");
      } else {
        answer = responseValue;
      }

      responses.push(processResponseData(answer));
    } else {
      responses.push("");
    }
    questions.push(getLocalizedValue(question?.headline, "default") || "");
  }

  return [responses, questions];
}

async function handleNotionIntegration(
  integration: TIntegrationNotion,
  data: TPipelineInput,
  workflowData: TWorkflow
) {
  if (integration.config.data.length > 0) {
    for (const element of integration.config.data) {
      if (element.workflowId === data.workflowId) {
        const properties = buildNotionPayloadProperties(element.mapping, data, workflowData);
        await writeNotionData(element.databaseId, properties, integration.config);
      }
    }
  }
}

function buildNotionPayloadProperties(
  mapping: TIntegrationNotionConfigData["mapping"],
  data: TPipelineInput,
  workflowData: TWorkflow
) {
  const properties: any = {};
  const responses = data.response.data;

  const mappingQIds = mapping
    .filter((m) => m.question.type === TWorkflowQuestionType.PictureSelection)
    .map((m) => m.question.id);

  Object.keys(responses).forEach((resp) => {
    if (mappingQIds.find((qId) => qId === resp)) {
      const selectedChoiceIds = responses[resp] as string[];
      const pictureQuestion = workflowData.questions.find((q) => q.id === resp);

      responses[resp] = (pictureQuestion as any)?.choices
        .filter((choice) => selectedChoiceIds.includes(choice.id))
        .map((choice) => choice.imageUrl);
    }
  });

  mapping.forEach((map) => {
    const value = responses[map.question.id];

    properties[map.column.name] = {
      [map.column.type]: getValue(map.column.type, value),
    };
  });

  return properties;
}

// notion requires specific payload for each column type
// * TYPES NOT SUPPORTED BY NOTION API - rollup, created_by, created_time, last_edited_by, or last_edited_time
function getValue(colType: string, value: string | string[] | number | Record<string, string>) {
  try {
    switch (colType) {
      case "select":
        return {
          name: value,
        };
      case "multi_select":
        return (value as []).map((v: string) => ({ name: v }));
      case "title":
        return [
          {
            text: {
              content: value,
            },
          },
        ];
      case "rich_text":
        return [
          {
            text: {
              content: value,
            },
          },
        ];
      case "status":
        return {
          name: value,
        };
      case "checkbox":
        return value === "accepted" || value === "clicked";
      case "date":
        return {
          start: new Date(value as string).toISOString().substring(0, 10),
        };
      case "email":
        return value;
      case "number":
        return parseInt(value as string);
      case "phone_number":
        return value;
      case "url":
        return typeof value === "string" ? value : (value as string[]).join(", ");
    }
  } catch (error) {
    throw new Error("Payload build failed!");
  }
}
