import EmptyInAppWorkflows from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/EmptyInAppWorkflows";
import CalSummary from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/CalSummary";
import ConsentSummary from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/ConsentSummary";
import HiddenFieldsSummary from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/HiddenFieldsSummary";

import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TWorkflowQuestionType } from "@typeflowai/types/workflows";
import type {
  TWorkflowCalQuestion,
  TWorkflowDateQuestion,
  TWorkflowFileUploadQuestion,
  TWorkflowPictureSelectionQuestion,
  TWorkflowQuestionSummary,
} from "@typeflowai/types/workflows";
import {
  TWorkflow,
  TWorkflowCTAQuestion,
  TWorkflowConsentQuestion,
  TWorkflowMultipleChoiceMultiQuestion,
  TWorkflowMultipleChoiceSingleQuestion,
  TWorkflowNPSQuestion,
  TWorkflowOpenTextQuestion,
  TWorkflowQuestion,
  TWorkflowRatingQuestion,
} from "@typeflowai/types/workflows";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";

import CTASummary from "./CTASummary";
import DateQuestionSummary from "./DateQuestionSummary";
import FileUploadSummary from "./FileUploadSummary";
import MultipleChoiceSummary from "./MultipleChoiceSummary";
import NPSSummary from "./NPSSummary";
import OpenTextSummary from "./OpenTextSummary";
import PictureChoiceSummary from "./PictureChoiceSummary";
import RatingSummary from "./RatingSummary";

interface SummaryListProps {
  environment: TEnvironment;
  workflow: TWorkflow;
  responses: TResponse[];
  responsesPerPage: number;
}

export default function SummaryList({
  environment,
  workflow,
  responses,
  responsesPerPage,
}: SummaryListProps) {
  const getSummaryData = (): TWorkflowQuestionSummary<TWorkflowQuestion>[] =>
    workflow.questions.map((question) => {
      const questionResponses = responses
        .filter((response) => question.id in response.data)
        .map((r) => ({
          id: r.id,
          value: r.data[question.id],
          updatedAt: r.updatedAt,
          person: r.person,
        }));

      return {
        question,
        responses: questionResponses,
      };
    });

  return (
    <div className="mt-10 space-y-8">
      {workflow.type === "web" && responses.length === 0 && !environment.widgetSetupCompleted ? (
        <EmptyInAppWorkflows environment={environment} />
      ) : responses.length === 0 ? (
        <EmptySpaceFiller
          type="response"
          environment={environment}
          noWidgetRequired={workflow.type === "link"}
        />
      ) : (
        <>
          {getSummaryData().map((questionSummary) => {
            if (questionSummary.question.type === TWorkflowQuestionType.OpenText) {
              return (
                <OpenTextSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowOpenTextQuestion>}
                  environmentId={environment.id}
                  responsesPerPage={responsesPerPage}
                />
              );
            }
            if (
              questionSummary.question.type === TWorkflowQuestionType.MultipleChoiceSingle ||
              questionSummary.question.type === TWorkflowQuestionType.MultipleChoiceMulti
            ) {
              return (
                <MultipleChoiceSummary
                  key={questionSummary.question.id}
                  questionSummary={
                    questionSummary as TWorkflowQuestionSummary<
                      TWorkflowMultipleChoiceMultiQuestion | TWorkflowMultipleChoiceSingleQuestion
                    >
                  }
                  environmentId={environment.id}
                  workflowType={workflow.type}
                  responsesPerPage={responsesPerPage}
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.NPS) {
              return (
                <NPSSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowNPSQuestion>}
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.CTA) {
              return (
                <CTASummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowCTAQuestion>}
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.Rating) {
              return (
                <RatingSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowRatingQuestion>}
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.Consent) {
              return (
                <ConsentSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowConsentQuestion>}
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.PictureSelection) {
              return (
                <PictureChoiceSummary
                  key={questionSummary.question.id}
                  questionSummary={
                    questionSummary as TWorkflowQuestionSummary<TWorkflowPictureSelectionQuestion>
                  }
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.Date) {
              return (
                <DateQuestionSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowDateQuestion>}
                  environmentId={environment.id}
                  responsesPerPage={responsesPerPage}
                />
              );
            }
            if (questionSummary.question.type === TWorkflowQuestionType.FileUpload) {
              return (
                <FileUploadSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowFileUploadQuestion>}
                  environmentId={environment.id}
                />
              );
            }

            if (questionSummary.question.type === TWorkflowQuestionType.Cal) {
              return (
                <CalSummary
                  key={questionSummary.question.id}
                  questionSummary={questionSummary as TWorkflowQuestionSummary<TWorkflowCalQuestion>}
                  environmentId={environment.id}
                />
              );
            }

            return null;
          })}

          {workflow.hiddenFields?.enabled &&
            workflow.hiddenFields.fieldIds?.map((question) => {
              return (
                <HiddenFieldsSummary
                  environment={environment}
                  question={question}
                  responses={responses}
                  workflow={workflow}
                  key={question}
                />
              );
            })}
        </>
      )}
    </div>
  );
}
