import {
  TIntegrationNotion,
  TIntegrationNotionConfig,
  TIntegrationNotionDatabase,
} from "@typeflowai/types/integration/notion";

import { ENCRYPTION_KEY } from "../constants";
import { symmetricDecrypt } from "../crypto";
import { getIntegrationByType } from "../integration/service";

async function fetchPages(config: TIntegrationNotionConfig) {
  try {
    const res = await fetch("https://api.notion.com/v1/search", {
      headers: getHeaders(config),
      method: "POST",
      body: JSON.stringify({
        page_size: 100,
        filter: {
          value: "database",
          property: "object",
        },
      }),
    });
    return (await res.json()).results;
  } catch (error) {
    throw error;
  }
}

export const getNotionDatabases = async (environmentId: string): Promise<TIntegrationNotionDatabase[]> => {
  let results: TIntegrationNotionDatabase[] = [];
  try {
    const notionIntegration = (await getIntegrationByType(environmentId, "notion")) as TIntegrationNotion;
    if (notionIntegration && notionIntegration.config?.key.bot_id) {
      results = await fetchPages(notionIntegration.config);
    }
    return results;
  } catch (error) {
    throw error;
  }
};

export async function writeData(
  databaseId: string,
  properties: Record<string, Object>,
  config: TIntegrationNotionConfig
) {
  try {
    await fetch(`https://api.notion.com/v1/pages`, {
      headers: getHeaders(config),
      method: "POST",
      body: JSON.stringify({
        parent: {
          database_id: databaseId,
        },
        properties: properties,
      }),
    });
  } catch (error) {
    throw error;
  }
}

function getHeaders(config: TIntegrationNotionConfig) {
  const decryptedToken = symmetricDecrypt(config.key.access_token, ENCRYPTION_KEY!);
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${decryptedToken}`,
    "Notion-Version": "2022-06-28",
  };
}
