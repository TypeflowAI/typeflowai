"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ArrowUpRight, Languages } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { extractLanguageCodes, translateWorkflow } from "@typeflowai/lib/i18n/utils";
import { TLanguage, TProduct } from "@typeflowai/types/product";
import { TWorkflow, TWorkflowLanguage, ZWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { ConfirmationModal } from "@typeflowai/ui/ConfirmationModal";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";
import { UpgradePlanNotice } from "@typeflowai/ui/UpgradePlanNotice";

import { DefaultLanguageSelect } from "./DefaultLanguageSelect";
import { SecondaryLanguageSelect } from "./SecondaryLanguageSelect";

interface MultiLanguageCardProps {
  localWorkflow: TWorkflow;
  product: TProduct;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  isMultiLanguageAllowed?: boolean;
  isTypeflowAICloud: boolean;
  setSelectedLanguageCode: (language: string) => void;
}

export interface ConfirmationModalProps {
  text: string;
  open: boolean;
  title: string;
  buttonText: string;
  buttonVariant?: "darkCTA" | "warn";
  onConfirm: () => void;
}

export const MultiLanguageCard: FC<MultiLanguageCardProps> = ({
  activeQuestionId,
  product,
  localWorkflow,
  setActiveQuestionId,
  setLocalWorkflow,
  isMultiLanguageAllowed,
  isTypeflowAICloud,
  setSelectedLanguageCode,
}) => {
  const environmentId = localWorkflow.environmentId;
  const open = activeQuestionId == "multiLanguage";
  const [isMultiLanguageActivated, setIsMultiLanguageActivated] = useState(
    localWorkflow.languages?.length > 1
  );
  const [confirmationModalInfo, setConfirmationModalInfo] = useState<ConfirmationModalProps>({
    title: "",
    open: false,
    text: "",
    buttonText: "",
    onConfirm: () => {},
  });

  const [defaultLanguage, setDefaultLanguage] = useState(
    localWorkflow.languages?.find((language) => {
      return language.default === true;
    })?.language
  );

  const setOpen = (open: boolean) => {
    if (open) {
      setActiveQuestionId("multiLanguage");
    } else {
      setActiveQuestionId(null);
    }
  };

  const updateWorkflowTranslations = (workflow: TWorkflow, updatedLanguages: TWorkflowLanguage[]) => {
    const translatedWorkflowResult = translateWorkflow(workflow, extractLanguageCodes(updatedLanguages));
    try {
      const parsedWorkflow = ZWorkflow.parse(translatedWorkflowResult);
      if (parsedWorkflow) {
        setLocalWorkflow({ ...parsedWorkflow, languages: updatedLanguages });
      }
    } catch (error) {
      toast.error("Some error occured while translating the workflow");
    }
  };

  const updateWorkflowLanguages = (language: TLanguage) => {
    let updatedLanguages = localWorkflow.languages;
    const languageIndex = localWorkflow.languages.findIndex(
      (workflowLanguage) => workflowLanguage.language.code === language.code
    );
    if (languageIndex >= 0) {
      // Toggle the 'enabled' property of the existing language
      updatedLanguages = updatedLanguages.map((workflowLanguage, index) =>
        index === languageIndex
          ? { ...workflowLanguage, enabled: !workflowLanguage.enabled }
          : workflowLanguage
      );
    } else {
      // Add the new language
      updatedLanguages = [
        ...updatedLanguages,
        {
          enabled: true,
          default: false,
          language,
        },
      ];
    }
    updateWorkflowTranslations(localWorkflow, updatedLanguages);
  };

  const updateWorkflow = (data: { languages: TWorkflowLanguage[] }) => {
    setLocalWorkflow({ ...localWorkflow, ...data });
  };

  const handleDefaultLanguageChange = (languageCode: string) => {
    const language = product.languages.find((lang) => lang.code === languageCode);
    if (language) {
      let languageExists = false;

      // Update all languages and check if the new default language already exists
      const newLanguages =
        localWorkflow.languages?.map((lang) => {
          if (lang.language.code === language.code) {
            languageExists = true;
            return { ...lang, default: true };
          } else {
            return { ...lang, default: false };
          }
        }) ?? [];

      if (!languageExists) {
        // If the language doesn't exist, add it as the default
        newLanguages.push({
          enabled: true,
          default: true,
          language,
        });
      }

      setDefaultLanguage(language);
      setConfirmationModalInfo({ ...confirmationModalInfo, open: false });
      updateWorkflow({ languages: newLanguages });
    }
  };

  const handleActivationSwitchLogic = () => {
    if (isMultiLanguageActivated) {
      if (localWorkflow.languages?.length > 0) {
        setConfirmationModalInfo({
          open: true,
          title: "Remove translations",
          text: "This action will remove all the translations from this workflow.",
          buttonText: "Remove translations",
          buttonVariant: "warn",
          onConfirm: () => {
            updateWorkflowTranslations(localWorkflow, []);
            setIsMultiLanguageActivated(false);
            setDefaultLanguage(undefined);
            setConfirmationModalInfo({ ...confirmationModalInfo, open: false });
          },
        });
      } else {
        setIsMultiLanguageActivated(false);
      }
    } else {
      setIsMultiLanguageActivated(true);
    }
  };

  return (
    <div
      className={cn(
        open ? "scale-100 shadow-lg " : "scale-97 shadow-md",
        "group z-10 flex flex-row rounded-lg bg-white text-slate-900 transition-transform duration-300 ease-in-out"
      )}>
      <div
        className={cn(
          open ? "bg-slate-50" : "bg-white group-hover:bg-slate-50",
          "flex w-10 items-center justify-center rounded-l-lg border-b border-l border-t group-aria-expanded:rounded-bl-none"
        )}>
        <p>
          <Languages className="h-6 w-6 rounded-full bg-indigo-500 p-1 text-white" />
        </p>
      </div>
      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        className="flex-1 rounded-r-lg border border-slate-200 transition-all duration-300 ease-in-out">
        <Collapsible.CollapsibleTrigger
          asChild
          className="flex cursor-pointer justify-between p-4 hover:bg-slate-50">
          <div>
            <div className="inline-flex">
              <div>
                <p className="text-sm font-semibold">Multiple Languages</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="multi-lang-toggle">{isMultiLanguageActivated ? "On" : "Off"}</Label>

              <Switch
                id="multi-lang-toggle"
                checked={isMultiLanguageActivated}
                onClick={() => {
                  handleActivationSwitchLogic();
                }}
                disabled={!isMultiLanguageAllowed || product.languages.length === 0}
              />
            </div>
          </div>
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsibleContent className="px-4 pb-6">
          <div className="space-y-4">
            {!isMultiLanguageAllowed && !isTypeflowAICloud && !isMultiLanguageActivated ? (
              <UpgradePlanNotice
                message="To enable multi-language workflows, you need an active"
                url={`/environments/${environmentId}/settings/enterprise`}
                textForUrl="enterprise license."
              />
            ) : !isMultiLanguageAllowed && isTypeflowAICloud && !isMultiLanguageActivated ? (
              <UpgradePlanNotice
                message="To enable multi-language workflows,"
                url={`/environments/${environmentId}/settings/billing`}
                textForUrl="please add your credit card."
              />
            ) : (
              <>
                {product.languages.length <= 1 && (
                  <div className="mb-4 text-sm italic text-slate-500">
                    {product.languages.length === 0
                      ? "No languages found. Add the first one to get started:"
                      : "You need to have two or more languages set up in your product to work with translations."}
                  </div>
                )}
                {product.languages.length > 1 && (
                  <div className="my-4 space-y-4">
                    <div>
                      {isMultiLanguageAllowed && !isMultiLanguageActivated && (
                        <div className="text-sm italic text-slate-500">
                          Switch multi-lanugage on to get started 👉
                        </div>
                      )}
                    </div>

                    {isMultiLanguageActivated && (
                      <div className="space-y-4">
                        <DefaultLanguageSelect
                          defaultLanguage={defaultLanguage}
                          handleDefaultLanguageChange={handleDefaultLanguageChange}
                          product={product}
                          setConfirmationModalInfo={setConfirmationModalInfo}
                        />
                        {defaultLanguage && (
                          <SecondaryLanguageSelect
                            product={product}
                            defaultLanguage={defaultLanguage}
                            localWorkflow={localWorkflow}
                            updateWorkflowLanguages={updateWorkflowLanguages}
                            setActiveQuestionId={setActiveQuestionId}
                            setSelectedLanguageCode={setSelectedLanguageCode}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Link href={`/environments/${environmentId}/settings/language`} target="_blank">
                  <Button className="mt-2" variant="secondary" size="sm">
                    Manage Languages <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}

            <ConfirmationModal
              title={confirmationModalInfo.title}
              open={confirmationModalInfo.open}
              setOpen={() => setConfirmationModalInfo((prev) => ({ ...prev, open: !prev.open }))}
              text={confirmationModalInfo.text}
              onConfirm={confirmationModalInfo.onConfirm}
              buttonText={confirmationModalInfo.buttonText}
              buttonVariant={confirmationModalInfo.buttonVariant}
            />
          </div>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
};
