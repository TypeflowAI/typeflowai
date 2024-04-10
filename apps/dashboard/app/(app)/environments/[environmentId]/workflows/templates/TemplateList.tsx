"use client";

import { replacePresetPlaceholders } from "@/app/lib/templates";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { SplitIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import type { TEnvironment } from "@typeflowai/types/environment";
import type { TProduct } from "@typeflowai/types/product";
import { TTemplate } from "@typeflowai/types/templates";
import { TUser } from "@typeflowai/types/user";
import { TWorkflowInput } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@typeflowai/ui/Tooltip";
import diamondIcon from "@typeflowai/ui/icons/templates/diamond.svg";

import { createWorkflowAction } from "../actions";
import { adjustEngineForTemplate, adjustPromptForTemplate } from "./lib";
import { customWorkflow, templates, testTemplate } from "./templates";

type TemplateList = {
  environmentId: string;
  user: TUser;
  onTemplateClick: (template: TTemplate) => void;
  environment: TEnvironment;
  product: TProduct;
  templateSearch?: string;
  isEngineLimited: boolean;
};

const ALL_CATEGORY_NAME = "All";
const RECOMMENDED_CATEGORY_NAME = "For you";
export default function TemplateList({
  environmentId,
  user,
  onTemplateClick,
  product,
  environment,
  templateSearch,
  isEngineLimited,
}: TemplateList) {
  const router = useRouter();
  const [activeTemplate, setActiveTemplate] = useState<TTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(RECOMMENDED_CATEGORY_NAME);

  const [categories, setCategories] = useState<Array<string>>([]);

  useEffect(() => {
    const defaultCategories = [
      /* ALL_CATEGORY_NAME, */
      ...(Array.from(new Set(templates.map((template) => template.category))) as string[]),
    ];

    const fullCategories =
      !!user?.objective && user.objective !== "other"
        ? [RECOMMENDED_CATEGORY_NAME, ALL_CATEGORY_NAME, ...defaultCategories]
        : [ALL_CATEGORY_NAME, ...defaultCategories];

    setCategories(fullCategories);

    const activeFilter = templateSearch
      ? ALL_CATEGORY_NAME
      : !!user?.objective && user.objective !== "other"
        ? RECOMMENDED_CATEGORY_NAME
        : ALL_CATEGORY_NAME;
    setSelectedFilter(activeFilter);
  }, [user, templateSearch]);

  const addWorkflow = async (activeTemplate) => {
    setLoading(true);
    const engineTemplateAdjusted = adjustEngineForTemplate(activeTemplate, isEngineLimited);
    const adjustedTemplate = adjustPromptForTemplate(engineTemplateAdjusted);
    const workflowType = environment?.widgetSetupCompleted ? "web" : "link";
    const autoComplete = workflowType === "web" ? 50 : null;
    const augmentedTemplate = {
      ...adjustedTemplate.preset,
      type: workflowType,
      autoComplete,
    } as TWorkflowInput;
    const workflow = await createWorkflowAction(environmentId, augmentedTemplate);
    router.push(`/environments/${environmentId}/workflows/${workflow.id}/edit`);
  };

  // const filteredTemplates = templates.filter((template) => {
  //   const matchesCategory =
  //     selectedFilter === ALL_CATEGORY_NAME ||
  //     template.category === selectedFilter ||
  //     (user.objective &&
  //       selectedFilter === RECOMMENDED_CATEGORY_NAME &&
  //       template.objectives?.includes(user.objective));

  //   const templateName = template.name?.toLowerCase();
  //   const templateDescription = template.description?.toLowerCase();
  //   const searchQuery = templateSearch?.toLowerCase() ?? "";
  //   const searchWords = searchQuery.split(" ");

  //   const matchesSearch = searchWords.every(
  //     (word) => templateName?.includes(word) || templateDescription?.includes(word)
  //   );

  //   return matchesCategory && matchesSearch;
  // });

  const filteredAndSortedTemplates = templates
    .filter((template) => {
      const matchesCategory =
        selectedFilter === ALL_CATEGORY_NAME ||
        template.category === selectedFilter ||
        (user.objective &&
          selectedFilter === RECOMMENDED_CATEGORY_NAME &&
          template.objectives?.includes(user.objective));

      const templateName = template.name?.toLowerCase();
      const templateDescription = template.description?.toLowerCase();
      const searchQuery = templateSearch?.toLowerCase() ?? "";
      const searchWords = searchQuery.split(" ");

      const matchesSearch = searchWords.every(
        (word) => templateName?.includes(word) || templateDescription?.includes(word)
      );

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (b.isPremium && !a.isPremium) return 1;
      return 0;
    });

  return (
    <main className="relative z-0 flex-1 overflow-y-auto px-6 pb-6 pt-3 focus:outline-none">
      <div className="mb-6 flex flex-wrap gap-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedFilter(category)}
            disabled={templateSearch && templateSearch.length > 0 ? true : false}
            className={cn(
              selectedFilter === category
                ? " bg-violet-950 font-semibold text-white"
                : " bg-white text-slate-700 hover:bg-slate-100 focus:scale-105 focus:bg-slate-100 focus:outline-none focus:ring-0",
              "mt-2 rounded border border-slate-800 px-2 py-1 text-xs transition-all duration-150"
            )}>
            {category}
            {category === RECOMMENDED_CATEGORY_NAME && <SparklesIcon className="ml-1 inline h-5 w-5" />}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            const newTemplate = replacePresetPlaceholders(customWorkflow, product);
            onTemplateClick(newTemplate);
            setActiveTemplate(newTemplate);
          }}
          className={cn(
            activeTemplate?.name === customWorkflow.name
              ? "ring-brand border-transparent ring-2"
              : "hover:border-brand-dark  border-dashed border-slate-300",
            "duration-120  group relative rounded-lg border-2  bg-transparent p-6 transition-colors duration-150"
          )}>
          <PlusCircleIcon className="text-brand-dark h-8 w-8 transition-all duration-150 group-hover:scale-110" />
          <h3 className="text-md mb-1 mt-3 text-left font-bold text-slate-700 ">{customWorkflow.name}</h3>
          <p className="text-left text-xs text-slate-600 ">{customWorkflow.description}</p>
          {activeTemplate?.name === customWorkflow.name && (
            <div className="text-left">
              <Button
                variant="darkCTA"
                className="mt-6 px-6 py-3"
                disabled={activeTemplate === null}
                loading={loading}
                onClick={() => addWorkflow(activeTemplate)}>
                Create workflow
              </Button>
            </div>
          )}
        </button>
        {(process.env.NODE_ENV === "development"
          ? [...filteredAndSortedTemplates, testTemplate]
          : filteredAndSortedTemplates
        ).map((template: TTemplate) => (
          <button
            onClick={() => {
              const newTemplate = replacePresetPlaceholders(template, product);
              onTemplateClick(newTemplate);
              setActiveTemplate(newTemplate);
            }}
            key={template.name}
            className={cn(
              activeTemplate?.name === template.name && "ring-2 ring-slate-400",
              "duration-120 group relative cursor-pointer rounded-lg bg-white p-6 shadow transition-all duration-150 hover:scale-105"
            )}>
            <div className="flex flex-row">
              {template.icon && (
                <Image
                  width={48}
                  height={48}
                  src={template.icon}
                  style={{
                    objectFit: "cover",
                  }}
                  className="h-12 w-12"
                  alt="Workflow Image"
                />
              )}
              <div className="ml-4">
                <h3 className="text-md text-left font-bold text-slate-700">{template.name}</h3>
                <p className="text-left text-xs text-slate-600">{template.description}</p>
                <div className="mb-1 mt-3 flex">
                  <div
                    className={`rounded border px-1.5 py-0.5 text-xs ${
                      template.category === "Marketing"
                        ? "border-blue-300 bg-blue-50 text-blue-500"
                        : template.category === "Sales"
                          ? "border-pink-300 bg-pink-50 text-pink-500"
                          : template.category === "Startup"
                            ? "border-orange-300 bg-orange-50 text-orange-500"
                            : template.category === "Support"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-500"
                              : template.category === "Virtual Assistant"
                                ? "border-violet-300 bg-violet-50 text-violet-500"
                                : template.category === "Agency"
                                  ? "border-yellow-300 bg-yellow-50 text-yellow-500"
                                  : template.category === "Human Resources"
                                    ? "border-red-300 bg-red-50 text-red-500"
                                    : "border-slate-300 bg-slate-50 text-slate-500" // default color
                    }`}>
                    {template.category}
                  </div>

                  {template.isPremium && (
                    <div className="text-brand ml-1.5 flex rounded border border-violet-300 bg-blue-50 px-1.5 py-0.5 text-xs">
                      <Image
                        width={16}
                        height={16}
                        src={diamondIcon.src}
                        style={{
                          objectFit: "cover",
                        }}
                        className="text-brand h-4 w-4 rounded-full"
                        alt="Premium template"
                      />
                      Premium
                    </div>
                  )}

                  {template.preset.questions.some(
                    (question) => question.logic && question.logic.length > 0
                  ) && (
                    <TooltipProvider delayDuration={80}>
                      <Tooltip>
                        <TooltipTrigger tabIndex={-1}>
                          <div>
                            <SplitIcon className="ml-1.5 h-5 w-5  rounded border border-slate-300 bg-slate-50 p-0.5 text-slate-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>This workflow uses branching logic.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>

            {activeTemplate?.name === template.name && (
              <div className="flex justify-start">
                <Button
                  variant="darkCTA"
                  className="mt-6 px-6 py-3"
                  disabled={activeTemplate === null}
                  loading={loading}
                  onClick={() => addWorkflow(activeTemplate)}>
                  Use this template
                </Button>
              </div>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
