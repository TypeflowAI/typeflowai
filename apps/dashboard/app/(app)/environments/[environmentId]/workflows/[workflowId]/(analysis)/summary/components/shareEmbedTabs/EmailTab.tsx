"use client";

import { CodeBracketIcon, DocumentDuplicateIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { AuthenticationError } from "@typeflowai/types/errors";
import { Button } from "@typeflowai/ui/Button";
import CodeBlock from "@typeflowai/ui/CodeBlock";
import LoadingSpinner from "@typeflowai/ui/LoadingSpinner";

import { getEmailHtmlAction, sendEmailAction } from "../../actions";

interface EmailTabProps {
  workflowId: string;
  email: string;
}

export default function EmailTab({ workflowId, email }: EmailTabProps) {
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
  });

  const subject = "TypeflowAI Email Workflow Preview";

  const sendPreviewEmail = async (html) => {
    try {
      await sendEmailAction({
        html,
        subject,
        to: email,
      });
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
    <div className="flex h-full grow flex-col gap-5">
      <div className="flex items-center justify-end gap-4">
        {showEmbed ? (
          <Button
            variant="darkCTA"
            title="Embed workflow in your website"
            aria-label="Embed workflow in your website"
            onClick={() => {
              toast.success("Embed code copied to clipboard!");
              navigator.clipboard.writeText(emailHtml);
            }}
            className="shrink-0"
            EndIcon={DocumentDuplicateIcon}>
            Copy code
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              title="send preview email"
              aria-label="send preview email"
              onClick={() => sendPreviewEmail(emailHtmlPreview)}
              EndIcon={EnvelopeIcon}
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
          EndIcon={CodeBracketIcon}
          className="shrink-0">
          {showEmbed ? "Hide Embed Code" : "View Embed Code"}
        </Button>
      </div>
      <div className="grow overflow-y-scroll rounded-xl border border-gray-200 bg-white px-4 py-[18px]">
        {showEmbed ? (
          <CodeBlock
            customCodeClass="!whitespace-normal sm:!whitespace-pre-wrap !break-all sm:!break-normal"
            language="html"
            showCopyToClipboard={false}>
            {emailHtml}
          </CodeBlock>
        ) : (
          <div>
            <div className="mb-6 flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            </div>
            <div className="">
              <div className="mb-2 border-b border-slate-200 pb-2 text-sm">
                To : {email || "user@mail.com"}
              </div>
              <div className="border-b border-slate-200 pb-2 text-sm">Subject : {subject}</div>
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
    </div>
  );
}
