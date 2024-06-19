"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useCallback, useEffect } from "react";
import { Suggestion } from "../lib/suggestion";

interface PromptEditorProps {
  promptMessage: string | undefined;
  onFocusChange: (focused: boolean) => void;
  questionIds: string[];
  onContentChange: (content: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  onFocusChange,
  questionIds,
  promptMessage,
  onContentChange,
}) => {
  const limit = 4096;

  const formatPromptMessage = (message: string) => {
    const mentionRegex = /@([\w-]+)/g;

    const lines = message.split("\n").map((line) => {
      const formattedLine = line.replace(
        mentionRegex,
        "<span data-type='mention' class='mention' data-id='$1'>$&</span>"
      );
      return formattedLine.trim() ? `<p>${formattedLine}</p>` : "";
    });

    while (lines.length && lines[0] === "") lines.shift();
    while (lines.length && lines[lines.length - 1] === "") lines.pop();

    return lines.join("");
  };

  const promptContent = promptMessage ? formatPromptMessage(promptMessage) : `<p></p><p></p><p></p><p></p>`;

  const editor = useEditor({
    editorProps: { attributes: { class: "prompt-editor" } },
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: { class: "paragraph" },
      }),
      Text,
      CharacterCount.configure({
        limit,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: {
          ...Suggestion,
          items: ({ query }: { query: string }): Promise<string[]> => {
            return new Promise((resolve) => {
              const questionsList = questionIds
                .filter((id) => id.toLowerCase().startsWith(query.toLowerCase()))
                .slice(0, 5);

              setTimeout(() => {
                resolve(questionsList);
              }, 250);
            });
          },
        },
      }),
    ],
    content: promptContent,
  });

  const handleContentChange = useCallback(() => {
    if (editor) {
      const htmlContent = editor.getHTML();
      onContentChange(htmlContent);
    }
  }, [editor, onContentChange]);

  useEffect(() => {
    if (editor) {
      editor.on("update", handleContentChange);
      editor.on("focus", () => onFocusChange(true));
      editor.on("blur", () => onFocusChange(false));
    }
    return () => {
      if (editor) {
        editor.off("update", handleContentChange);
        editor.off("focus");
        editor.off("blur");
      }
    };
  }, [editor, onFocusChange, handleContentChange]);

  const percentage = editor ? Math.round((100 / limit) * editor.storage.characterCount.characters()) : 0;

  return (
    <div>
      <EditorContent editor={editor} />
      {editor && (
        <div
          className={`character-count ${
            editor.storage.characterCount.characters() === limit ? "character-count--warning" : ""
          }`}>
          <svg height="20" width="20" viewBox="0 0 20 20" className="mr-2">
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>

          <div className="character-count__text">
            {editor.storage.characterCount.characters()}/{limit} characters
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptEditor;
