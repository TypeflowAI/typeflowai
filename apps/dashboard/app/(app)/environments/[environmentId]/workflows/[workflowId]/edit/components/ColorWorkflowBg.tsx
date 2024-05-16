import { useState } from "react";

import { ColorPicker } from "@typeflowai/ui/ColorPicker";

interface ColorWorkflowBgProps {
  handleBgChange: (bg: string, bgType: string) => void;
  colors: string[];
  background: string;
}

export const ColorWorkflowBg = ({ handleBgChange, colors, background }: ColorWorkflowBgProps) => {
  const [color, setColor] = useState(background || "#ffff");

  const handleBg = (x: string) => {
    setColor(x);
    handleBgChange(x, "color");
  };
  return (
    <div>
      <div className="w-full max-w-xs py-2">
        <ColorPicker color={color} onChange={handleBg} />
      </div>
      <div className="flex flex-wrap gap-4">
        {colors.map((x) => {
          return (
            <div
              className={`h-16 w-16 cursor-pointer rounded-lg ${
                color === x ? "border-4 border-slate-500" : ""
              }`}
              key={x}
              style={{ backgroundColor: `${x}` }}
              onClick={() => handleBg(x)}></div>
          );
        })}
      </div>
    </div>
  );
};
