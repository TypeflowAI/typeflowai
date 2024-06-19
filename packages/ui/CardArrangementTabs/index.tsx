import { TCardArrangementOptions } from "@typeflowai/types/styling";
import { TWorkflowType } from "@typeflowai/types/workflows";
import { CasualCardArrangementIcon } from "../Icons/CasualCardArrangementIcon";
import { SimpleCardsArrangementIcon } from "../Icons/SimpleCardArrangementIcon";
import { StraightCardArrangementIcon } from "../Icons/StraightCardArrangementIcon";
import { Tabs } from "../Tabs";

interface CardArrangementTabsProps {
  workflowType: TWorkflowType;
  activeCardArrangement: TCardArrangementOptions;
  setActiveCardArrangement: (arrangement: TCardArrangementOptions, workflowType: TWorkflowType) => void;
  disabled?: boolean;
}

export const CardArrangementTabs = ({
  activeCardArrangement,
  workflowType,
  setActiveCardArrangement,
  disabled = false,
}: CardArrangementTabsProps) => {
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
        return <SimpleCardsArrangementIcon />;
    }
  };

  return (
    <div className="w-full gap-2 rounded-md bg-white">
      <Tabs
        id="card-arrangement"
        onChange={(value) => {
          handleCardArrangementChange(value);
        }}
        options={[
          { value: "casual", label: "Casual", icon: getCardArrangementIcon("casual") },
          { value: "straight", label: "Straight", icon: getCardArrangementIcon("straight") },
          { value: "simple", label: "Simple", icon: getCardArrangementIcon("simple") },
        ]}
        defaultSelected={activeCardArrangement}
        className="w-full"
        tabsContainerClassName="p-1 gap-2"
      />
    </div>
  );
};
