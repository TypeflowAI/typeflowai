"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { createI18nString, extractLanguageCodes, getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TI18nString, TWorkflow, TWorkflowMatrixQuestion } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";

import { isLabelValidForAllLanguages } from "../lib/validation";

interface MatrixQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowMatrixQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TWorkflowMatrixQuestion>) => void;
  lastQuestion: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (language: string) => void;
  isInvalid: boolean;
  attributeClasses: TAttributeClass[];
}

export const MatrixQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  isInvalid,
  localWorkflow,
  selectedLanguageCode,
  setSelectedLanguageCode,
  attributeClasses,
}: MatrixQuestionFormProps): JSX.Element => {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const languageCodes = extractLanguageCodes(localWorkflow.languages);
  // Function to add a new Label input field
  const handleAddLabel = (type: "row" | "column") => {
    if (type === "row") {
      const updatedRows = [...question.rows, createI18nString("", languageCodes)];
      updateQuestion(questionIdx, { rows: updatedRows });
    } else {
      const updatedColumns = [...question.columns, createI18nString("", languageCodes)];
      updateQuestion(questionIdx, { columns: updatedColumns });
    }
  };

  // Function to delete a label input field
  const handleDeleteLabel = (type: "row" | "column", index: number) => {
    const labels = type === "row" ? question.rows : question.columns;
    if (labels.length <= 2) return; // Prevent deleting below minimum length
    const updatedLabels = labels.filter((_, idx) => idx !== index);
    if (type === "row") {
      updateQuestion(questionIdx, { rows: updatedLabels });
    } else {
      updateQuestion(questionIdx, { columns: updatedLabels });
    }
  };

  const updateMatrixLabel = (index: number, type: "row" | "column", matrixLabel: TI18nString) => {
    const labels = type === "row" ? [...question.rows] : [...question.columns];

    // Update the label at the given index, or add a new label if index is undefined
    if (index !== undefined) {
      labels[index] = matrixLabel;
    } else {
      labels.push(matrixLabel);
    }
    if (type === "row") {
      updateQuestion(questionIdx, { rows: labels });
    } else {
      updateQuestion(questionIdx, { columns: labels });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: "row" | "column") => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLabel(type);
    }
  };

  const checkForDuplicateLabels = () => {
    const rowLabels = question.rows
      .map((row) => getLocalizedValue(row, selectedLanguageCode))
      .filter((label) => label.trim() !== "");

    const columnLabels = question.columns
      .map((column) => getLocalizedValue(column, selectedLanguageCode))
      .filter((label) => label.trim() !== "");

    const duplicateRowLabels = rowLabels.filter((label, index, array) => array.indexOf(label) !== index);
    const duplicateColumnLabels = columnLabels.filter(
      (label, index, array) => array.indexOf(label) !== index
    );

    if (duplicateRowLabels.length > 0 || duplicateColumnLabels.length > 0) {
      toast.error("Duplicate row or column labels");
    }
  };

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
          <div className="inline-flex w-full items-center">
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
            onClick={() => setShowSubheader(true)}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          {/* Rows section */}
          <Label htmlFor="rows">Rows</Label>
          <div>
            {question.rows.map((_, index) => (
              <div className="flex items-center" onKeyDown={(e) => handleKeyDown(e, "row")}>
                <QuestionFormInput
                  key={`row-${index}`}
                  id={`row-${index}`}
                  localWorkflow={localWorkflow}
                  questionIdx={questionIdx}
                  value={question.rows[index]}
                  updateMatrixLabel={updateMatrixLabel}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  onBlur={checkForDuplicateLabels}
                  isInvalid={
                    isInvalid && !isLabelValidForAllLanguages(question.rows[index], localWorkflow.languages)
                  }
                  attributeClasses={attributeClasses}
                />
                {question.rows.length > 2 && (
                  <TrashIcon
                    className="ml-2 mt-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                    onClick={() => handleDeleteLabel("row", index)}
                  />
                )}
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              StartIcon={PlusIcon}
              onClick={(e) => {
                e.preventDefault();
                handleAddLabel("row");
              }}>
              <span>Add row</span>
            </Button>
          </div>
        </div>
        <div>
          {/* Columns section */}
          <Label htmlFor="columns">Columns</Label>
          <div>
            {question.columns.map((_, index) => (
              <div className="flex items-center" onKeyDown={(e) => handleKeyDown(e, "column")}>
                <QuestionFormInput
                  key={`column-${index}`}
                  id={`column-${index}`}
                  localWorkflow={localWorkflow}
                  questionIdx={questionIdx}
                  value={question.columns[index]}
                  updateMatrixLabel={updateMatrixLabel}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  onBlur={checkForDuplicateLabels}
                  isInvalid={
                    isInvalid &&
                    !isLabelValidForAllLanguages(question.columns[index], localWorkflow.languages)
                  }
                  attributeClasses={attributeClasses}
                />
                {question.columns.length > 2 && (
                  <TrashIcon
                    className="ml-2 mt-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                    onClick={() => handleDeleteLabel("column", index)}
                  />
                )}
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              StartIcon={PlusIcon}
              onClick={(e) => {
                e.preventDefault();
                handleAddLabel("column");
              }}>
              <span>Add column</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
