import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";

import { ZString } from "@typeflowai/types/common";
import { TOpenAIRequest, ZOpenAIRequest } from "@typeflowai/types/openai";

import { OPENAI_SECRET_KEY } from "../constants";
import { getTeam } from "../team/service";
import { validateInputs } from "../utils/validate";

export async function createOpenAIMessage(teamId: string, requestData: TOpenAIRequest): Promise<any> {
  const team = await getTeam(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  const apiKey =
    team.billing.features.ai.unlimited && team.billing.features.ai.openaiApiKey
      ? team.billing.features.ai.openaiApiKey
      : OPENAI_SECRET_KEY;
  const url = "https://api.openai.com/v1/chat/completions";
  validateInputs([apiKey, ZString], [requestData, ZOpenAIRequest]);

  const body = JSON.stringify(requestData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createOpenAIStreamMessage(
  teamId: string,
  requestData: TOpenAIRequest
): Promise<Response> {
  const team = await getTeam(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  const apiKey =
    team.billing.features.ai.unlimited && team.billing.features.ai.openaiApiKey
      ? team.billing.features.ai.openaiApiKey
      : OPENAI_SECRET_KEY;

  const url = "https://api.openai.com/v1/chat/completions";
  validateInputs([apiKey, ZString], [requestData, ZOpenAIRequest]);

  const body = JSON.stringify(requestData);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === "event") {
            const data = event.data;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || "";
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // this is a prefix character (i.e., "\n\n"), do nothing
                return;
              }
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              controller.error(e);
            }
          }
        }

        const parser = createParser(onParse);
        for await (const chunk of response.body as any) {
          parser.feed(decoder.decode(chunk, { stream: true }));
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    throw error;
  }
}
