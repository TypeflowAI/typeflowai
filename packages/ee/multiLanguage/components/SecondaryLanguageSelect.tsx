import { TLanguage, TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

import { LanguageToggle } from "./LanguageToggle";

interface secondaryLanguageSelectProps {
  product: TProduct;
  defaultLanguage: TLanguage;
  setSelectedLanguageCode: (languageCode: string) => void;
  setActiveQuestionId: (questionId: string) => void;
  localWorkflow: TWorkflow;
  updateWorkflowLanguages: (language: TLanguage) => void;
}

export const SecondaryLanguageSelect = ({
  product,
  defaultLanguage,
  setSelectedLanguageCode,
  setActiveQuestionId,
  localWorkflow,
  updateWorkflowLanguages,
}: secondaryLanguageSelectProps) => {
  const isLanguageToggled = (language: TLanguage) => {
    return localWorkflow.languages.some(
      (workflowLanguage) => workflowLanguage.language.code === language.code && workflowLanguage.enabled
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">2. Activate translation for specific languages:</p>
      {product.languages
        .filter((lang) => lang.id !== defaultLanguage.id)
        .map((language) => (
          <LanguageToggle
            key={language.id}
            language={language}
            isChecked={isLanguageToggled(language)}
            onToggle={() => updateWorkflowLanguages(language)}
            onEdit={() => {
              setSelectedLanguageCode(language.code);
              setActiveQuestionId(localWorkflow.questions[0]?.id);
            }}
          />
        ))}
    </div>
  );
};
