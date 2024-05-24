import { TopControlButtons } from "@/app/(app)/environments/[environmentId]/components/TopControlButtons";
import { WidgetStatusIndicator } from "@/app/(app)/environments/[environmentId]/components/WidgetStatusIndicator";

import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { TEnvironment } from "@typeflowai/types/environment";

interface SideBarProps {
  environment: TEnvironment;
  environments: TEnvironment[];
}

export const TopControlBar = ({ environment, environments }: SideBarProps) => {
  return (
    <div className="fixed inset-0 top-0 z-30 flex h-14 w-full items-center justify-end bg-slate-50 px-6">
      <div className="shadow-xs z-10">
        <div className="flex w-fit space-x-2 py-2">
          <WidgetStatusIndicator environment={environment} type="mini" />
          <TopControlButtons
            environment={environment}
            environments={environments}
            isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
          />
        </div>
      </div>
    </div>
  );
};
