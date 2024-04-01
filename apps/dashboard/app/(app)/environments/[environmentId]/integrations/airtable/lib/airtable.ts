import { TIntegrationAirtableTables } from "@typeflowai/types/integration/airtable";

export const fetchTables = async (environmentId: string, baseId: string) => {
  const res = await fetch(`/api/v1/integrations/airtable/tables?baseId=${baseId}`, {
    method: "GET",
    headers: { environmentId: environmentId },
    cache: "no-store",
  });
  const resJson = await res.json();
  return resJson.data as Promise<TIntegrationAirtableTables>;
};

export const authorize = async (environmentId: string, apiHost: string): Promise<string> => {
  const res = await fetch(`${apiHost}/api/v1/integrations/airtable`, {
    method: "GET",
    headers: { environmentId: environmentId },
  });

  if (!res.ok) {
    console.error(res.text);
    throw new Error("Could not create response");
  }
  const resJSON = await res.json();
  const authUrl = resJSON.data.authUrl;
  return authUrl;
};
