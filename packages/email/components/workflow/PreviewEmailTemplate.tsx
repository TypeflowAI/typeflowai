import {
  Column,
  Container,
  Button as EmailButton,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import { CalendarDaysIcon } from "lucide-react";
import React from "react";

import { cn } from "@typeflowai/lib/cn";
import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { isLight } from "@typeflowai/lib/utils";
import { TWorkflow, TWorkflowQuestionType } from "@typeflowai/types/workflows";
import { RatingSmiley } from "@typeflowai/ui/RatingSmiley";

interface PreviewEmailTemplateProps {
  workflow: TWorkflow;
  workflowUrl: string;
  brandColor: string;
}

export const getPreviewEmailTemplateHtml = (workflow: TWorkflow, workflowUrl: string, brandColor: string) => {
  return render(
    <PreviewEmailTemplate workflow={workflow} workflowUrl={workflowUrl} brandColor={brandColor} />,
    {
      pretty: true,
    }
  );
};

export const PreviewEmailTemplate = ({ workflow, workflowUrl, brandColor }: PreviewEmailTemplateProps) => {
  const url = `${workflowUrl}?preview=true`;
  const urlWithPrefilling = `${workflowUrl}?preview=true&`;
  const defaultLanguageCode = "default";
  const firstQuestion = workflow.questions[0];
  switch (firstQuestion.type) {
    case TWorkflowQuestionType.OpenText:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Text className="m-0 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
          </Text>
          <Section className="mt-4 block h-20 w-full rounded-lg border border-solid border-slate-200 bg-slate-50" />
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.Consent:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 block text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Container className="m-0 text-sm font-normal leading-6 text-slate-500">
            <Text
              className="m-0 p-0"
              dangerouslySetInnerHTML={{
                __html: getLocalizedValue(firstQuestion.html, defaultLanguageCode) || "",
              }}></Text>
          </Container>

          <Container className="m-0 mt-4 block w-full max-w-none rounded-lg border border-solid border-slate-200 bg-slate-50 p-4 font-medium text-slate-800">
            <Text className="m-0 inline-block">
              {getLocalizedValue(firstQuestion.label, defaultLanguageCode)}
            </Text>
          </Container>
          <Container className="mx-0 mt-4 flex max-w-none justify-end">
            {!firstQuestion.required && (
              <EmailButton
                href={`${urlWithPrefilling}${firstQuestion.id}=dismissed`}
                className="inline-flex cursor-pointer appearance-none rounded-md px-6 py-3 text-sm font-medium text-black">
                Reject
              </EmailButton>
            )}
            <EmailButton
              href={`${urlWithPrefilling}${firstQuestion.id}=accepted`}
              className={cn(
                "bg-brand-color ml-2 inline-flex cursor-pointer appearance-none rounded-md px-6 py-3 text-sm font-medium",
                isLight(brandColor) ? "text-black" : "text-white"
              )}>
              Accept
            </EmailButton>
          </Container>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.NPS:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Section>
            <Text className="m-0 block text-base font-semibold leading-6 text-slate-800">
              {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
            </Text>
            <Text className="m-0 block p-0 text-sm font-normal leading-6 text-slate-500">
              {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
            </Text>
            <Container className="mx-0 mt-4 flex w-max flex-col">
              <Section className="block overflow-hidden rounded-md border border-slate-200">
                {Array.from({ length: 11 }, (_, i) => (
                  <EmailButton
                    key={i}
                    href={`${urlWithPrefilling}${firstQuestion.id}=${i}`}
                    className="m-0 inline-flex h-10 w-10 items-center justify-center  border-slate-200 p-0 text-slate-800">
                    {i}
                  </EmailButton>
                ))}
              </Section>
              <Section className="mt-2 px-1.5 text-xs leading-6 text-slate-500">
                <Row>
                  <Column>
                    <Text className="m-0 inline-block w-max p-0">
                      {getLocalizedValue(firstQuestion.lowerLabel, defaultLanguageCode)}
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="m-0 inline-block w-max p-0 text-right">
                      {getLocalizedValue(firstQuestion.upperLabel, defaultLanguageCode)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Container>
            <EmailFooter />
          </Section>
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.CTA:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0  block text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Container className="mt-2 text-sm font-normal leading-6 text-slate-500">
            <Text
              className="m-0 p-0"
              dangerouslySetInnerHTML={{
                __html: getLocalizedValue(firstQuestion.html, defaultLanguageCode) || "",
              }}></Text>
          </Container>

          <Container className="mx-0 mt-4 max-w-none">
            {!firstQuestion.required && (
              <EmailButton
                href={`${urlWithPrefilling}${firstQuestion.id}=dismissed`}
                className="inline-flex cursor-pointer appearance-none rounded-md px-6 py-3 text-sm font-medium text-black">
                {getLocalizedValue(firstQuestion.dismissButtonLabel, defaultLanguageCode) || "Skip"}
              </EmailButton>
            )}
            <EmailButton
              href={`${urlWithPrefilling}${firstQuestion.id}=clicked`}
              className={cn(
                "bg-brand-color inline-flex cursor-pointer appearance-none rounded-md px-6 py-3 text-sm font-medium",
                isLight(brandColor) ? "text-black" : "text-white"
              )}>
              {getLocalizedValue(firstQuestion.buttonLabel, defaultLanguageCode)}
            </EmailButton>
          </Container>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.Rating:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Section className=" w-full">
            <Text className="m-0  block text-base font-semibold leading-6 text-slate-800">
              {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
            </Text>
            <Text className="m-0 block p-0 text-sm font-normal leading-6 text-slate-500">
              {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
            </Text>
            <Container className="mx-0 mt-4 w-full items-center justify-center">
              <Section
                className={cn("w-full overflow-hidden rounded-md", {
                  ["border border-solid border-gray-200"]: firstQuestion.scale === "number",
                })}>
                <Column className="mb-4 flex w-full justify-around">
                  {Array.from({ length: firstQuestion.range }, (_, i) => (
                    <EmailButton
                      key={i}
                      href={`${urlWithPrefilling}${firstQuestion.id}=${i + 1}`}
                      className={cn(
                        " m-0 h-10 w-full p-0 text-center align-middle leading-10 text-slate-800",
                        {
                          ["border border-solid border-gray-200"]: firstQuestion.scale === "number",
                        }
                      )}>
                      {firstQuestion.scale === "smiley" && (
                        <RatingSmiley active={false} idx={i} range={firstQuestion.range} />
                      )}
                      {firstQuestion.scale === "number" && (
                        <Text className="m-0 flex h-10 items-center">{i + 1}</Text>
                      )}
                      {firstQuestion.scale === "star" && <Text className="text-3xl">⭐</Text>}
                    </EmailButton>
                  ))}
                </Column>
              </Section>
              <Section className="m-0 px-1.5 text-xs leading-6 text-slate-500">
                <Row>
                  <Column>
                    <Text className="m-0 inline-block p-0">
                      {getLocalizedValue(firstQuestion.lowerLabel, defaultLanguageCode)}
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="m-0 inline-block  p-0 text-right">
                      {getLocalizedValue(firstQuestion.upperLabel, defaultLanguageCode)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Container>
            <EmailFooter />
          </Section>
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.MultipleChoiceMulti:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Text className="m-0 mb-2 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
          </Text>
          <Container className="mx-0 max-w-none">
            {firstQuestion.choices.map((choice) => (
              <Section
                className="mt-2 block w-full rounded-lg border border-solid border-slate-200 bg-slate-50 p-4 text-slate-800"
                key={choice.id}>
                {getLocalizedValue(choice.label, defaultLanguageCode)}
              </Section>
            ))}
          </Container>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.MultipleChoiceSingle:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Text className="m-0 mb-2 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
          </Text>
          <Container className="mx-0 max-w-none">
            {firstQuestion.choices.map((choice) => (
              <Link
                key={choice.id}
                className="mt-2 block rounded-lg border border-solid border-slate-200 bg-slate-50 p-4 text-slate-800 hover:bg-slate-100"
                href={`${urlWithPrefilling}${firstQuestion.id}=${getLocalizedValue(
                  choice.label,
                  defaultLanguageCode
                )}`}>
                {getLocalizedValue(choice.label, defaultLanguageCode)}
              </Link>
            ))}
          </Container>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.PictureSelection:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Text className="m-0 mb-2 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
          </Text>
          <Section className="mx-0">
            {firstQuestion.choices.map((choice) =>
              firstQuestion.allowMulti ? (
                <Img
                  src={choice.imageUrl}
                  className="mb-1 mr-1 inline-block h-[110px] w-[220px] rounded-lg"
                />
              ) : (
                <Link
                  href={`${urlWithPrefilling}${firstQuestion.id}=${choice.id}`}
                  target="_blank"
                  className="mb-1 mr-1 inline-block h-[110px] w-[220px] rounded-lg">
                  <Img src={choice.imageUrl} className="h-full w-full rounded-lg" />
                </Link>
              )
            )}
          </Section>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.Cal:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Container>
            <Text className="m-0 mb-2 block p-0 text-sm font-normal leading-6 text-slate-500">
              {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
            </Text>
            <Text className="m-0 mb-2 block p-0 text-sm font-normal leading-6 text-slate-500">
              You have been invited to schedule a meet via cal.com.
            </Text>
            <EmailButton
              className={cn(
                "bg-brand-color mx-auto block w-max cursor-pointer appearance-none rounded-md px-6 py-3 text-sm font-medium ",
                isLight(brandColor) ? "text-black" : "text-white"
              )}>
              Schedule your meeting
            </EmailButton>
          </Container>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.Date:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Text className="m-0 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
          </Text>
          <Section className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-solid border-slate-200 bg-white">
            <CalendarDaysIcon className="mb-1 inline h-4 w-4" />
            <Text className="inline text-sm font-medium">Select a date</Text>
          </Section>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.Matrix:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, "default")}
          </Text>
          <Text className="m-0 mb-2 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, "default")}
          </Text>
          <Container className="mx-0">
            <Section className="w-full table-auto">
              <Row>
                <Column className="w-40 break-words px-4 py-2"></Column>
                {firstQuestion.columns.map((column, columnIndex) => {
                  return (
                    <Column
                      key={columnIndex}
                      className="max-w-40 break-words px-4 py-2 text-center text-gray-800">
                      {getLocalizedValue(column, "default")}
                    </Column>
                  );
                })}
              </Row>
              {firstQuestion.rows.map((row, rowIndex) => {
                return (
                  <Row key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-gray-100" : ""} rounded-custom`}>
                    <Column className="w-40 break-words px-4 py-2">
                      {getLocalizedValue(row, "default")}
                    </Column>
                    {firstQuestion.columns.map(() => {
                      return (
                        <Column className="px-4 py-2 text-gray-800">
                          <Section className="h-4 w-4 rounded-full bg-white p-2 outline"></Section>
                        </Column>
                      );
                    })}
                  </Row>
                );
              })}
            </Section>
          </Container>
          <EmailFooter />
        </EmailTemplateWrapper>
      );
    case TWorkflowQuestionType.Address:
      return (
        <EmailTemplateWrapper workflowUrl={url} brandColor={brandColor}>
          <Text className="m-0 mr-8 block p-0 text-base font-semibold leading-6 text-slate-800">
            {getLocalizedValue(firstQuestion.headline, defaultLanguageCode)}
          </Text>
          <Text className="m-0 block p-0 text-sm font-normal leading-6 text-slate-500">
            {getLocalizedValue(firstQuestion.subheader, defaultLanguageCode)}
          </Text>
          {Array.from({ length: 6 }).map((_, index) => (
            <Section
              key={index}
              className="mt-4 block h-10 w-full rounded-lg border border-solid border-slate-200 bg-slate-50"
            />
          ))}
          <EmailFooter />
        </EmailTemplateWrapper>
      );
  }
};

const EmailTemplateWrapper = ({ children, workflowUrl, brandColor }) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              "brand-color": brandColor,
            },
          },
        },
      }}>
      <Link
        href={workflowUrl}
        target="_blank"
        className="mx-0 my-2 block overflow-auto rounded-lg border border-solid border-slate-300 bg-white p-8 font-sans text-inherit">
        {children}
      </Link>
    </Tailwind>
  );
};

const EmailFooter = () => {
  return (
    <Container className="m-auto mt-8 text-center ">
      <Link href="https://typeflowai.com/" target="_blank" className="text-xs text-slate-400">
        Powered by TypeflowAI
      </Link>
    </Container>
  );
};
