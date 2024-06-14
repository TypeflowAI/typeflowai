import { TWorkflow } from "@typeflowai/types/Workflows";
import { TAttributes } from "@typeflowai/types/attributes";
import { TJsTrackProperties } from "@typeflowai/types/js";
import { TResponseHiddenFieldValue } from "@typeflowai/types/responses";

import { Logger } from "../shared/logger";

const logger = Logger.getInstance();

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

export const handleHiddenFields = (
  hiddenFieldsConfig: TWorkflow["hiddenFields"],
  hiddenFields: TJsTrackProperties["hiddenFields"]
): TResponseHiddenFieldValue => {
  const { enabled: enabledHiddenFields, fieldIds: hiddenFieldIds } = hiddenFieldsConfig || {};

  let hiddenFieldsObject: TResponseHiddenFieldValue = {};

  if (!enabledHiddenFields) {
    logger.error("Hidden fields are not enabled for this Workflow");
  } else if (hiddenFieldIds && hiddenFields) {
    const unknownHiddenFields: string[] = [];
    hiddenFieldsObject = Object.keys(hiddenFields).reduce((acc, key) => {
      if (hiddenFieldIds?.includes(key)) {
        acc[key] = hiddenFields?.[key];
      } else {
        unknownHiddenFields.push(key);
      }
      return acc;
    }, {} as TResponseHiddenFieldValue);

    if (unknownHiddenFields.length > 0) {
      logger.error(
        `Unknown hidden fields: ${unknownHiddenFields.join(", ")}. Please add them to the Workflow hidden fields.`
      );
    }
  }

  return hiddenFieldsObject;
};
