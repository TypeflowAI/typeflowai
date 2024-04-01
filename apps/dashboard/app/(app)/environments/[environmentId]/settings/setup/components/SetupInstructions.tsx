"use client";

import packageJson from "@/package.json";
import Link from "next/link";
import "prismjs/themes/prism.css";
import { useState } from "react";
import { IoLogoHtml5, IoLogoNpm } from "react-icons/io5";

import CodeBlock from "@typeflowai/ui/CodeBlock";
import { TabBar } from "@typeflowai/ui/TabBar";

const tabs = [
  { id: "npm", label: "NPM", icon: <IoLogoNpm /> },
  { id: "html", label: "HTML", icon: <IoLogoHtml5 /> },
];

export default function SetupInstructions({
  environmentId,
  webAppUrl,
  isTypeflowAICloud,
}: {
  environmentId: string;
  webAppUrl: string;
  isTypeflowAICloud: boolean;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div>
      <TabBar tabs={tabs} activeId={activeTab} setActiveId={setActiveTab} />
      <div className="px-6 py-5">
        {activeTab === "npm" ? (
          <div className="prose prose-slate">
            <p className="text-lg font-semibold text-slate-800">Step 1: NPM Install</p>
            <CodeBlock language="sh">npm install @typeflowai/js --save</CodeBlock>
            <p className="pt-4 text-lg font-semibold text-slate-800">Step 2: Initialize widget</p>
            <p>Import TypeflowAI and initialize the widget in your Component (e.g. App.tsx):</p>
            <CodeBlock language="js">{`import typeflowai from "@typeflowai/js";

if (typeof window !== "undefined") {
  typeflowai.init({
    environmentId: "${environmentId}",
    apiHost: "${webAppUrl}",
    debug: true, // remove when in production 
  });
}`}</CodeBlock>

            <ul className="list-disc">
              <li>
                <span className="font-semibold">environmentId:</span> Used to identify the correct
                environment: {environmentId} is yours.
              </li>
              <li>
                <span className="font-semibold">apiHost:</span> This is the URL of your TypeflowAI backend.
              </li>
            </ul>
            <p className="text-lg font-semibold text-slate-800">You&apos;re done 🎉</p>
            <p>
              Your app now communicates with TypeflowAI - sending events, and loading workflows automatically!
            </p>

            <ul className="list-disc text-slate-700">
              <li>
                <span className="font-semibold">Does your widget work? </span>
                <span>Scroll to the top!</span>
              </li>
              <li>
                <span className="font-semibold">
                  Need a more detailed setup guide for React, Next.js or Vue.js?
                </span>{" "}
                <Link
                  className="decoration-brand-dark"
                  href="https://typeflowai.com/docs/getting-started/quickstart-in-app-workflow"
                  target="_blank">
                  Check out the docs.
                </Link>
              </li>
              <li>
                <span className="font-semibold">Have a problem?</span>{" "}
                <Link
                  className="decoration-brand-dark"
                  target="_blank"
                  href="https://github.com/TypeflowAI/typeflowai/issues">
                  Open an issue on GitHub
                </Link>{" "}
                {/* or{" "}
                <Link className="decoration-brand-dark" href="https://typeflowai.com/discord" target="_blank">
                  join Discord.
                </Link> */}
              </li>
              <li>
                <span className="font-semibold">
                  Want to learn how to add user attributes, custom events and more?
                </span>{" "}
                <Link
                  className="decoration-brand-dark"
                  href="https://typeflowai.com/docs/attributes/why"
                  target="_blank">
                  Dive into the docs.
                </Link>
              </li>
            </ul>
          </div>
        ) : activeTab === "html" ? (
          <div className="prose prose-slate">
            <p className="text-lg font-semibold text-slate-800">Step 1: Copy and paste code</p>
            <p>
              Insert this code into the <code>{`<head>`}</code> tag of your website:
            </p>
            <CodeBlock language="js">{`<!-- START TypeflowAI Workflows -->
<script type="text/javascript">
!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://unpkg.com/@typeflowai/js@^1.4.0/dist/index.umd.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e),setTimeout(function(){window.typeflowai.init({environmentId: "${environmentId}", apiHost: "${window.location.protocol}//${window.location.host}"})},500)}();
</script>
<!-- END TypeflowAI Workflows -->`}</CodeBlock>
            <p className="text-lg font-semibold text-slate-800">You&apos;re done 🎉</p>
            <p>
              Your app now communicates with TypeflowAI - sending events, and loading workflows automatically!
            </p>

            <ul className="list-disc text-slate-700">
              <li>
                <span className="font-semibold">Does your widget work? </span>
                <span>Scroll to the top!</span>
              </li>
              <li>
                <span className="font-semibold">Have a problem?</span>{" "}
                <Link
                  className="decoration-brand-dark"
                  target="_blank"
                  href="https://github.com/TypeflowAI/typeflowai/issues">
                  Open an issue on GitHub
                </Link>{" "}
                {/* or{" "}
                <Link className="decoration-brand-dark" href="https://typeflowai.com/discord" target="_blank">
                  join Discord.
                </Link> */}
              </li>
              <li>
                <span className="font-semibold">
                  Want to learn how to add user attributes, custom events and more?
                </span>{" "}
                <Link
                  className="decoration-brand-dark"
                  href="https://typeflowai.com/docs/attributes/why"
                  target="_blank">
                  Dive into the docs.
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
        {!isTypeflowAICloud && (
          <div>
            <hr className="my-3" />
            <p className="flex w-full justify-end text-sm text-slate-700">
              TypeflowAI version: {packageJson.version}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
