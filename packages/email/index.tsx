import { render } from "@react-email/render";
import nodemailer from "nodemailer";

import {
  DEBUG,
  MAIL_FROM,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SECURE_ENABLED,
  SMTP_USER,
  WEBAPP_URL,
} from "@typeflowai/lib/constants";
import { createInviteToken, createToken, createTokenForLinkWorkflow } from "@typeflowai/lib/jwt";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { TResponse } from "@typeflowai/types/responses";
import { TWeeklySummaryNotificationResponse } from "@typeflowai/types/weeklySummary";
import { TWorkflow } from "@typeflowai/types/workflows";

import { ForgotPasswordEmail } from "./components/auth/ForgotPasswordEmail";
import { PasswordResetNotifyEmail } from "./components/auth/PasswordResetNotifyEmail";
import { VerificationEmail } from "./components/auth/VerificationEmail";
import { EmailTemplate } from "./components/general/EmailTemplate";
import { InviteAcceptedEmail } from "./components/invite/InviteAcceptedEmail";
import { InviteEmail } from "./components/invite/InviteEmail";
import { OnboardingInviteEmail } from "./components/invite/OnboardingInviteEmail";
import { NoLiveWorkflowNotificationEmail } from "./components/weekly-summary/NoLiveWorkflowNotificationEmail";
import { WeeklySummaryNotificationEmail } from "./components/weekly-summary/WeeklySummaryNotificationEmail";
import { EmbedWorkflowPreviewEmail } from "./components/workflow/EmbedWorkflowPreviewEmail";
import { LinkWorkflowEmail } from "./components/workflow/LinkWorkflowEmail";
import { ResponseFinishedEmail } from "./components/workflow/ResponseFinishedEmail";

export const IS_SMTP_CONFIGURED: boolean =
  SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD ? true : false;

interface sendEmailData {
  to: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html: string;
}

interface TEmailUser {
  id: string;
  email: string;
}

export interface LinkWorkflowEmailData {
  workflowId: string;
  email: string;
  suId: string;
  workflowData?:
    | {
        name?: string;
        subheading?: string;
      }
    | null
    | undefined;
}

const getEmailSubject = (productName: string): string => {
  return `${productName} User Insights - Last Week by TypeflowAI`;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const sendEmail = async (emailData: sendEmailData) => {
  try {
    if (IS_SMTP_CONFIGURED) {
      let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE_ENABLED, // true for 465, false for other ports
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
        logger: DEBUG,
        debug: DEBUG,
      });
      const emailDefaults = {
        from: `TypeflowAI <${MAIL_FROM || "noreply@typeflowai.com"}>`,
      };
      await transporter.sendMail({ ...emailDefaults, ...emailData });
    } else {
      console.error(`Could not Email :: SMTP not configured :: ${emailData.subject}`);
    }
  } catch (error) {
    throw error;
  }
};

export const sendVerificationEmail = async (user: TEmailUser) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${WEBAPP_URL}/auth/verify?token=${encodeURIComponent(token)}`;
  const verificationRequestLink = `${WEBAPP_URL}/auth/verification-requested?email=${encodeURIComponent(
    user.email
  )}`;
  await sendEmail({
    to: user.email,
    subject: "Please verify your email to use TypeflowAI",
    html: render(EmailTemplate({ content: VerificationEmail({ verificationRequestLink, verifyLink }) })),
  });
};

export const sendForgotPasswordEmail = async (user: TEmailUser) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${WEBAPP_URL}/auth/forgot-password/reset?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your TypeflowAI password",
    html: render(EmailTemplate({ content: ForgotPasswordEmail({ verifyLink }) })),
  });
};

export const sendPasswordResetNotifyEmail = async (user: TEmailUser) => {
  await sendEmail({
    to: user.email,
    subject: "Your TypeflowAI password has been changed",
    html: render(EmailTemplate({ content: PasswordResetNotifyEmail() })),
  });
};

export const sendInviteMemberEmail = async (
  inviteId: string,
  email: string,
  inviterName: string,
  inviteeName: string,
  isOnboardingInvite?: boolean,
  inviteMessage?: string
) => {
  const token = createInviteToken(inviteId, email, {
    expiresIn: "7d",
  });

  const verifyLink = `${WEBAPP_URL}/invite?token=${encodeURIComponent(token)}`;

  if (isOnboardingInvite && inviteMessage) {
    await sendEmail({
      to: email,
      subject: `${inviterName} needs a hand setting up TypeflowAI.  Can you help out?`,
      html: render(
        EmailTemplate({ content: OnboardingInviteEmail({ verifyLink, inviteMessage, inviterName }) })
      ),
    });
  } else {
    await sendEmail({
      to: email,
      subject: `You're invited to collaborate on TypeflowAI!`,
      html: render(EmailTemplate({ content: InviteEmail({ inviteeName, inviterName, verifyLink }) })),
    });
  }
};

