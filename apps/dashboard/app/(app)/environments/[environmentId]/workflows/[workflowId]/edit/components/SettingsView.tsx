import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TWorkflow } from "@typeflowai/types/workflows";

import HowToSendCard from "./HowToSendCard";
import RecontactOptionsCard from "./RecontactOptionsCard";
import ResponseOptionsCard from "./ResponseOptionsCard";
import StylingCard from "./StylingCard";

// import WhenToSendCard from "./WhenToSendCard";
// import WhoToSendCard from "./WhoToSendCard";

interface SettingsViewProps {
  environment: TEnvironment;
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  actionClasses: TActionClass[];
  attributeClasses: TAttributeClass[];
  responseCount: number;
  membershipRole?: TMembershipRole;
  colours: string[];
}

export default function SettingsView({
  environment,
  localWorkflow,
  setLocalWorkflow,
  // actionClasses,
  // attributeClasses,
  responseCount,
  // membershipRole,
  colours,
}: SettingsViewProps) {
  return (
    <div className="mt-12 space-y-3 p-5">
      <HowToSendCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        environment={environment}
      />

      {/* <WhoToSendCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        environmentId={environment.id}
        attributeClasses={attributeClasses}
      />

      <WhenToSendCard
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        environmentId={environment.id}
        actionClasses={actionClasses}
        membershipRole={membershipRole}
      /> */}

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

      <StylingCard localWorkflow={localWorkflow} setLocalWorkflow={setLocalWorkflow} colours={colours} />
    </div>
  );
}
