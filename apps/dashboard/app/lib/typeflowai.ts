import typeflowai from "@typeflowai/js";
import { env } from "@typeflowai/lib/env.mjs";

export const typeflowaiEnabled =
  typeof env.NEXT_PUBLIC_TYPEFLOWAI_API_HOST && env.NEXT_PUBLIC_TYPEFLOWAI_ENVIRONMENT_ID;
const ttc = { onboarding: 0 };

export const createResponse = async (
  workflowId: string,
  userId: string,
  data: { [questionId: string]: any },
  finished: boolean = false
): Promise<any> => {
  const api = typeflowai.getApi();
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
  const api = typeflowai.getApi();
  return await api.client.response.update({
    responseId,
    finished,
    data,
    ttc,
  });
};

export const typeflowaiLogout = async () => {
  return await typeflowai.logout();
};
