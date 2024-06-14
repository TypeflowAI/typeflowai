import { Container, Heading, Text } from "@react-email/components";
import React from "react";
import { EmailButton } from "../general/email-button";
import { EmailFooter } from "../general/email-footer";

interface OnboardingInviteEmailProps {
  inviteMessage: string;
  inviterName: string;
  verifyLink: string;
}

export function OnboardingInviteEmail({
  inviteMessage,
  inviterName,
  verifyLink,
}: OnboardingInviteEmailProps) {
  return (
    <Container>
      <Heading>Hey 👋</Heading>
      <Text>{inviteMessage}</Text>
      <Text className="text-xl font-medium">Get Started in Minutes</Text>
      <ol>
        <li>Create an account to join {inviterName}&apos;s organization.</li>
        <li>Connect TypeflowAI to your app or website via HTML Snippet or NPM in just a few minutes.</li>
        <li>Done ✅</li>
      </ol>
      <EmailButton href={verifyLink} label={`Join ${inviterName}'s organization`} />
      <EmailFooter />
    </Container>
  );
}
