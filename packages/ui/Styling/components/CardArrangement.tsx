import { useMemo } from "react";

import { cn } from "@typeflowai/lib/cn";
import { TCardArrangementOptions } from "@typeflowai/types/styling";

import { Button } from "../../Button";

type CardArrangementProps = {
  workflowType: "link" | "web";
  activeCardArrangement: TCardArrangementOptions;
  setActiveCardArrangement: (arrangement: TCardArrangementOptions) => void;
  disabled?: boolean;
};

export const CardArrangement = ({
  activeCardArrangement,
  workflowType,
  setActiveCardArrangement,
  disabled = false,
}: CardArrangementProps) => {
  const workflowTypeDerived = useMemo(() => {
    return workflowType == "link" ? "Link" : "In App";
  }, [workflowType]);

  const handleCardArrangementChange = (arrangement: TCardArrangementOptions) => {
    if (disabled) return;
    setActiveCardArrangement(arrangement);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-slate-900">
          Card Arrangement for {workflowTypeDerived} Workflows
        </h3>
        <p className="text-sm text-slate-800">
          How funky do you want your cards in {workflowTypeDerived} Workflows
        </p>
      </div>

      <div className="flex gap-2 rounded-md border border-slate-300 bg-white p-1">
        <Button
          variant="minimal"
          size="sm"
          className={cn(
            "flex flex-1 justify-center bg-white text-center",
            activeCardArrangement === "casual" && "bg-slate-200"
          )}
          disabled={disabled}
          onClick={() => handleCardArrangementChange("casual")}>
          Casual
        </Button>

        <Button
          variant="minimal"
          size="sm"
          onClick={() => handleCardArrangementChange("straight")}
          disabled={disabled}
          className={cn(
            "flex flex-1 justify-center bg-white text-center",
            activeCardArrangement === "straight" && "bg-slate-200"
          )}>
          Straight
        </Button>

        <Button
          variant="minimal"
          size="sm"
          onClick={() => handleCardArrangementChange("simple")}
          disabled={disabled}
          className={cn(
            "flex flex-1 justify-center bg-white text-center",
            activeCardArrangement === "simple" && "bg-slate-200"
          )}>
          Simple
        </Button>
      </div>
    </div>
  );
};
