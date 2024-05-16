import DOMPurify from "dompurify";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";

import { extractLanguageCodes, isLabelValidForAllLanguages } from "@typeflowai/lib/i18n/utils";
import { md } from "@typeflowai/lib/markdownIt";
import { recallToHeadline } from "@typeflowai/lib/utils/recall";
import { TI18nString, TWorkflow } from "@typeflowai/types/workflows";
import { Editor } from "@typeflowai/ui/Editor";

import { LanguageIndicator } from "./LanguageIndicator";

interface LocalizedEditorProps {
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
  const isDefaultIncomplete = labelIds.includes(id) ? value["default"]?.trim() !== "" : false;
  return isInvalid && !isLabelValidForAllLanguages(value, workflowLanguageCodes) && isDefaultIncomplete;
};

export const LocalizedEditor = ({
  id,
  value,
  localWorkflow,
  isInvalid,
  updateQuestion,
  selectedLanguageCode,
  setSelectedLanguageCode,
  questionIdx,
  firstRender,
  setFirstRender,
}: LocalizedEditorProps) => {
  const workflowLanguageCodes = useMemo(
    () => extractLanguageCodes(localWorkflow.languages),
    [localWorkflow.languages]
  );
  const isInComplete = useMemo(
    () => checkIfValueIsIncomplete(id, isInvalid, workflowLanguageCodes, value),
    [id, isInvalid, workflowLanguageCodes, value, selectedLanguageCode]
  );

  return (
    <div className="relative w-full">
      <Editor
        key={`${questionIdx}-${selectedLanguageCode}`}
        getText={() => md.render(value ? value[selectedLanguageCode] ?? "" : "")}
        setText={(v: string) => {
          if (!value) return;
          let translatedHtml = {
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
        excludedToolbarItems={["blockType"]}
        disableLists
        firstRender={firstRender}
        setFirstRender={setFirstRender}
      />
      {localWorkflow.languages?.length > 1 && (
        <div>
          <LanguageIndicator
            selectedLanguageCode={selectedLanguageCode}
            workflowLanguages={localWorkflow.languages}
            setSelectedLanguageCode={setSelectedLanguageCode}
            setFirstRender={setFirstRender}
          />

          {value && selectedLanguageCode !== "default" && value["default"] && (
            <div className="mt-1 flex text-xs text-gray-500">
              <strong>Translate:</strong>
              <label
                className="fb-htmlbody ml-1" // styles are in global.css
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    recallToHeadline(value, localWorkflow, false, "default")["default"] ?? ""
                  ),
                }}></label>
            </div>
          )}
        </div>
      )}

      {isInComplete && <div className="mt-1 text-xs text-red-400">Contains Incomplete translations</div>}
    </div>
  );
};
