import { marked } from "marked";
import Markdown from "preact-markdown";

function PromptMarkdownResponse({ content }: { content: string }) {
  const markedOpts = {
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
  };

  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) =>
    `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`;

  marked.setOptions({ renderer, ...markedOpts });

  return (
    <div className="markdown">
      {/* @ts-expect-error */}
      <Markdown markdown={content} markedOpts={markedOpts} />
    </div>
  );
}

export default PromptMarkdownResponse;
