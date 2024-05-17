import { useEffect, useState } from "preact/hooks";

import { WorkflowInlineProps } from "@typeflowai/types/typeflowAIWorkflows";

import { Workflow } from "./Workflow";

export function WorkflowInline(props: WorkflowInlineProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Assuming 768px as a breakpoint for mobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="fbjs" className="typeflowai-form h-full w-full">
      {isMobile ? (
        <div className="flex h-screen w-full flex-col justify-end overflow-hidden">
          <div>
            <Workflow {...props} />
          </div>
        </div>
      ) : (
        <Workflow {...props} />
      )}
    </div>
  );
}
