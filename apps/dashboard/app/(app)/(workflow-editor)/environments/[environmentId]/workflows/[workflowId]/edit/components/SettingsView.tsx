// import { AdvancedTargetingCard } from "@typeflowai/ee/advanced-targeting/components/advanced-targeting-card";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TSegment } from "@typeflowai/types/segment";
import { TWorkflow } from "@typeflowai/types/workflows";
import HowToSendCard from "./HowToSendCard";
import { RecontactOptionsCard } from "./RecontactOptionsCard";
import ResponseOptionsCard from "./ResponseOptionsCard";
import TargetingCard from "./TargetingCard";
import WhenToSendCard from "./WhenToSendCard";
import WokflowPlacementCard from "./WorkflowPlacementCard";

interface SettingsViewProps {
  environment: TEnvironment;
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  actionClasses: TActionClass[];
  attributeClasses: TAttributeClass[];
  segments: TSegment[];
  responseCount: number;
  membershipRole?: TMembershipRole;
  isUserTargetingAllowed?: boolean;
  isTypeflowAICloud: boolean;
}

export const SettingsView = ({
  environment,
  localWorkflow,
  setLocalWorkflow,
  actionClasses,
  attributeClasses,
  segments,
  responseCount,
  membershipRole,
  // isUserTargetingAllowed = false,
  isTypeflowAICloud,
}: SettingsViewProps) => {
  const isWebWorkflow = localWorkflow.type === "website" || localWorkflow.type === "app";

  return (
    <div className="mt-12 space-y-3 p-5">
      <HowToSendCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        environment={environment}
      />

      {localWorkflow.type === "app" ? (
        // !isUserTargetingAllowed ? (
        //   <TargetingCard
        //     key={localWorkflow.segment?.id}
        //     localWorkflow={localWorkflow}
        //     setLocalWorkflow={setLocalWorkflow}
        //     environmentId={environment.id}
        //     attributeClasses={attributeClasses}
        //     segments={segments}
        //     initialSegment={segments.find((segment) => segment.id === localWorkflow.segment?.id)}
        //     isTypeflowAICloud={isTypeflowAICloud}
        //   />
        // ) : (
        //   <AdvancedTargetingCard
        //     key={localWorkflow.segment?.id}
        //     localWorkflow={localWorkflow}
        //     setLocalWorkflow={setLocalWorkflow}
        //     environmentId={environment.id}
        //     attributeClasses={attributeClasses}
        //     actionClasses={actionClasses}
        //     segments={segments}
        //     initialSegment={segments.find((segment) => segment.id === localWorkflow.segment?.id)}
        //   />
        // )
        <TargetingCard
          key={localWorkflow.segment?.id}
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          environmentId={environment.id}
          attributeClasses={attributeClasses}
          segments={segments}
          initialSegment={segments.find((segment) => segment.id === localWorkflow.segment?.id)}
          isTypeflowAICloud={isTypeflowAICloud}
        />
      ) : null}

      <WhenToSendCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        environmentId={environment.id}
        propActionClasses={actionClasses}
        membershipRole={membershipRole}
      />

      <ResponseOptionsCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        responseCount={responseCount}
      />

      <RecontactOptionsCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        environmentId={environment.id}
      />

      {isWebWorkflow && (
        <WokflowPlacementCard
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          environmentId={environment.id}
        />
      )}
    </div>
  );
};
