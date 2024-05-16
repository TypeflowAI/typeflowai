import Link from "next/link";

interface LegalFooterProps {
  IMPRINT_URL?: string;
  PRIVACY_URL?: string;
  IS_TYPEFLOWAI_CLOUD: boolean;
  workflowUrl: string;
}

export default function LegalFooter({
  IMPRINT_URL,
  PRIVACY_URL,
  IS_TYPEFLOWAI_CLOUD,
  workflowUrl,
}: LegalFooterProps) {
  if (!IMPRINT_URL && !PRIVACY_URL && !IS_TYPEFLOWAI_CLOUD) return null;

  const createMailToLink = (workflowLink) => {
    const subject = encodeURIComponent("Reporting this workflow");
    const body = encodeURIComponent(
      `I report the workflow to the TypeflowAI team as it is spam, abusive or violates the terms.\n\n${workflowLink}`
    );
    return `mailto:hola@typeflowai.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="absolute bottom-0 h-10 w-full">
      <div className="mx-auto max-w-lg p-2 text-center text-xs text-slate-400 text-opacity-50">
        {IMPRINT_URL && (
          <Link href={IMPRINT_URL} target="_blank" className="hover:underline">
            Imprint
          </Link>
        )}
        {IMPRINT_URL && PRIVACY_URL && <span className="px-2">|</span>}
        {PRIVACY_URL && (
          <Link href={PRIVACY_URL} target="_blank" className="hover:underline">
            Privacy Policy
          </Link>
        )}
        {PRIVACY_URL && IS_TYPEFLOWAI_CLOUD && <span className="px-2">|</span>}
        {IS_TYPEFLOWAI_CLOUD && (
          <Link href={createMailToLink(workflowUrl)} target="_blank" className="hover:underline">
            Report Workflow
          </Link>
        )}
      </div>
    </div>
  );
}
