import React from "react";
import type { Dispatch, SetStateAction } from "react";
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

export const MessageEditor: React.FC<MessageEditorProps> = ({
  value,
  updateQuestion,
  selectedLanguageCode,
  questionIdx,
  firstRender,
  setFirstRender,
}) => {
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
