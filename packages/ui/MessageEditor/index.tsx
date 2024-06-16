import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import { extractLanguageCodes, isLabelValidForAllLanguages } from "@typeflowai/lib/i18n/utils";
import { md } from "@typeflowai/lib/markdownIt";
import type { TI18nString, TWorkflow } from "@typeflowai/types/workflows";
import { Editor } from "../Editor";

interface MessageEditorProps {
  id: string;
  value: TI18nString | undefined;
  localWorkflow: TWorkflow;
  isInvalid: boolean;
  updateQuestion: any;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  questionIdx: number;
  firstRender: boolean;
  setFirstRender?: Dispatch<SetStateAction<boolean>>;
}

const checkIfValueIsIncomplete = (
  id: string,
  isInvalid: boolean,
  workflowLanguageCodes: string[],
  value?: TI18nString
) => {
  const labelIds = ["subheader"];
  if (value === undefined) return false;
  const isDefaultIncomplete = labelIds.includes(id) ? value.default.trim() !== "" : false;
  return isInvalid && !isLabelValidForAllLanguages(value, workflowLanguageCodes) && isDefaultIncomplete;
};

export const MessageEditor: React.FC<MessageEditorProps> = ({
  id,
  value,
  localWorkflow,
  isInvalid,
  updateQuestion,
  selectedLanguageCode,
  questionIdx,
  firstRender,
  setFirstRender,
}) => {
  const workflowLanguageCodes = useMemo(
    () => extractLanguageCodes(localWorkflow.languages),
    [localWorkflow.languages]
  );
  const isInComplete = useMemo(
    () => checkIfValueIsIncomplete(id, isInvalid, workflowLanguageCodes, value),
    [id, isInvalid, workflowLanguageCodes, value]
  );

  return (
    <div className="relative w-full">
      <Editor
        disableLists
        excludedToolbarItems={["blockType"]}
        firstRender={firstRender}
        getText={() => md.render(value ? value[selectedLanguageCode] ?? "" : "")}
        key={`${questionIdx}-${selectedLanguageCode}`}
        setFirstRender={setFirstRender}
        setText={(v: string) => {
          if (!value) return;
          const translatedHtml = {
            ...value,
            [selectedLanguageCode]: v,
          };
          if (questionIdx === -1) {
            // welcome card
            updateQuestion({ html: translatedHtml });
            return;
          }
          updateQuestion(questionIdx, { html: translatedHtml });
        }}
      />
    </div>
  );
};
