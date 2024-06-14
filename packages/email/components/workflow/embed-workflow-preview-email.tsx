import { Container, Heading, Text } from "@react-email/components";
import React from "react";

interface EmbedWorkflowPreviewEmailProps {
  html: string;
  environmentId: string;
}

export function EmbedWorkflowPreviewEmail({ html, environmentId }: EmbedWorkflowPreviewEmailProps) {
  return (
    <Container>
      <Heading>Preview Email Embed</Heading>
      <Text>This is how the code snippet looks embedded into an email:</Text>
      <Text className="text-sm">
        <b>Didn&apos;t request this?</b> Help us fight spam and forward this mail to hola@typeflowai.com
      </Text>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Text className="text-center text-sm text-slate-700">Environment ID: {environmentId}</Text>
    </Container>
  );
}
