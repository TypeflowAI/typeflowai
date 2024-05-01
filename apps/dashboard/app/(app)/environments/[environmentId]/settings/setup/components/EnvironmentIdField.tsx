"use client";

import CodeBlock from "@typeflowai/ui/CodeBlock";

export default function SetupInstructions({ environmentId }: { environmentId: string }) {
  return (
    <div className="prose prose-slate -mt-3">
      <CodeBlock language="js">{environmentId}</CodeBlock>
    </div>
  );
}
