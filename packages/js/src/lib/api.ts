import { TypeflowAIAPI } from "@typeflowai/api";

import { Config } from "./config";

export const getApi = (): TypeflowAIAPI => {
  const config = Config.getInstance();
  const { environmentId, apiHost } = config.get();

  if (!environmentId || !apiHost) {
    throw new Error("typeflowai.init() must be called before getApi()");
  }

  return new TypeflowAIAPI({
    apiHost,
    environmentId,
  });
};
