import { marked } from "marked";
import Markdown from "preact-markdown";
import { useEffect, useState } from "react";

const PromptMarkdownResponse = ({ content }: { content: string }) => {
  const [safeHtml, setSafeHtml] = useState<string>("");

  useEffect(() => {
    const sanitizeHtml = async () => {
      const { default: DOMPurify } = await import("isomorphic-dompurify");

      const markedOpts = {
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        smartLists: true,
        smartypants: false,
      };

      const renderer = new marked.Renderer();
      renderer.link = (href, title, text) =>
        `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`;

      marked.setOptions({ renderer, ...markedOpts });

      let rawHtml = "";

      // Ensure rawHtml is always a string
      try {
        const result = marked.parse(content);
        if (typeof result === "string") {
          rawHtml = result;
        } else if (result instanceof Promise) {
          rawHtml = await result;
        } else {
          throw new Error("Expected marked to return a string or a Promise<string>");
        }
      } catch (error) {
        console.error("Error parsing markdown:", error);
        rawHtml = content; // Fallback to raw content if parsing fails
      }

      const cleanHtml = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ["target"] });

      setSafeHtml(cleanHtml);
    };

    sanitizeHtml();
  }, [content]);

  return (
    <div className="markdown">
      {/* @ts-expect-error */}
      <Markdown markdown={safeHtml} markedOpts={{}} />
    </div>
  );
};

export default PromptMarkdownResponse;
