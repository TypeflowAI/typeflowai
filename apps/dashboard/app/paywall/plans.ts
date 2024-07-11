export const plansAndFeatures = {
  title: "Choose the plan that works for you",
  subtitle: "",
  plans: [
    {
      lookupKey: "basic",
      planName: "Basic",
      description:
        "Maximize efficiency with 2 AI tools, 500 AI responses, and over 350 templates. Includes GPT-4 and diverse integrations. Ideal for growing teams.",
      price: 29,
      billingInterval: "month",
      features: [
        { title: "2 AI Tools", comingSoon: false, unlimited: false },
        { title: "500 AI tool responses", comingSoon: false, unlimited: false },
        { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
        { title: "GPT-3.5Turbo, GPT-4. GPT-4o...", comingSoon: false, unlimited: false },
        {
          title: "Integrations (Webhooks, Zapier, Notion, Slack, Google Sheets, Airtable)",
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
        "Advance with 2,500 AI responses, unlimited AI tools, and the power of GPT-4o. Extensive integrations for professionals seeking excellence and efficiency.",
      oldPrice: 99,
      price: 49,
      billingInterval: "month",
      features: [
        { title: "Unlimited AI Tools", comingSoon: false, unlimited: false },
        { title: "2500 AI tool responses", comingSoon: false, unlimited: false },
        { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
        { title: "GPT-3.5Turbo, GPT-4. GPT-4o...", comingSoon: false, unlimited: false },
        {
          title: "Integrations (Webhooks, Zapier, Notion, Slack, Google Sheets, Airtable)",
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
        "Total enterprise solution with unlimited flows and responses (OpenAI API key required), all templates, and GPT engines. For large teams with high demands.",
      isCustom: true,
      features: [
        { title: "Unlimited AI Tools", comingSoon: false, unlimited: false },
        {
          title: "Unlimited AI tool responses (OpenAI API key required)",
          comingSoon: false,
          unlimited: false,
        },
        { title: "+350 Templates", comingSoon: false, unlimited: false },
        { title: "All GPT Engines", comingSoon: false, unlimited: false },
        {
          title: "Integrations (Webhooks, Zapier, Notion, Slack, Google Sheets, Airtable)",
          comingSoon: false,
          unlimited: false,
        },
        { title: "Unlimited Team members", comingSoon: false, unlimited: false },
      ],
    },
  ],
};

export const basicFeatures = [
  { title: "2 AI Tools", comingSoon: false, unlimited: false },
  { title: "500 AI tool responses", comingSoon: false, unlimited: false },
  { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
  { title: "GPT-3.5Turbo, GPT-4, GPT-4o,...", comingSoon: false, unlimited: false },
  {
    title: "Integrations (Webhooks, Zapier, Notion, Slack, Google Sheets, Airtable)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Unlimited Team members", comingSoon: false, unlimited: false },
];

export const proFeatures = [
  { title: "Unlimited AI Tools", comingSoon: false, unlimited: false },
  {
    title: "2500 AI tool responses (*Unlimited responses with OpenAI API key)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Access to +350 Templates", comingSoon: false, unlimited: false },
  { title: "GPT-3.5Turbo, GPT-4, GPT-4o,...", comingSoon: false, unlimited: false },
  {
    title: "Integrations (Webhooks, Zapier, Notion, Slack, Google Sheets, Airtable)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Unlimited Team members", comingSoon: false, unlimited: false },
];

export const enterpriseFeatures = [
  { title: "Unlimited AI Tools", comingSoon: false, unlimited: false },
  {
    title: "Unlimited AI tool responses (*OpenAI API key required)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "+350 Templates", comingSoon: false, unlimited: false },
  { title: "All GPT Engines", comingSoon: false, unlimited: false },
  {
    title: "Integrations (Webhooks, Zapier, Notion, Slack, Google Sheets, Airtable)",
    comingSoon: false,
    unlimited: false,
  },
  { title: "Unlimited Team members", comingSoon: false, unlimited: false },
];