export const sendInviteAcceptedEmail = async (inviterName: string, inviteeName: string, email: string) => {
  await sendEmail({
    to: email,
    subject: `You've got a new team member!`,
    html: render(EmailTemplate({ content: InviteAcceptedEmail({ inviteeName, inviterName }) })),
  });
};

export const sendResponseFinishedEmail = async (
  email: string,
  environmentId: string,
  workflow: TWorkflow,
  response: TResponse,
  responseCount: number
) => {
  const personEmail = response.personAttributes?.email;
  const team = await getTeamByEnvironmentId(environmentId);

  await sendEmail({
    to: email,
    subject: personEmail
      ? `${personEmail} just completed your ${workflow.name} workflow ✅`
      : `A response for ${workflow.name} was completed ✅`,
    replyTo: personEmail?.toString() || MAIL_FROM,
    html: render(
      EmailTemplate({
        content: ResponseFinishedEmail({
          workflow,
          responseCount,
          response,
          WEBAPP_URL,
          environmentId,
          team,
        }),
      })
    ),
  });
};

export const sendEmbedWorkflowPreviewEmail = async (
  to: string,
  subject: string,
  html: string,
  environmentId: string
) => {
  await sendEmail({
    to: to,
    subject: subject,
    html: render(EmailTemplate({ content: EmbedWorkflowPreviewEmail({ html, environmentId }) })),
  });
};

export const sendLinkWorkflowToVerifiedEmail = async (data: LinkWorkflowEmailData) => {
  const workflowId = data.workflowId;
  const email = data.email;
  const workflowData = data.workflowData;
  const singleUseId = data.suId ?? null;
  const token = createTokenForLinkWorkflow(workflowId, email);
  const getWorkflowLink = () => {
    if (singleUseId) {
      return `${WEBAPP_URL}/s/${workflowId}?verify=${encodeURIComponent(token)}&suId=${singleUseId}`;
    }
    return `${WEBAPP_URL}/s/${workflowId}?verify=${encodeURIComponent(token)}`;
  };
  await sendEmail({
    to: data.email,
    subject: "Your TypeflowAI Workflow",
    html: render(EmailTemplate({ content: LinkWorkflowEmail({ workflowData, getWorkflowLink }) })),
  });
};

export const sendWeeklySummaryNotificationEmail = async (
  email: string,
  notificationData: TWeeklySummaryNotificationResponse
) => {
  const startDate = `${notificationData.lastWeekDate.getDate()} ${
    monthNames[notificationData.lastWeekDate.getMonth()]
  }`;
  const endDate = `${notificationData.currentDate.getDate()} ${
    monthNames[notificationData.currentDate.getMonth()]
  }`;
  const startYear = notificationData.lastWeekDate.getFullYear();
  const endYear = notificationData.currentDate.getFullYear();
  await sendEmail({
    to: email,
    subject: getEmailSubject(notificationData.productName),
    html: render(
      EmailTemplate({
        content: WeeklySummaryNotificationEmail({
          notificationData,
          startDate,
          endDate,
          startYear,
          endYear,
        }),
      })
    ),
  });
};

export const sendNoLiveWorkflowNotificationEmail = async (
  email: string,
  notificationData: TWeeklySummaryNotificationResponse
) => {
  const startDate = `${notificationData.lastWeekDate.getDate()} ${
    monthNames[notificationData.lastWeekDate.getMonth()]
  }`;
  const endDate = `${notificationData.currentDate.getDate()} ${
    monthNames[notificationData.currentDate.getMonth()]
  }`;
  const startYear = notificationData.lastWeekDate.getFullYear();
  const endYear = notificationData.currentDate.getFullYear();
  await sendEmail({
    to: email,
    subject: getEmailSubject(notificationData.productName),
    html: render(
      EmailTemplate({
        content: NoLiveWorkflowNotificationEmail({
          notificationData,
          startDate,
          endDate,
          startYear,
          endYear,
        }),
      })
    ),
  });
};
