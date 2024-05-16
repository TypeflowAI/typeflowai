import { MatchType } from "@/app/(app)/environments/[environmentId]/actions/lib/testURLmatch";
import { HelpCircleIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { TWorkflow, TWorkflowInlineTriggers } from "@typeflowai/types/workflows";
import { AdvancedOptionToggle } from "@typeflowai/ui/AdvancedOptionToggle";
import { Input } from "@typeflowai/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";

const updateInlineTriggers = (
  localWorkflow: TWorkflow,
  update: (inlineTriggers: TWorkflowInlineTriggers | null) => Partial<TWorkflowInlineTriggers>
): TWorkflow => {
  return {
    ...localWorkflow,
    inlineTriggers: {
      ...localWorkflow.inlineTriggers,
      ...update(localWorkflow.inlineTriggers),
    },
  };
};

const CodeActionSelector = ({
  localWorkflow,
  setLocalWorkflow,
}: {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
}) => {
  const [isCodeAction, setIsCodeAction] = useState(!!localWorkflow.inlineTriggers?.codeConfig?.identifier);
  const codeActionIdentifier = localWorkflow.inlineTriggers?.codeConfig?.identifier || "";

  const onChange = (val: string) => {
    const updatedWorkflow = updateInlineTriggers(localWorkflow, (triggers) => ({
      ...triggers,
      codeConfig: {
        identifier: val,
      },
    }));

    setLocalWorkflow(updatedWorkflow);
  };

  const onCodeActionToggle = (checked: boolean) => {
    setIsCodeAction(!isCodeAction);

    // reset the code action state if the user toggles off
    if (!checked) {
      setLocalWorkflow((prevWorkflow) => {
        const { codeConfig, ...withoutCodeAction } = prevWorkflow.inlineTriggers ?? {};

        return {
          ...prevWorkflow,
          inlineTriggers: {
            ...withoutCodeAction,
          },
        };
      });
    }
  };

  return (
    <div>
      <AdvancedOptionToggle
        title="Code Action"
        description="Trigger this workflow on a Code Action"
        isChecked={isCodeAction}
        onToggle={onCodeActionToggle}
        htmlId="codeAction">
        <div className="w-full rounded-lg border border-slate-100 p-4">
          <Input
            type="text"
            value={codeActionIdentifier || ""}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white"
            placeholder="Identifier e.g. clicked-download"
            id="codeActionIdentifierInput"
          />
        </div>
      </AdvancedOptionToggle>
    </div>
  );
};

const CssSelector = ({
  setLocalWorkflow,
  localWorkflow,
}: {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
}) => {
  const [isCssSelector, setIsCssSelector] = useState(
    !!localWorkflow.inlineTriggers?.noCodeConfig?.cssSelector?.value
  );
  const cssSelectorValue = localWorkflow.inlineTriggers?.noCodeConfig?.cssSelector?.value || "";

  const onChange = (val: string) => {
    const updatedWorkflow = updateInlineTriggers(localWorkflow, (triggers) => ({
      ...triggers,
      noCodeConfig: {
        ...triggers?.noCodeConfig,
        cssSelector: {
          value: val,
        },
      },
    }));

    setLocalWorkflow(updatedWorkflow);
  };

  const onCssSelectorToggle = (checked: boolean) => {
    setIsCssSelector(!isCssSelector);

    // reset the css selector state if the user toggles off
    if (!checked) {
      const updatedWorkflow = updateInlineTriggers(localWorkflow, (triggers) => {
        const { noCodeConfig } = triggers ?? {};
        const { cssSelector, ...withoutCssSelector } = noCodeConfig ?? {};

        return {
          ...triggers,
          noCodeConfig: {
            ...withoutCssSelector,
          },
        };
      });

      setLocalWorkflow(updatedWorkflow);
    }
  };

  return (
    <div>
      <AdvancedOptionToggle
        htmlId="cssSelectorToggle"
        isChecked={isCssSelector}
        onToggle={onCssSelectorToggle}
        customContainerClass="p-0"
        title="CSS Selector"
        description="If a user clicks a button with a specific CSS class or id"
        childBorder={true}>
        <div className="w-full rounded-lg">
          <Input
            type="text"
            value={cssSelectorValue}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white"
            placeholder="Add .css-class or #css-id"
            id="cssSelectorInput"
          />
        </div>
      </AdvancedOptionToggle>
    </div>
  );
};

const PageUrlSelector = ({
  localWorkflow,
  setLocalWorkflow,
}: {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
}) => {
  const [isPageUrl, setIsPageUrl] = useState(!!localWorkflow.inlineTriggers?.noCodeConfig?.pageUrl?.value);
  const matchValue = localWorkflow.inlineTriggers?.noCodeConfig?.pageUrl?.rule || "exactMatch";
  const pageUrlValue = localWorkflow.inlineTriggers?.noCodeConfig?.pageUrl?.value || "";

  const updatePageUrlState = (match: MatchType, pageUrl: string): TWorkflow =>
    updateInlineTriggers(localWorkflow, (triggers) => ({
      ...triggers,
      noCodeConfig: {
        ...triggers?.noCodeConfig,
        pageUrl: {
          rule: match,
          value: pageUrl,
        },
      },
    }));

  const onMatchChange = (match: MatchType) => {
    const updatedWorkflow = updatePageUrlState(match, pageUrlValue);
    setLocalWorkflow(updatedWorkflow);
  };

  const onPageUrlChange = (pageUrl: string) => {
    const updatedWorkflow = updatePageUrlState(matchValue, pageUrl);
    setLocalWorkflow(updatedWorkflow);
  };

  const onPageUrlToggle = (checked: boolean) => {
    setIsPageUrl(!isPageUrl);
    // reset the page url state if the user toggles off
    if (!checked) {
      const updatedWorkflow = updateInlineTriggers(localWorkflow, (triggers) => {
        const { noCodeConfig } = triggers ?? {};
        const { pageUrl, ...withoutPageUrl } = noCodeConfig ?? {};

        return {
          ...triggers,
          noCodeConfig: {
            ...withoutPageUrl,
          },
        };
      });

      setLocalWorkflow(updatedWorkflow);
    }
  };

  return (
    <div>
      <AdvancedOptionToggle
        htmlId="pageURLToggle"
        isChecked={isPageUrl}
        onToggle={onPageUrlToggle}
        title="Page URL"
        customContainerClass="p-0"
        description="If a user visits a specific URL"
        childBorder={false}>
        <div className="flex w-full gap-2">
          <div>
            <Select
              onValueChange={onMatchChange}
              defaultValue={localWorkflow.inlineTriggers?.noCodeConfig?.pageUrl?.rule || "exactMatch"}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Select match type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="exactMatch">Exactly matches</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="startsWith">Starts with</SelectItem>
                <SelectItem value="endsWith">Ends with</SelectItem>
                <SelectItem value="notMatch">Does not exactly match</SelectItem>
                <SelectItem value="notContains">Does not contain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Input
              type="text"
              value={pageUrlValue}
              onChange={(e) => onPageUrlChange(e.target.value)}
              className="bg-white"
              placeholder="e.g. https://app.com/dashboard"
              id="pageURLInput"
            />
          </div>
        </div>
      </AdvancedOptionToggle>
    </div>
  );
};

const InnerHtmlSelector = ({
  localWorkflow,
  setLocalWorkflow,
}: {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
}) => {
  const [isInnerHtml, setIsInnerHtml] = useState(
    !!localWorkflow.inlineTriggers?.noCodeConfig?.innerHtml?.value
  );

  const innerHtmlValue = localWorkflow.inlineTriggers?.noCodeConfig?.innerHtml?.value || "";
  const onChange = (val: string) => {
    const updatedWorkflow = updateInlineTriggers(localWorkflow, (triggers) => ({
      ...triggers,
      noCodeConfig: {
        ...triggers?.noCodeConfig,
        innerHtml: {
          value: val,
        },
      },
    }));

    setLocalWorkflow(updatedWorkflow);
  };

  const onInnerHtmlToggle = (checked: boolean) => {
    setIsInnerHtml(!isInnerHtml);
    // reset the inner html state if the user toggles off
    if (!checked) {
      const updatedWorkflow = updateInlineTriggers(localWorkflow, (triggers) => {
        const { noCodeConfig } = triggers ?? {};
        const { innerHtml, ...withoutInnerHtml } = noCodeConfig ?? {};

        return {
          ...triggers,
          noCodeConfig: {
            ...withoutInnerHtml,
          },
        };
      });

      setLocalWorkflow(updatedWorkflow);
    }
  };

  return (
    <div>
      <AdvancedOptionToggle
        htmlId="innerHTMLToggle"
        isChecked={isInnerHtml}
        onToggle={onInnerHtmlToggle}
        customContainerClass="p-0"
        title="Inner Text"
        description="If a user clicks a button with a specific text"
        childBorder={true}>
        <div className="w-full">
          <div className="grid grid-cols-3 gap-x-8">
            <div className="col-span-3 flex items-end">
              <Input
                type="text"
                value={innerHtmlValue}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white"
                placeholder="e.g. 'Install App'"
                id="innerHTMLInput"
              />
            </div>
          </div>
        </div>
      </AdvancedOptionToggle>
    </div>
  );
};

const InlineTriggers = ({
  localWorkflow,
  setLocalWorkflow,
}: {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
}) => {
  const [isNoCodeAction, setIsNoCodeAction] = useState(!!localWorkflow.inlineTriggers?.noCodeConfig);

  const onNoCodeActionToggle = useCallback(
    (checked: boolean) => {
      setIsNoCodeAction(checked);

      if (!checked) {
        setLocalWorkflow((prevWorkflow) => {
          const { noCodeConfig, ...withoutNoCodeConfig } = prevWorkflow.inlineTriggers ?? {};

          return {
            ...prevWorkflow,
            inlineTriggers: {
              ...withoutNoCodeConfig,
            },
          };
        });
      }
    },
    [setLocalWorkflow]
  );

  // inside the no code config, if no selector is present, then the no code action is not present
  useEffect(() => {
    const noCodeConfig = localWorkflow.inlineTriggers?.noCodeConfig ?? {};
    if (Object.keys(noCodeConfig).length === 0) {
      setLocalWorkflow((prevWorkflow) => {
        const { noCodeConfig, ...withoutNoCodeConfig } = prevWorkflow.inlineTriggers ?? {};

        return {
          ...prevWorkflow,
          inlineTriggers: {
            ...withoutNoCodeConfig,
          },
        };
      });
    }
  }, [localWorkflow.inlineTriggers?.noCodeConfig, setLocalWorkflow]);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-4 mt-2 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
        <HelpCircleIcon className="h-3 w-3" />
        <span className="text-xs">Custom Actions can only be used in this workflow. They are not saved.</span>
      </div>
      <CodeActionSelector localWorkflow={localWorkflow} setLocalWorkflow={setLocalWorkflow} />

      <AdvancedOptionToggle
        title="No Code Action"
        description="Trigger this workflow on a No Code Action"
        htmlId="noCodeAction"
        isChecked={isNoCodeAction}
        onToggle={onNoCodeActionToggle}
        childBorder={false}>
        <div className="flex w-full flex-col gap-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <CssSelector localWorkflow={localWorkflow} setLocalWorkflow={setLocalWorkflow} />
          <PageUrlSelector localWorkflow={localWorkflow} setLocalWorkflow={setLocalWorkflow} />
          <InnerHtmlSelector localWorkflow={localWorkflow} setLocalWorkflow={setLocalWorkflow} />
        </div>
      </AdvancedOptionToggle>
    </div>
  );
};

export default InlineTriggers;
