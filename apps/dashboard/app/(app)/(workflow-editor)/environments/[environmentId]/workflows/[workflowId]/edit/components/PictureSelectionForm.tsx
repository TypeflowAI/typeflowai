import { createId } from "@paralleldrive/cuid2";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { createI18nString, extractLanguageCodes } from "@typeflowai/lib/i18n/utils";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TWorkflow, TWorkflowPictureSelectionQuestion } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { FileInput } from "@typeflowai/ui/FileInput";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";
import { Switch } from "@typeflowai/ui/Switch";

interface PictureSelectionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowPictureSelectionQuestion;
  questionIdx: number;
  updateQuestion: (
    questionIdx: number,
    updatedAttributes: Partial<TWorkflowPictureSelectionQuestion>
  ) => void;
  lastQuestion: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (language: string) => void;
  isInvalid: boolean;
  attributeClasses: TAttributeClass[];
}

export const PictureSelectionForm = ({
  localWorkflow,
  question,
  questionIdx,
  updateQuestion,
  selectedLanguageCode,
  setSelectedLanguageCode,
  isInvalid,
  attributeClasses,
}: PictureSelectionFormProps): JSX.Element => {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const environmentId = localWorkflow.environmentId;
  const workflowLanguageCodes = extractLanguageCodes(localWorkflow.languages);

  return (
    <form>
      <QuestionFormInput
        id="headline"
        value={question.headline}
        localWorkflow={localWorkflow}
        questionIdx={questionIdx}
        isInvalid={isInvalid}
        updateQuestion={updateQuestion}
        selectedLanguageCode={selectedLanguageCode}
        setSelectedLanguageCode={setSelectedLanguageCode}
        attributeClasses={attributeClasses}
      />
      <div>
        {showSubheader && (
          <div className="mt-2 inline-flex w-full items-center">
            <div className="w-full">
              <QuestionFormInput
                id="subheader"
                value={question.subheader}
                localWorkflow={localWorkflow}
                questionIdx={questionIdx}
                isInvalid={isInvalid}
                updateQuestion={updateQuestion}
                selectedLanguageCode={selectedLanguageCode}
                setSelectedLanguageCode={setSelectedLanguageCode}
                attributeClasses={attributeClasses}
              />
            </div>

            <TrashIcon
              className="ml-2 mt-10 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
              onClick={() => {
                setShowSubheader(false);
                updateQuestion(questionIdx, { subheader: undefined });
              }}
            />
          </div>
        )}
        {!showSubheader && (
          <Button
            size="sm"
            variant="minimal"
            className="mt-3"
            type="button"
            onClick={() => {
              updateQuestion(questionIdx, {
                subheader: createI18nString("", workflowLanguageCodes),
              });
              setShowSubheader(true);
            }}>
            {" "}
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>
      <div className="mt-2">
        <Label htmlFor="Images">
          Images{" "}
          <span
            className={cn("text-slate-400", {
              "text-red-600": isInvalid && question.choices?.length < 2,
            })}>
            (Upload at least 2 images)
          </span>
        </Label>
        <div className="mt-3 flex w-full items-center justify-center">
          <FileInput
            id="choices-file-input"
            allowedFileExtensions={["png", "jpeg", "jpg"]}
            environmentId={environmentId}
            onFileUpload={(urls: string[]) => {
              updateQuestion(questionIdx, {
                choices: urls.map((url) => ({ imageUrl: url, id: createId() })),
              });
            }}
            fileUrl={question?.choices?.map((choice) => choice.imageUrl)}
            multiple={true}
          />
        </div>
      </div>

      <div className="my-4 flex items-center space-x-2">
        <Switch
          id="multi-select-toggle"
          checked={question.allowMulti}
          onClick={(e) => {
            e.stopPropagation();
            updateQuestion(questionIdx, { allowMulti: !question.allowMulti });
          }}
        />
        <Label htmlFor="multi-select-toggle" className="cursor-pointer">
          <div className="ml-2">
            <h3 className="text-sm font-semibold text-slate-700">Allow Multi Select</h3>
            <p className="text-xs font-normal text-slate-500">Allow users to select more than one image.</p>
          </div>
        </Label>
      </div>
    </form>
  );
};
