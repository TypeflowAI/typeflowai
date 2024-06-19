import { TCardSizeOptions } from "@typeflowai/types/styling";
import { TWorkflowType } from "@typeflowai/types/workflows";
import { LargeCardIcon } from "../Icons/LargeCardIcon";
import { RegularCardIcon } from "../Icons/RegularCardIcon";
import { SmallCardIcon } from "../Icons/SmallCardIcon";
import { Tabs } from "../Tabs";

interface CardSizeTabsProps {
  workflowType: TWorkflowType;
  activeCardSize: TCardSizeOptions;
  setActiveCardSize: (size: TCardSizeOptions, workflowType: TWorkflowType) => void;
  disabled?: boolean;
}

export const CardSizeTabs = ({
  activeCardSize,
  workflowType,
  setActiveCardSize,
  disabled = false,
}: CardSizeTabsProps) => {
  const handleCardSizeChange = (size: TCardSizeOptions) => {
    if (disabled) return;
    setActiveCardSize(size, workflowType);
  };

  const getCardSizeIcon = (cardSize: string) => {
    switch (cardSize) {
      case "regular":
        return <RegularCardIcon />;
      case "large":
        return <LargeCardIcon />;
      default:
        return <SmallCardIcon />;
    }
  };

  return (
    <div className="w-full gap-2 rounded-md bg-white">
      <Tabs
        id="card-size"
        onChange={(value) => {
          handleCardSizeChange(value);
        }}
        options={[
          { value: "small", label: "Small", icon: getCardSizeIcon("small") },
          { value: "regular", label: "Regular", icon: getCardSizeIcon("regular") },
          { value: "large", label: "Large", icon: getCardSizeIcon("large") },
        ]}
        defaultSelected={activeCardSize}
        className="w-full"
        tabsContainerClassName="p-1 gap-2"
      />
    </div>
  );
};
