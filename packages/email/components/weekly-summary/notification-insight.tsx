import { Column, Container, Row, Section, Text } from "@react-email/components";
import React from "react";
import type { TWeeklySummaryInsights } from "@typeflowai/types/weeklySummary";

interface NotificationInsightProps {
  insights: TWeeklySummaryInsights;
}

export function NotificationInsight({ insights }: NotificationInsightProps) {
  return (
    <Container>
      <Section className="my-4 rounded-md bg-slate-100">
        <Row>
          <Column className="text-center">
            <Text className="text-sm">Workflows</Text>
            <Text className="text-lg font-bold">{insights.numLiveWorkflow}</Text>
          </Column>
          <Column className="text-center">
            <Text className="text-sm">Displays</Text>
            <Text className="text-lg font-bold">{insights.totalDisplays}</Text>
          </Column>
          <Column className="text-center">
            <Text className="text-sm">Responses</Text>
            <Text className="text-lg font-bold">{insights.totalResponses}</Text>
          </Column>
          <Column className="text-center">
            <Text className="text-sm">Completed</Text>
            <Text className="text-lg font-bold">{insights.totalCompletedResponses}</Text>
          </Column>
          {insights.totalDisplays !== 0 ? (
            <Column className="text-center">
              <Text className="text-sm">Completion %</Text>
              <Text className="text-lg font-bold">{Math.round(insights.completionRate)}%</Text>
            </Column>
          ) : (
            ""
          )}
        </Row>
      </Section>
    </Container>
  );
}
