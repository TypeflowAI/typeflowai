import { TypeflowAIAPI } from "@typeflowai/api";
import typeflowai from "@typeflowai/js/app";
import { env } from "@typeflowai/lib/env";

export const typeflowAIEnabled =
  typeof env.NEXT_PUBLIC_TYPEFLOWAI_API_HOST && env.NEXT_PUBLIC_TYPEFLOWAI_ENVIRONMENT_ID;
const ttc = { onboarding: 0 };

const getTypeflowAIApi = () => {
  const environmentId = env.NEXT_PUBLIC_TYPEFLOWAI_ENVIRONMENT_ID;
  const apiHost = env.NEXT_PUBLIC_TYPEFLOWAI_API_HOST;

  if (typeof environmentId !== "string" || typeof apiHost !== "string") {
    throw new Error("TypeflowAI environment ID or API host is not defined");
  }

  return new TypeflowAIAPI({
    environmentId,
    apiHost,
  });
};

export const createResponse = async (
  workflowId: string,
  userId: string,
  data: { [questionId: string]: any },
  finished: boolean = false
): Promise<any> => {
  const api = getTypeflowAIApi();
  return await api.client.response.create({
    workflowId,
    userId,
    finished,
    data,
    ttc,
  });
};

export const updateResponse = async (
  responseId: string,
  data: { [questionId: string]: any },
  finished: boolean = false
): Promise<any> => {
  const api = getTypeflowAIApi();
  return await api.client.response.update({
    responseId,
    finished,
    data,
    ttc,
  });
};

export const typeflowAILogout = async () => {
  return await typeflowai.logout();
};
