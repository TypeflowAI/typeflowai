import { TypeflowAIAPI } from "@typeflowai/api";

import { AppConfig } from "./config";

export const getApi = (): TypeflowAIAPI => {
  const inAppConfig = AppConfig.getInstance();
  const { environmentId, apiHost } = inAppConfig.get();

  if (!environmentId || !apiHost) {
    throw new Error("typeflowai.init() must be called before getApi()");
  }

  return new TypeflowAIAPI({
    apiHost,
    environmentId,
  });
};
