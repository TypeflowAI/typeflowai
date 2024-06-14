import { cn } from "@typeflowai/lib/cn";

import { ColorPicker } from "../ColorPicker";

type ColorSelectorProps = {
  color: string;
  setColor: (color: string) => void;
  className?: string;
  disabled?: boolean;
};

export const ColorSelector = ({ color, setColor, className = "", disabled = false }: ColorSelectorProps) => {
  return (
    <div className={cn("max-w-xs", disabled ? "opacity-40" : "", className)}>
      <ColorPicker color={color} onChange={setColor} containerClass="my-0" disabled={disabled} />
    </div>
  );
};
