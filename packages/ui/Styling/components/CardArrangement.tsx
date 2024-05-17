import { useMemo } from "react";

import { cn } from "@typeflowai/lib/cn";
import { capitalizeFirstLetter } from "@typeflowai/lib/strings";
import { TCardArrangementOptions } from "@typeflowai/types/styling";
import { TWorkflowType } from "@typeflowai/types/workflows";

import { Button } from "../../Button";
import {
  CasualCardArrangementIcon,
  NoCardsArrangementIcon,
  StraightCardArrangementIcon,
} from "./CardArrangementIcons";

interface CardArrangementProps {
  workflowType: TWorkflowType;
  activeCardArrangement: TCardArrangementOptions;
  setActiveCardArrangement: (arrangement: TCardArrangementOptions, workflowType: TWorkflowType) => void;
  disabled?: boolean;
}

export const CardArrangement = ({
  activeCardArrangement,
  workflowType,
  setActiveCardArrangement,
  disabled = false,
}: CardArrangementProps) => {
  const workflowTypeDerived = useMemo(() => {
    return workflowType == "link" ? "Link" : "App / Website";
  }, [workflowType]);
  const cardArrangementTypes: TCardArrangementOptions[] = ["casual", "straight", "simple"];

  const handleCardArrangementChange = (arrangement: TCardArrangementOptions) => {
    if (disabled) return;
    setActiveCardArrangement(arrangement, workflowType);
  };

  const getCardArrangementIcon = (cardArrangement: string) => {
    switch (cardArrangement) {
      case "casual":
        return <CasualCardArrangementIcon />;
      case "straight":
        return <StraightCardArrangementIcon />;
      default:
        return <NoCardsArrangementIcon />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-slate-700">
          Card Arrangement for {workflowTypeDerived} Workflows
        </h3>
        <p className="text-xs text-slate-500">
          How funky do you want your cards in {workflowTypeDerived} Workflows
        </p>
      </div>

      <div className="flex gap-2 rounded-md border border-slate-300 bg-white p-1">
        {cardArrangementTypes.map((cardArrangement) => {
          return (
            <Button
              variant="minimal"
              size="sm"
              className={cn(
                "flex flex-1 justify-center space-x-4 bg-white text-center",
                activeCardArrangement === cardArrangement && "bg-slate-200"
              )}
              disabled={disabled}
              onClick={() => handleCardArrangementChange(cardArrangement)}>
              <p> {capitalizeFirstLetter(cardArrangement)}</p>
              {getCardArrangementIcon(cardArrangement)}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
