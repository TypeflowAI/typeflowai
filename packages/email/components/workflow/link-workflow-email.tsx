import { Container, Heading, Text } from "@react-email/components";
import React from "react";
import { EmailButton } from "../general/email-button";
import { EmailFooter } from "../general/email-footer";

interface LinkWorkflowEmailProps {
  workflowData?:
    | {
        name?: string;
        subheading?: string;
      }
    | null
    | undefined;
  getWorkflowLink: () => string;
}

export function LinkWorkflowEmail({ workflowData, getWorkflowLink }: LinkWorkflowEmailProps) {
  return (
    <Container>
      <Heading>Hey 👋</Heading>
      <Text>Thanks for validating your email. Here is your Workflow.</Text>
      <Text className="font-bold">{workflowData?.name}</Text>
      <Text>{workflowData?.subheading}</Text>
      <EmailButton label="Take workflow" href={getWorkflowLink()} />
      <EmailFooter />
    </Container>
  );
}
