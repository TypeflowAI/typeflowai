import { TLanguage, TProduct } from "@typeflowai/types/product";
import { DefaultTag } from "@typeflowai/ui/DefaultTag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";

import { getLanguageLabel } from "../lib/isoLanguages";
import { ConfirmationModalProps } from "./MultiLanguageCard";

interface DefaultLanguageSelectProps {
  defaultLanguage?: TLanguage;
  handleDefaultLanguageChange: (languageCode: string) => void;
  product: TProduct;
  setConfirmationModalInfo: (confirmationModal: ConfirmationModalProps) => void;
}

export const DefaultLanguageSelect = ({
  defaultLanguage,
  handleDefaultLanguageChange,
  product,
  setConfirmationModalInfo,
}: DefaultLanguageSelectProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm">1. Choose the default language for this workflow:</p>
      <div className="flex items-center space-x-4">
        <div className="w-48 ">
          <Select
            value={`${defaultLanguage?.code}`}
            defaultValue={`${defaultLanguage?.code}`}
            disabled={defaultLanguage ? true : false}
            onValueChange={(languageCode) => {
              setConfirmationModalInfo({
                open: true,
                title: `Set ${getLanguageLabel(languageCode)} as default language`,
                text: `Once set, the default language for this workflow can only be changed by disabling the multi-language option and deleting all translations.`,
                buttonText: `Set ${getLanguageLabel(languageCode)} as default language`,
                onConfirm: () => handleDefaultLanguageChange(languageCode),
                buttonVariant: "darkCTA",
              });
            }}>
            <SelectTrigger className="xs:w-[180px] xs:text-base w-full px-4 text-xs text-slate-800 dark:border-slate-400 dark:bg-slate-700 dark:text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.languages.map((language) => (
                <SelectItem
                  key={language.id}
                  className="xs:text-base px-0.5 py-1 text-xs text-slate-800 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-700"
                  value={language.code}>
                  {`${getLanguageLabel(language.code)} (${language.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DefaultTag />
      </div>
    </div>
  );
};
