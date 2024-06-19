import { Container, Link, Tailwind, Text } from "@react-email/components";
import React from "react";
import { WEBAPP_URL } from "@typeflowai/lib/constants";

interface NotificatonFooterProps {
  environmentId: string;
}
export function NotificationFooter({ environmentId }: NotificatonFooterProps) {
  return (
    <Tailwind>
      <Container className="w-full">
        <Text className="mb-0 pt-4 font-medium">All the best,</Text>
        <Text className="mt-0">The TypeflowAI Team 🤍</Text>
        <Container
          className="mt-0 w-full rounded-md bg-slate-100 px-4 text-center text-xs leading-5"
          style={{ fontStyle: "italic" }}>
          <Text>
            To halt Weekly Updates,{" "}
            <Link
              className="text-black underline"
              href={`${WEBAPP_URL}/environments/${environmentId}/settings/notifications`}>
              please turn them off
            </Link>{" "}
            in your settings 🙏
          </Text>
        </Container>
      </Container>
    </Tailwind>
  );
}
