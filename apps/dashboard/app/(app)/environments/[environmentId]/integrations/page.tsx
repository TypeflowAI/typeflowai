import JsLogo from "@/images/jslogo.png";
import MakeLogo from "@/images/make-small.png";
import n8nLogo from "@/images/n8n.png";
import notionLogo from "@/images/notion.png";
import SlackLogo from "@/images/slacklogo.png";
import WebhookLogo from "@/images/webhook.png";
import ZapierLogo from "@/images/zapier-small.png";
import { getServerSession } from "next-auth";
import Image from "next/image";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWebhookCountBySource } from "@typeflowai/lib/webhook/service";
import { TIntegrationType } from "@typeflowai/types/integration";
import { Card } from "@typeflowai/ui/Card";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

import AirtableLogo from "./airtable/images/airtable.svg";
import GoogleSheetsLogo from "./google-sheets/images/google-sheets-small.png";

export default async function IntegrationsPage({ params }) {
  const environmentId = params.environmentId;

  const [
    environment,
    integrations,
    team,
    session,
    userWebhookCount,
    zapierWebhookCount,
    makeWebhookCount,
    n8nwebhookCount,
  ] = await Promise.all([
    getEnvironment(environmentId),
    getIntegrations(environmentId),
    getTeamByEnvironmentId(params.environmentId),
    getServerSession(authOptions),
    getWebhookCountBySource(environmentId, "user"),
    getWebhookCountBySource(environmentId, "zapier"),
    getWebhookCountBySource(environmentId, "make"),
    getWebhookCountBySource(environmentId, "n8n"),
  ]);

  const isIntegrationConnected = (type: TIntegrationType) =>
    integrations.some((integration) => integration.type === type);
  if (!session) {
    throw new Error("Session not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  const isGoogleSheetsIntegrationConnected = isIntegrationConnected("googleSheets");
  const isNotionIntegrationConnected = isIntegrationConnected("notion");
  const isAirtableIntegrationConnected = isIntegrationConnected("airtable");
  const isN8nIntegrationConnected = isIntegrationConnected("n8n");
  const isSlackIntegrationConnected = isIntegrationConnected("slack");

  const integrationCards = [
    {
      docsHref: "https://typeflowai.com/docs/getting-started/framework-guides#next-js",
      docsText: "Docs",
      docsNewTab: true,
      label: "Javascript Widget",
      description: "Integrate TypeflowAI into your Webapp",
      icon: <Image src={JsLogo} alt="Javascript Logo" />,
      connected: environment?.widgetSetupCompleted,
      statusText: environment?.widgetSetupCompleted ? "Connected" : "Not Connected",
    },
    {
      docsHref: "https://typeflowai.com/docs/integrations/zapier",
      docsText: "Docs",
      docsNewTab: true,
      connectHref: "https://zapier.com/apps/typeflowai/integrations",
      connectText: "Connect",
      connectNewTab: true,
      label: "Zapier",
      description: "Integrate TypeflowAI with 5000+ apps via Zapier",
      icon: <Image src={ZapierLogo} alt="Zapier Logo" />,
      connected: zapierWebhookCount > 0,
      statusText:
        zapierWebhookCount === 1
          ? "1 zap"
          : zapierWebhookCount === 0
            ? "Not Connected"
            : `${zapierWebhookCount} zaps`,
    },
    {
      connectHref: `/environments/${params.environmentId}/integrations/webhooks`,
      connectText: "Manage Webhooks",
      connectNewTab: false,
      docsHref: "https://typeflowai.com/docs/api/management/webhooks",
      docsText: "Docs",
      docsNewTab: true,
      label: "Webhooks",
      description: "Trigger Webhooks based on actions in your workflows",
      icon: <Image src={WebhookLogo} alt="Webhook Logo" />,
      connected: userWebhookCount > 0,
      statusText:
        userWebhookCount === 1
          ? "1 webhook"
          : userWebhookCount === 0
            ? "Not Connected"
            : `${userWebhookCount} webhooks`,
    },
    {
      connectHref: `/environments/${params.environmentId}/integrations/google-sheets`,
      connectText: `${isGoogleSheetsIntegrationConnected ? "Manage Sheets" : "Connect"}`,
      connectNewTab: false,
      docsHref: "https://typeflowai.com/docs/integrations/google-sheets",
      docsText: "Docs",
      docsNewTab: true,
      label: "Google Sheets",
      description: "Instantly populate your spreadsheets with workflow data",
      icon: <Image src={GoogleSheetsLogo} alt="Google sheets Logo" />,
      connected: isGoogleSheetsIntegrationConnected,
      statusText: isGoogleSheetsIntegrationConnected ? "Connected" : "Not Connected",
    },
    {
      connectHref: `/environments/${params.environmentId}/integrations/airtable`,
      connectText: `${isAirtableIntegrationConnected ? "Manage Table" : "Connect"}`,
      connectNewTab: false,
      docsHref: "https://typeflowai.com/docs/integrations/airtable",
      docsText: "Docs",
      docsNewTab: true,
      label: "Airtable",
      description: "Instantly populate your airtable table with workflow data",
      icon: <Image src={AirtableLogo} alt="Airtable Logo" />,
      connected: isAirtableIntegrationConnected,
      statusText: isAirtableIntegrationConnected ? "Connected" : "Not Connected",
    },
    {
      connectHref: `/environments/${params.environmentId}/integrations/slack`,
      connectText: `${isSlackIntegrationConnected ? "Manage" : "Connect"}`,
      connectNewTab: false,
      docsHref: "https://typeflowai.com/docs/integrations/slack",
      docsText: "Docs",
      docsNewTab: true,
      label: "Slack",
      description: "Instantly Connect your Slack Workspace with TypeflowAI",
      icon: <Image src={SlackLogo} alt="Slack Logo" />,
      connected: isSlackIntegrationConnected,
      statusText: isSlackIntegrationConnected ? "Connected" : "Not Connected",
    },
    {
      docsHref: "https://typeflowai.com/docs/integrations/n8n",
      connectText: `${isN8nIntegrationConnected ? "Manage" : "Connect"}`,
      docsText: "Docs",
      docsNewTab: true,
      connectHref: "https://n8n.io",
      connectNewTab: true,
      label: "n8n",
      description: "Integrate TypeflowAI with 350+ apps via n8n",
      icon: <Image src={n8nLogo} alt="n8n Logo" />,
      connected: n8nwebhookCount > 0,
      statusText:
        n8nwebhookCount === 1
          ? "1 integration"
          : n8nwebhookCount === 0
            ? "Not Connected"
            : `${n8nwebhookCount} integrations`,
    },
    {
      docsHref: "https://typeflowai.com/docs/integrations/make",
      docsText: "Docs",
      docsNewTab: true,
      connectHref: "https://www.make.com/en/integrations/typeflowai",
      connectText: "Connect",
      connectNewTab: true,
      label: "Make.com",
      description: "Integrate TypeflowAI with 1000+ apps via Make",
      icon: <Image src={MakeLogo} alt="Make Logo" />,
      connected: makeWebhookCount > 0,
      statusText:
        makeWebhookCount === 1
          ? "1 integration"
          : makeWebhookCount === 0
            ? "Not Connected"
            : `${makeWebhookCount} integration`,
    },
    {
      connectHref: `/environments/${params.environmentId}/integrations/notion`,
      connectText: `${isNotionIntegrationConnected ? "Manage" : "Connect"}`,
      connectNewTab: false,
      docsHref: "https://typeflowai.com/docs/integrations/notion",
      docsText: "Docs",
      docsNewTab: true,
      label: "Notion",
      description: "Send data to your Notion database",
      icon: <Image src={notionLogo} alt="Notion Logo" />,
      connected: isNotionIntegrationConnected,
      statusText: isNotionIntegrationConnected ? "Connected" : "Not Connected",
    },
  ];

  if (isViewer) return <ErrorComponent />;

  return (
    <div>
      <h1 className="my-2 text-3xl font-bold text-slate-800">Integrations</h1>
      <p className="mb-6 text-slate-500">Connect TypeflowAI with your favorite tools.</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {integrationCards.map((card) => (
          <Card
            key={card.label}
            docsHref={card.docsHref}
            docsText={card.docsText}
            docsNewTab={card.docsNewTab}
            connectHref={card.connectHref}
            connectText={card.connectText}
            connectNewTab={card.connectNewTab}
            label={card.label}
            description={card.description}
            icon={card.icon}
            connected={card.connected}
            statusText={card.statusText}
          />
        ))}
      </div>
    </div>
  );
}
