import "server-only";

import { env } from "./env.mjs";

export const IS_TYPEFLOWAI_CLOUD = env.IS_TYPEFLOWAI_CLOUD === "1";
export const REVALIDATION_INTERVAL = 0; //TODO: find a good way to cache and revalidate data when it changes
export const SERVICES_REVALIDATION_INTERVAL = 60 * 30; // 30 minutes
export const MAU_LIMIT = IS_TYPEFLOWAI_CLOUD ? 9000 : 1000000;

// URLs
export const WEBAPP_URL =
  env.WEBAPP_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : false) || "http://localhost:3000";

export const SHORT_URL_BASE = env.SHORT_URL_BASE ? env.SHORT_URL_BASE : WEBAPP_URL;

// encryption keys
export const TYPEFLOWAI_ENCRYPTION_KEY = env.TYPEFLOWAI_ENCRYPTION_KEY || undefined;
export const ENCRYPTION_KEY = env.ENCRYPTION_KEY;

// Supabase
export const NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// OpenAI
export const OPENAI_SECRET_KEY = env.OPENAI_SECRET_KEY;

// Other
export const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";
export const CRON_SECRET = env.CRON_SECRET;
export const DEFAULT_BRAND_COLOR = "#64748b";

export const PRIVACY_URL = env.PRIVACY_URL;
export const TERMS_URL = env.TERMS_URL;
export const IMPRINT_URL = env.IMPRINT_URL;

export const PASSWORD_RESET_DISABLED = env.PASSWORD_RESET_DISABLED === "1";
export const EMAIL_VERIFICATION_DISABLED = env.EMAIL_VERIFICATION_DISABLED === "1";
export const GOOGLE_OAUTH_ENABLED = env.GOOGLE_AUTH_ENABLED === "1";
export const GITHUB_OAUTH_ENABLED = env.GITHUB_AUTH_ENABLED === "1";
export const AZURE_OAUTH_ENABLED = env.AZUREAD_AUTH_ENABLED === "1";

export const GITHUB_ID = env.GITHUB_ID;
export const GITHUB_SECRET = env.GITHUB_SECRET;
export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

export const SIGNUP_ENABLED = env.SIGNUP_DISABLED !== "1";
export const INVITE_DISABLED = env.INVITE_DISABLED === "1";

export const GOOGLE_SHEETS_CLIENT_ID = env.GOOGLE_SHEETS_CLIENT_ID;
export const GOOGLE_SHEETS_CLIENT_SECRET = env.GOOGLE_SHEETS_CLIENT_SECRET;
export const GOOGLE_SHEETS_REDIRECT_URL = env.GOOGLE_SHEETS_REDIRECT_URL;

export const NOTION_OAUTH_CLIENT_ID = env.NOTION_OAUTH_CLIENT_ID;
export const NOTION_OAUTH_CLIENT_SECRET = env.NOTION_OAUTH_CLIENT_SECRET;
export const NOTION_REDIRECT_URI = `${WEBAPP_URL}/api/v1/integrations/notion/callback`;
export const NOTION_AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${env.NOTION_OAUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${NOTION_REDIRECT_URI}`;

export const AIRTABLE_CLIENT_ID = env.AIRTABLE_CLIENT_ID;

export const SMTP_HOST = env.SMTP_HOST;
export const SMTP_PORT = env.SMTP_PORT;
export const SMTP_SECURE_ENABLED = env.SMTP_SECURE_ENABLED === "1";
export const SMTP_USER = env.SMTP_USER;
export const SMTP_PASSWORD = env.SMTP_PASSWORD;
export const MAIL_FROM = env.MAIL_FROM;

export const NEXTAUTH_SECRET = env.NEXTAUTH_SECRET;
export const NEXTAUTH_URL = env.NEXTAUTH_URL;
export const ITEMS_PER_PAGE = 50;
export const RESPONSES_PER_PAGE = 10;
export const TEXT_RESPONSES_PER_PAGE = 5;

export const DEFAULT_TEAM_ID = env.DEFAULT_TEAM_ID;
export const DEFAULT_TEAM_ROLE = env.DEFAULT_TEAM_ROLE || "";
export const ONBOARDING_DISABLED = env.ONBOARDING_DISABLED;

// Storage constants
export const UPLOADS_DIR = "./uploads";
export const MAX_SIZES = {
  public: 1024 * 1024 * 10, // 10MB
  free: 1024 * 1024 * 10, // 10MB
  paid: 1024 * 1024 * 1024, // 1GB
} as const;
export const IS_S3_CONFIGURED: boolean =
  env.S3_ACCESS_KEY && env.S3_SECRET_KEY && env.S3_REGION && env.S3_BUCKET_NAME ? true : false;

// Pricing
export const PRICING_USERTARGETING_FREE_MTU = 2500;
export const PRICING_APPWORKFLOWS_FREE_RESPONSES = 250;
export const BASIC_AI_RESPONSES = 500;
export const PRO_AI_RESPONSES = 2500;

// Colors for Workflow Bg
export const colours = [
  "#FFF2D8",
  "#EAD7BB",
  "#BCA37F",
  "#113946",
  "#04364A",
  "#176B87",
  "#64CCC5",
  "#DAFFFB",
  "#132043",
  "#1F4172",
  "#F1B4BB",
  "#FDF0F0",
  "#001524",
  "#445D48",
  "#D6CC99",
  "#FDE5D4",
  "#BEADFA",
  "#D0BFFF",
  "#DFCCFB",
  "#FFF8C9",
  "#FF8080",
  "#FFCF96",
  "#F6FDC3",
  "#CDFAD5",
];

// Rate Limiting
export const SIGNUP_RATE_LIMIT = {
  interval: 60 * 60 * 1000, // 60 minutes
  allowedPerInterval: 30,
};
export const LOGIN_RATE_LIMIT = {
  interval: 15 * 60 * 1000, // 15 minutes
  allowedPerInterval: 30,
};
export const CLIENT_SIDE_API_RATE_LIMIT = {
  interval: 10 * 15 * 1000, // 15 minutes
  allowedPerInterval: 60,
};
export const SHARE_RATE_LIMIT = {
  interval: 60 * 60 * 1000, // 60 minutes
  allowedPerInterval: 30,
};
