import { Container, Text } from "@react-email/components";
import React from "react";
import { EmailButton } from "../general/email-button";
import { EmailFooter } from "../general/email-footer";

interface InviteEmailProps {
  inviteeName: string;
  inviterName: string;
  verifyLink: string;
}

export function InviteEmail({ inviteeName, inviterName, verifyLink }: InviteEmailProps) {
  return (
    <Container>
      <Text>Hey {inviteeName},</Text>
      <Text>
        Your colleague {inviterName} invited you to join them at TypeflowAI. To accept the invitation, please
        click the link below:
      </Text>
      <EmailButton href={verifyLink} label="Join organization" />
      <EmailFooter />
    </Container>
  );
}
