import { Languages } from "lucide-react";
import { useRef, useState } from "react";
import { getEnabledLanguages } from "@typeflowai/lib/i18n/utils";
import { useClickOutside } from "@typeflowai/lib/utils/hooks/useClickOutside";
import { TWorkflow } from "@typeflowai/types/workflows";
// import { getLanguageLabel } from "../../../ee/multi-language/lib/iso-languages";
import { Button } from "../../Button";

interface LanguageDropdownProps {
  workflow: TWorkflow;
  setLanguage: (language: string) => void;
}

export const LanguageDropdown = ({ workflow, setLanguage }: LanguageDropdownProps) => {
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const languageDropdownRef = useRef(null);
  const enabledLanguages = getEnabledLanguages(workflow.languages ?? []);

  useClickOutside(languageDropdownRef, () => setShowLanguageSelect(false));

  return (
    enabledLanguages.length > 1 && (
      <div className="relative">
        {showLanguageSelect && (
          <div
            className="absolute top-12 z-30 w-fit rounded-lg border bg-slate-900 p-1 text-sm text-white"
            ref={languageDropdownRef}>
            {enabledLanguages.map((workflowLanguage) => (
              <div
                key={workflowLanguage.language.code}
                className="rounded-md p-2 hover:cursor-pointer hover:bg-slate-700"
                onClick={() => {
                  setLanguage(workflowLanguage.language.code);
                  setShowLanguageSelect(false);
                }}>
                {/* {getLanguageLabel(workflowLanguage.language.code)} */}
              </div>
            ))}
          </div>
        )}
        <Button
          variant="secondary"
          title="Select Language"
          aria-label="Select Language"
          onClick={() => setShowLanguageSelect(!showLanguageSelect)}>
          <Languages className="h-5 w-5" />
        </Button>
      </div>
    )
  );
};
