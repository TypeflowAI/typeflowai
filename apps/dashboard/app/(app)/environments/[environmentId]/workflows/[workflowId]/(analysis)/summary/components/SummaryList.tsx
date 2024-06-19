import { EmptyAppWorkflows } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/components/EmptyInAppWorkflows";
import { CTASummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/CTASummary";
import { CalSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/CalSummary";
import { ConsentSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/ConsentSummary";
import { DateQuestionSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/DateQuestionSummary";
import { FileUploadSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/FileUploadSummary";
import { HiddenFieldsSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/HiddenFieldsSummary";
import { MatrixQuestionSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/MatrixQuestionSummary";
import { MultipleChoiceSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/MultipleChoiceSummary";
import { NPSSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/NPSSummary";
import { OpenTextSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/OpenTextSummary";
import { PictureChoiceSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/PictureChoiceSummary";
import { RatingSummary } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/summary/components/RatingSummary";

import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TWorkflowSummary } from "@typeflowai/types/workflows";
import { TWorkflowQuestionTypeEnum } from "@typeflowai/types/workflows";
import { TWorkflow } from "@typeflowai/types/workflows";
import { EmptySpaceFiller } from "@typeflowai/ui/EmptySpaceFiller";
import { SkeletonLoader } from "@typeflowai/ui/SkeletonLoader";

import { AddressSummary } from "./AddressSummary";

interface SummaryListProps {
  summary: TWorkflowSummary["summary"];
  responseCount: number | null;
  environment: TEnvironment;
  workflow: TWorkflow;
  fetchingSummary: boolean;
  totalResponseCount: number;
  attributeClasses: TAttributeClass[];
}

export const SummaryList = ({
  summary,
  environment,
  responseCount,
  workflow,
  fetchingSummary,
  totalResponseCount,
  attributeClasses,
}: SummaryListProps) => {
  return (
    <div className="mt-10 space-y-8">
      {(workflow.type === "app" || workflow.type === "website") &&
      responseCount === 0 &&
      !environment.widgetSetupCompleted ? (
        <EmptyAppWorkflows environment={environment} workflowType={workflow.type} />
      ) : fetchingSummary ? (
        <SkeletonLoader type="summary" />
      ) : responseCount === 0 ? (
        <EmptySpaceFiller
          type="response"
          environment={environment}
          noWidgetRequired={workflow.type === "link"}
          emptyMessage={totalResponseCount === 0 ? undefined : "No response matches your filter"}
        />
      ) : (
        summary.map((questionSummary) => {
          if (questionSummary.type === TWorkflowQuestionTypeEnum.OpenText) {
            return (
              <OpenTextSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (
            questionSummary.type === TWorkflowQuestionTypeEnum.MultipleChoiceSingle ||
            questionSummary.type === TWorkflowQuestionTypeEnum.MultipleChoiceMulti
          ) {
            return (
              <MultipleChoiceSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                workflowType={workflow.type}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.NPS) {
            return (
              <NPSSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.CTA) {
            return (
              <CTASummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.Rating) {
            return (
              <RatingSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.Consent) {
            return (
              <ConsentSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.PictureSelection) {
            return (
              <PictureChoiceSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.Date) {
            return (
              <DateQuestionSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.FileUpload) {
            return (
              <FileUploadSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.Cal) {
            return (
              <CalSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.Matrix) {
            return (
              <MatrixQuestionSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === TWorkflowQuestionTypeEnum.Address) {
            return (
              <AddressSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                workflow={workflow}
                attributeClasses={attributeClasses}
              />
            );
          }
          if (questionSummary.type === "hiddenField") {
            return (
              <HiddenFieldsSummary
                key={questionSummary.id}
                questionSummary={questionSummary}
                environment={environment}
              />
            );
          }

          return null;
        })
      )}
    </div>
  );
};
