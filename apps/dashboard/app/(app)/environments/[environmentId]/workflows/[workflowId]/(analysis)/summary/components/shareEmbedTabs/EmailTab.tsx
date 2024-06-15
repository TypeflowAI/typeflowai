"use client";

import { Code2Icon, CopyIcon, MailIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AuthenticationError } from "@typeflowai/types/errors";
import { Button } from "@typeflowai/ui/Button";
import CodeBlock from "@typeflowai/ui/CodeBlock";
import { LoadingSpinner } from "@typeflowai/ui/LoadingSpinner";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";
import { getEmailHtmlAction, sendEmbedWorkflowPreviewEmailAction } from "../../actions";

interface EmailTabProps {
  workflowId: string;
  email: string;
}

export const EmailTab = ({ workflowId, email }: EmailTabProps) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const [emailHtmlPreview, setEmailHtmlPreview] = useState<string>("");

  const emailHtml = useMemo(() => {
    if (!emailHtmlPreview) return "";
    return emailHtmlPreview
      .replaceAll("?preview=true&amp;", "?")
      .replaceAll("?preview=true&;", "?")
      .replaceAll("?preview=true", "");
  }, [emailHtmlPreview]);

  useEffect(() => {
    getData();

    async function getData() {
      const emailHtml = await getEmailHtmlAction(workflowId);
      setEmailHtmlPreview(emailHtml);
    }
  }, [workflowId]);

  const sendPreviewEmail = async () => {
    try {
      await sendEmbedWorkflowPreviewEmailAction(workflowId);
      toast.success("Email sent!");
    } catch (err) {
      if (err instanceof AuthenticationError) {
        toast.error("You are not authenticated to perform this action.");
        return;
      }
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-5 ">
      <div className="flex items-center justify-end gap-4">
        {showEmbed ? (
          <Button
            variant="secondary"
            title="Embed workflow in your website"
            aria-label="Embed workflow in your website"
            onClick={() => {
              capturePosthogEvent("WorkflowShared", { workflowId: workflowId, shareMethod: "Email Embed" });
              toast.success("Embed code copied to clipboard!");
              navigator.clipboard.writeText(emailHtml);
            }}
            className="shrink-0"
            EndIcon={CopyIcon}>
            Copy code
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              title="send preview email"
              aria-label="send preview email"
              onClick={() => sendPreviewEmail()}
              EndIcon={MailIcon}
              className="shrink-0">
              Send Preview
            </Button>
          </>
        )}
        <Button
          variant="darkCTA"
          title="view embed code for email"
          aria-label="view embed code for email"
          onClick={() => {
            setShowEmbed(!showEmbed);
          }}
          EndIcon={Code2Icon}
          className="shrink-0">
          {showEmbed ? "Hide Embed Code" : "View Embed Code"}
        </Button>
      </div>
      {showEmbed ? (
        <div className="prose prose-slate -mt-4 max-w-full">
          <CodeBlock
            customCodeClass="text-sm h-48 overflow-y-scroll"
            language="html"
            showCopyToClipboard={false}>
            {emailHtml}
          </CodeBlock>
        </div>
      ) : (
        <div className="mb-12 grow overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-6 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
          </div>
          <div>
            <div className="mb-2 border-b border-slate-200 pb-2 text-sm">To : {email || "user@mail.com"}</div>
            <div className="border-b border-slate-200 pb-2 text-sm">
              Subject : TypeflowAI Email Workflow Preview
            </div>
            <div className="p-4">
              {emailHtml ? (
                <div dangerouslySetInnerHTML={{ __html: emailHtmlPreview }}></div>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
