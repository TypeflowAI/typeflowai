import { TResponse } from "@typeflowai/types/responses";
import { TWorkflowQuestion } from "@typeflowai/types/workflows";

import {
  MAIL_FROM,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SECURE_ENABLED,
  SMTP_USER,
  WEBAPP_URL,
} from "../constants";
import { createInviteToken, createToken, createTokenForLinkWorkflow } from "../jwt";
import { getQuestionResponseMapping } from "../responses";
import { withEmailTemplate } from "./email-template";

const nodemailer = require("nodemailer");

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
  workflowData?: {
    name?: string;
    subheading?: string;
  } | null;
}

export const sendEmail = async (emailData: sendEmailData) => {
  try {
    if (!IS_SMTP_CONFIGURED) throw new Error("Could not Email: SMTP not configured");

    let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE_ENABLED, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
      // logger: true,
      // debug: true,
    });
    const emailDefaults = {
      from: `TypeflowAI <${MAIL_FROM || "noreply@typeflowai.com"}>`,
    };
    await transporter.sendMail({ ...emailDefaults, ...emailData });
  } catch (error) {
    throw error;
  }
};

//TODO: Remove this method since with Supabse isn't needed
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
    subject: "Welcome to TypeflowAI 🤍",
    html: withEmailTemplate(`<h1>Welcome!</h1>
    To start using TypeflowAI please verify your email by clicking the button below:<br/><br/>
    <a class="button" href="${verifyLink}">Confirm email</a><br/>
    <br/>
    <strong>The link is valid for 24h.</strong><br/><br/>If it has expired please request a new token here:
    <a href="${verificationRequestLink}">Request new verification</a><br/>
    <br/>
    Your TypeflowAI Team`),
  });
};

//TODO: Remove this method since with Supabse isn't needed
export const sendForgotPasswordEmail = async (user: TEmailUser) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${WEBAPP_URL}/auth/forgot-password/reset?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your TypeflowAI password",
    html: withEmailTemplate(`<h1>Change password</h1>
    You have requested a link to change your password. You can do this by clicking the link below:<br/><br/>
    <a class="button" href="${verifyLink}">Change password</a><br/>
    <br/>
    <strong>The link is valid for 24 hours.</strong><br/><br/>If you didn't request this, please ignore this email.<br/>
    Your TypeflowAI Team`),
  });
};

export const sendPasswordResetNotifyEmail = async (user: TEmailUser) => {
  await sendEmail({
    to: user.email,
    subject: "Your TypeflowAI password has been changed",
    html: withEmailTemplate(`<h1>Password changed</h1>
    Your password has been changed successfully.<br/>
    <br/>
    Your TypeflowAI Team`),
  });
};

//TODO: Remove this method since with Supabse isn't needed
export const sendInviteMemberEmail = async (
  inviteId: string,
  email: string,
  inviterName: string | null,
  inviteeName: string | null
) => {
  const token = createInviteToken(inviteId, email, {
    expiresIn: "7d",
  });

  const verifyLink = `${WEBAPP_URL}/invite?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: email,
    subject: `You're invited to collaborate on TypeflowAI!`,
    html: withEmailTemplate(`Hey ${inviteeName},<br/><br/>
    Your colleague ${inviterName} invited you to join them at TypeflowAI. To accept the invitation, please click the link below:<br/><br/>
    <a class="button" href="${verifyLink}">Join team</a><br/>
    <br/>
    Have a great day!<br/>
    The TypeflowAI Team!`),
  });
};

export const sendInviteAcceptedEmail = async (inviterName: string, inviteeName: string, email: string) => {
  await sendEmail({
    to: email,
    subject: `You've got a new team member!`,
    html: withEmailTemplate(`Hey ${inviterName},
    <br/><br/>
    Just letting you know that ${inviteeName} accepted your invitation. Have fun collaborating!
    <br/><br/>
    Have a great day!<br/>
    The TypeflowAI Team!`),
  });
};

export const sendResponseFinishedEmail = async (
  email: string,
  environmentId: string,
  workflow: { id: string; name: string; questions: TWorkflowQuestion[] },
  response: TResponse
) => {
  const personEmail = response.person?.attributes["email"];
  await sendEmail({
    to: email,
    subject: personEmail
      ? `${personEmail} just completed your ${workflow.name} workflow ✅`
      : `A response for ${workflow.name} was completed ✅`,
    replyTo: personEmail?.toString() || MAIL_FROM,
    html: withEmailTemplate(`<h1>Hey 👋</h1>Someone just completed your workflow <strong>${
      workflow.name
    }</strong><br/>

    <hr/>

    ${getQuestionResponseMapping(workflow, response)
      .map(
        (question) =>
          question.answer &&
          `<div style="margin-top:1em;">
          <p style="margin:0px;">${question.question}</p>
          <p style="font-weight: 500; margin:0px; white-space:pre-wrap">${question.answer}</p>  
        </div>`
      )
      .join("")}

    <a class="button" href="${WEBAPP_URL}/environments/${environmentId}/workflows/${
      workflow.id
    }/responses?utm_source=emailnotification&utm_medium=email&utm_content=ViewResponsesCTA">View all responses</a>

    <div class="tooltip">
    <p class='brandcolor'><strong>Start a conversation 💡</strong></p>
    ${
      personEmail
        ? `<p>Hit 'Reply' or reach out manually: ${personEmail}</p>`
        : "<p>If you set the email address as an attribute in in-app workflows, you can reply directly to the respondent.</p>"
    }
    </div>
    `),
  });
};

export const sendEmbedWorkflowPreviewEmail = async (to: string, subject: string, html: string) => {
  await sendEmail({
    to: to,
    subject: subject,
    html: withEmailTemplate(`
    <h1>Preview Email Embed</h1>
    <p>This is how the code snippet looks embedded into an email:</p>
    ${html}`),
  });
};

export const sendLinkWorkflowToVerifiedEmail = async (data: LinkWorkflowEmailData) => {
  const workflowId = data.workflowId;
  const email = data.email;
  const workflowData = data.workflowData;
  const token = createTokenForLinkWorkflow(workflowId, email);
  const workflowLink = `${WEBAPP_URL}/s/${workflowId}?verify=${encodeURIComponent(token)}`;
  await sendEmail({
    to: data.email,
    subject: "Your TypeflowAI Workflow",
    html: withEmailTemplate(`<h1>Hey 👋</h1>
    Thanks for validating your email. Here is your Workflow.<br/><br/>
    <strong>${workflowData?.name}</strong>
    <p>${workflowData?.subheading}</p>
    <a class="button" href="${workflowLink}">Take workflow</a><br/>
    <br/>
    All the best,<br/>
    Your TypeflowAI Team 🤍`),
  });
};
