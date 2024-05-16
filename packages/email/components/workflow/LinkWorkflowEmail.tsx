import { Container, Heading, Text } from "@react-email/components";
import React from "react";

import { EmailButton } from "../general/EmailButton";
import { EmailFooter } from "../general/EmailFooter";

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

export const LinkWorkflowEmail = ({ workflowData, getWorkflowLink }: LinkWorkflowEmailProps) => {
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
};
