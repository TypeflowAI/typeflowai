export const plansAndFeatures = {
  title: "Choose the plan that works for you",
  subtitle: "",
  plans: [
    {
      lookupKey: "basic",
      planName: "Basic",
      description:
        "Maximize efficiency with unlimited workflows, 500 AI responses, and over 350 templates. Includes GPT-3.5Turbo and diverse integrations. Ideal for growing teams.",
      price: 29,
      billingInterval: "month",
      features: [
        { title: "Unlimited workflows", comingSoon: false, unlimited: false },
        { title: "500 Workflow AI responses", comingSoon: false, unlimited: false },
        { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
        { title: "GPT-3.5Turbo", comingSoon: false, unlimited: false },
        {
          title: "Integrations (Webhooks, Zapier, Notion, n8n, Make, Google Sheets, Airtable)",
          comingSoon: false,
          unlimited: false,
        },
        { title: "Unlimited Team members", comingSoon: false, unlimited: false },
      ],
    },
    {
      lookupKey: "pro",
      planName: "Pro",
      description:
        "Advance with 2,500 AI responses, unlimited workflows, and the power of GPT-4. Extensive integrations for professionals seeking excellence and efficiency.",
      price: 99,
      billingInterval: "month",
      features: [
        { title: "Unlimited workflows", comingSoon: false, unlimited: false },
        { title: "2500 Workflow AI responses", comingSoon: false, unlimited: false },
        { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
        { title: "GPT-4", comingSoon: false, unlimited: false },
        {
          title: "Integrations (Webhooks, Zapier, Notion, n8n, Make, Google Sheets, Airtable)",
          comingSoon: false,
          unlimited: false,
        },
        { title: "Unlimited Team members", comingSoon: false, unlimited: false },
      ],
    },
    {
      lookupKey: "enterprise",
      planName: "Enterprise",
      description:
        "Total enterprise solution with unlimited flows and responses (OpenAI API key required), all templates, and GPT engines. For large organizations with high demands.",
      price: 499,
      billingInterval: "year",
      features: [
        { title: "Unlimited workflows", comingSoon: false, unlimited: false },
        {
          title: "Unlimited workflow responses (OpenAI API key required)",
          comingSoon: false,
          unlimited: false,
        },
        { title: "+350 Templates", comingSoon: false, unlimited: false },
        { title: "All GPT Engines", comingSoon: false, unlimited: false },
        {
          title: "Integrations (Webhooks, Zapier, Notion, n8n, Make, Google Sheets, Airtable)",
          comingSoon: false,
          unlimited: false,
        },
        { title: "Unlimited Team members", comingSoon: false, unlimited: false },
      ],
    },
  ],
};

export const basicFeatures = [
  { title: "Unlimited workflows", comingSoon: false, unlimited: false },
  { title: "500 Workflow AI responses", comingSoon: false, unlimited: false },
  { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
  { title: "GPT-3.5Turbo", comingSoon: false, unlimited: false },
  {
    title: "Integrations (Webhooks, Zapier, Notion, n8n, Make, Google Sheets, Airtable)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Unlimited Team members", comingSoon: false, unlimited: false },
];

export const proFeatures = [
  { title: "Unlimited workflows", comingSoon: false, unlimited: false },
  { title: "2500 Workflow AI responses", comingSoon: false, unlimited: false },
  { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
  { title: "GPT-4", comingSoon: false, unlimited: false },
  {
    title: "Integrations (Webhooks, Zapier, Notion, n8n, Make, Google Sheets, Airtable)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Unlimited Team members", comingSoon: false, unlimited: false },
];

export const enterpriseFeatures = [
  { title: "Unlimited workflows", comingSoon: false, unlimited: false },
  {
    title: "Unlimited workflow responses (OpenAI API key required)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "+350 Templates", comingSoon: false, unlimited: false },
  { title: "All GPT Engines", comingSoon: false, unlimited: false },
  {
    title: "Integrations (Webhooks, Zapier, Notion, n8n, Make, Google Sheets, Airtable)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Unlimited Team members", comingSoon: false, unlimited: false },
];
