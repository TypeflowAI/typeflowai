import DOMPurify from "dompurify";
import { marked } from "marked";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import "./style.css";

export const MarkdownResponse = ({ content }: { content: string }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sanitizeHtml = async () => {
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
        } else if ((result as any) instanceof Promise) {
          rawHtml = await result;
        } else {
          throw new Error("Expected marked to return a string or a Promise<string>");
        }
      } catch (error) {
        console.error("Error parsing markdown:", error);
        rawHtml = content; // Fallback to raw content if parsing fails
      }

      const cleanHtml = DOMPurify.sanitize(rawHtml, { ADD_ATTR: ["target"] });

      setSanitizedHtml(cleanHtml);
    };

    sanitizeHtml();
  }, [content]);

  const toggleExpanded = () => setExpanded(!expanded);

  const lines = sanitizedHtml.split("\n");
  const previewContent = lines.slice(0, 25).join("\n");
  const fullContent = sanitizedHtml;

  return (
    <div className="markdown">
      <ReactMarkdown className="markup" rehypePlugins={[rehypeRaw, rehypeSanitize]}>
        {expanded ? fullContent : previewContent}
      </ReactMarkdown>
      {lines.length > 25 && (
        <button
          onClick={toggleExpanded}
          className="expand-button bg-brand mx-2 mt-6 rounded-md px-2 py-1 text-sm font-medium text-white">
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
