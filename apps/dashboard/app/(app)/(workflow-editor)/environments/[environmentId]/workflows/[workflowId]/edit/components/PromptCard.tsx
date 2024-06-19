"use client";

import openAIIcon from "@/images/openai-icon.svg";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PromptEditor from "@typeflowai/ee/prompt-editor/components/prompt-editor";
import { cn } from "@typeflowai/lib/cn";
import { OpenAIModel } from "@typeflowai/types/openai";
import {
  promptActAs,
  promptFormatting,
  promptLanguage,
  promptLength,
  promptOutputAs,
  promptReaderComprehension,
  promptStyle,
  promptTone,
} from "@typeflowai/types/prompt";
import { TWorkflow, TWorkflowPrompt } from "@typeflowai/types/workflows";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";
import { Switch } from "@typeflowai/ui/Switch";

const engineOptions = {
  "GPT-3.5 Turbo": OpenAIModel.GPT35Turbo,
  "GPT-4 (Slowest, Most Capable)": OpenAIModel.GPT4,
  "GPT-4 Turbo (Longer Responses)": OpenAIModel.GPT4Turbo,
  "GPT-4o (Most Capable GPT-4 Model)": OpenAIModel.GPT4o,
};

const engineOptionsLimited = {
  "GPT-3.5 Turbo": OpenAIModel.GPT35Turbo,
};

const getEngineValueForKey = (displayKey) => {
  return engineOptions[displayKey];
};

interface PromptCardProps {
  localWorkflow: TWorkflow;
  prompt: TWorkflowPrompt;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  isEngineLimited: boolean;
}

