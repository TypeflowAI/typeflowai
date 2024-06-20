import { TOpenAIRequest } from "@typeflowai/types/openai";

// import { makeRequest } from "../../utils/makeRequest";

// import { makeStreamingRequest } from "../../utils/makeStreamingRequest";

export class OpenAiAPI {
  private apiHost: string;
  private environmentId: string;

  constructor(apiHost: string, environmentId: string) {
    this.apiHost = apiHost;
    this.environmentId = environmentId;
  }
  async sendMessage(openAIRequest: TOpenAIRequest) {
    // return makeRequest(this.apiHost, `/api/v1/client/${this.environmentId}/openai`, "POST", {
    //   environmentId: this.environmentId,
    //   openAIRequest,
    // });
    const response = await fetch(`${this.apiHost}/api/openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ environmentId: this.environmentId, openAIRequest: openAIRequest }),
    });

    if (!response.ok) {
      throw new Error(`Error with OpenAI API: ${response.status}`);
    }

    return response;
  }

  async sendStreamingMessage(openAIRequest: TOpenAIRequest) {
    const response = await fetch(`${this.apiHost}/api/openai/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ environmentId: this.environmentId, openAIRequest: openAIRequest }),
    });

    if (!response.ok) {
      throw new Error(`Error with OpenAI API: ${response.status}`);
    }

    return response;
  }
}
