import { TAttributes } from "@typeflowai/types/attributes";
import { TWorkflow } from "@typeflowai/types/workflows";

export const getIsDebug = () => window.location.search.includes("typeflowaiDebug=true");

export const getLanguageCode = (workflow: TWorkflow, attributes: TAttributes): string | undefined => {
  const language = attributes.language;
  const availableLanguageCodes = workflow.languages.map((workflowLanguage) => workflowLanguage.language.code);
  if (!language) return "default";
  else {
    const selectedLanguage = workflow.languages.find((workflowLanguage) => {
      return (
        workflowLanguage.language.code === language.toLowerCase() ||
        workflowLanguage.language.alias?.toLowerCase() === language.toLowerCase()
      );
    });
    if (selectedLanguage?.default) {
      return "default";
    }
    if (
      !selectedLanguage ||
      !selectedLanguage?.enabled ||
      !availableLanguageCodes.includes(selectedLanguage.language.code)
    ) {
      return undefined;
    }
    return selectedLanguage.language.code;
  }
};

export const getDefaultLanguageCode = (workflow: TWorkflow) => {
  const defaultWorkflowLanguage = workflow.languages?.find((workflowLanguage) => {
    return workflowLanguage.default === true;
  });
  if (defaultWorkflowLanguage) return defaultWorkflowLanguage.language.code;
};