export default function PromtCard({
  localWorkflow,
  setLocalWorkflow,
  prompt,
  activeQuestionId,
  setActiveQuestionId,
  isEngineLimited,
}: PromptCardProps) {
  const open = activeQuestionId === "prompt";
  const [isPromptEditorFocused, setIsPromptEditorFocused] = useState(false);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const questionIds = localWorkflow.questions.map((question) => question.id);
  const filteredEngineOptions = isEngineLimited ? engineOptionsLimited : engineOptions;

  const handleEngineChange = (engineDisplayValue) => {
    const engineValue = getEngineValueForKey(engineDisplayValue);
    updateWorkflow({ engine: engineValue });
  };

  const handlePromptEditorFocusChange = (focused: boolean) => {
    setIsPromptEditorFocused(focused);
  };

  const updateWorkflow = (updatedData) => {
    setLocalWorkflow({
      ...localWorkflow,
      prompt: {
        ...localWorkflow.prompt,
        ...updatedData,
      },
    });
  };

  const handleAttributeChange = (key, value) => {
    const newAttributes = { ...localWorkflow.prompt.attributes };
    if (value === "unselected") {
      delete newAttributes[key];
    } else {
      newAttributes[key] = value;
    }

    updateWorkflow({
      attributes: newAttributes,
    });
  };

  return (
    <div
      className={cn(
        open ? "scale-100 shadow-lg " : "scale-97 shadow-md",
        "flex flex-row rounded-lg bg-white transition-transform duration-300 ease-in-out"
      )}>
      <div
        className={cn(
          open ? "bg-violet-950" : "bg-violet-950",
          "flex w-10 items-center justify-center rounded-l-lg hover:bg-slate-600 group-aria-expanded:rounded-bl-none"
        )}>
        <Image src={openAIIcon} className="h-6 w-6 text-white" alt="GPT Logo" />
      </div>
      <Collapsible.Root
        open={open}
        onOpenChange={() => {
          if (activeQuestionId !== "prompt") {
            setActiveQuestionId("prompt");
          } else {
            setActiveQuestionId(null);
          }
        }}
        className="flex-1 rounded-r-lg border border-slate-200 transition-all duration-300 ease-in-out">
        <Collapsible.CollapsibleTrigger
          asChild
          className="flex cursor-pointer justify-between p-4 hover:bg-slate-50">
          <div>
            <div className="inline-flex">
              <div>
                <p className="font-semibold">GPT Prompt</p>
                <p className="mt-1 text-sm text-slate-500">
                  Write your prompt using your questions variables
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="welcome-toggle">Enabled</Label>

              <Switch
                id="welcome-toggle"
                checked={localWorkflow?.prompt?.enabled}
                onClick={(e) => {
                  e.stopPropagation();
                  updateWorkflow({ enabled: !localWorkflow.prompt?.enabled });
                }}
              />
            </div>
          </div>
        </Collapsible.CollapsibleTrigger>
        <Collapsible.CollapsibleContent className="px-4 pb-6">
          <form>
            <div className="mt-3">
              <Label htmlFor="description">Description</Label>
              <div className="mt-2 inline-flex w-full items-center">
                <Input
                  id="description"
                  name="description"
                  value={prompt.description}
                  onChange={(e) => updateWorkflow({ description: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="prompttext">Prompt Message</Label>
              <div
                className={`relative mt-2 block w-full rounded-md border bg-transparent p-2 text-slate-800 placeholder:text-slate-400 sm:text-sm  ${
                  isPromptEditorFocused
                    ? "border-brand ring-brand outline-none ring-0 ring-offset-0"
                    : "border-slate-300"
                }`}>
                <PromptEditor
                  promptMessage={prompt.message}
                  onContentChange={(content) => updateWorkflow({ message: content })}
                  onFocusChange={handlePromptEditorFocusChange}
                  questionIds={questionIds}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="engine">AI Engine</Label>
              <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                <Select
                  defaultValue={Object.keys(filteredEngineOptions).find(
                    (key) => filteredEngineOptions[key] === prompt.engine
                  )}
                  value={Object.keys(filteredEngineOptions).find(
                    (key) => filteredEngineOptions[key] === prompt.engine
                  )}
                  onValueChange={handleEngineChange}>
                  <SelectTrigger className="min-w-fit flex-1">
                    <SelectValue placeholder="Select Engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(filteredEngineOptions).map(([displayValue, keyValue]) => (
                      <SelectItem key={keyValue} value={displayValue} title={displayValue}>
                        {displayValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex items-center">
              <div className="w-1/2">
                <div className="mr-2">
                  <Switch
                    id="required-toggle"
                    checked={prompt.isVisible}
                    onClick={() => {
                      updateWorkflow({ isVisible: !prompt.isVisible });
                    }}
                  />
                </div>
                <div className="flex-column">
                  <Label htmlFor="required-toggle">Is visible</Label>
                  <div className="text-sm text-slate-500">Show the prompt response in the AI tool</div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="mr-2">
                  <Switch
                    id="required-toggle"
                    disabled={!prompt.isVisible}
                    checked={prompt.isVisible ? prompt.isStreaming : false}
                    onClick={() => {
                      updateWorkflow({ isStreaming: !prompt.isStreaming });
                    }}
                  />
                </div>
                <div className="flex-column">
                  <Label htmlFor="required-toggle">Stream response</Label>
                  <div className="text-sm text-slate-500">Allow receiving response in streaming</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Collapsible.Root open={openAdvanced} onOpenChange={setOpenAdvanced} className="mt-5">
                <Collapsible.CollapsibleTrigger className="flex items-center text-sm text-slate-700">
                  {openAdvanced ? (
                    <ChevronDownIcon className="mr-1 h-4 w-3" />
                  ) : (
                    <ChevronRightIcon className="mr-2 h-4 w-3" />
                  )}
                  {openAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
                </Collapsible.CollapsibleTrigger>

                <Collapsible.CollapsibleContent className="space-y-4">
                  {/* Act As Select */}
                  <div className="mt-3">
                    <Label htmlFor="act-as">Act as</Label>
                    <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                      <Select
                        value={prompt.attributes?.actAs || ""}
                        onValueChange={(value) => handleAttributeChange("actAs", value)}>
                        <SelectTrigger className="min-w-fit flex-1">
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unselected" title="None">
                            None
                          </SelectItem>
                          {Object.entries(promptActAs).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-row">
                    {/* Style Select */}
                    <div className="flex w-1/2 flex-col pr-2">
                      <Label htmlFor="style">Style</Label>
                      <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                        <Select
                          value={prompt.attributes?.style || ""}
                          onValueChange={(value) => handleAttributeChange("style", value)}>
                          <SelectTrigger className="min-w-fit flex-1">
                            <SelectValue placeholder="Choose an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unselected" title="None">
                              None
                            </SelectItem>
                            {Object.entries(promptStyle).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* Tone Select */}
                    <div className="flex w-1/2 flex-col pl-2">
                      <Label htmlFor="tone">Tone</Label>
                      <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                        <Select
                          value={prompt.attributes?.tone || ""}
                          onValueChange={(value) => handleAttributeChange("tone", value)}>
                          <SelectTrigger className="min-w-fit flex-1">
                            <SelectValue placeholder="Choose an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unselected" title="None">
                              None
                            </SelectItem>
                            {Object.entries(promptTone).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-row">
                    {/* Length Select */}
                    <div className="flex w-1/2 flex-col pr-2">
                      <Label htmlFor="length">Length</Label>
                      <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                        <Select
                          value={prompt.attributes?.length || ""}
                          onValueChange={(value) => handleAttributeChange("length", value)}>
                          <SelectTrigger className="min-w-fit flex-1">
                            <SelectValue placeholder="Choose an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unselected" title="None">
                              None
                            </SelectItem>
                            {Object.entries(promptLength).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* Language Select */}
                    <div className="flex w-1/2 flex-col pl-2">
                      <Label htmlFor="language">Language</Label>
                      <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                        <Select
                          value={prompt.attributes?.language || ""}
                          onValueChange={(value) => handleAttributeChange("language", value)}>
                          <SelectTrigger className="min-w-fit flex-1">
                            <SelectValue placeholder="Choose an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unselected" title="None">
                              None
                            </SelectItem>
                            {Object.entries(promptLanguage).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Reader Comprehension Select */}
                  <div className="mt-3">
                    <Label htmlFor="reader-comprehension">Reader Comprehension</Label>
                    <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                      <Select
                        value={prompt.attributes?.readerComprehension || ""}
                        onValueChange={(value) => handleAttributeChange("readerComprehension", value)}>
                        <SelectTrigger className="min-w-fit flex-1">
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unselected" title="None">
                            None
                          </SelectItem>
                          {Object.entries(promptReaderComprehension).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Output As Select */}
                  <div className="mt-3">
                    <Label htmlFor="outputas">Output as</Label>
                    <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                      <Select
                        value={prompt.attributes?.outputAs || ""}
                        onValueChange={(value) => handleAttributeChange("outputAs", value)}>
                        <SelectTrigger className="min-w-fit flex-1">
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unselected" title="None">
                            None
                          </SelectItem>
                          {Object.entries(promptOutputAs).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Formatting Select */}
                  <div className="mt-3">
                    <Label htmlFor="formatting">Formatting</Label>
                    <div className="mt-2 flex flex-1 items-center justify-end gap-2">
                      <Select
                        value={prompt.attributes?.formatting || ""}
                        onValueChange={(value) => handleAttributeChange("formatting", value)}>
                        <SelectTrigger className="min-w-fit flex-1">
                          <SelectValue placeholder="Choose an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unselected" title="None">
                            None
                          </SelectItem>
                          {Object.entries(promptFormatting).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Collapsible.CollapsibleContent>
              </Collapsible.Root>
            </div>
          </form>
        </Collapsible.CollapsibleContent>
      </Collapsible.Root>
    </div>
  );
}
