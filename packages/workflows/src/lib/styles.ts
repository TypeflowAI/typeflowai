import { isLight } from "@/lib/utils";
import global from "@/styles/global.css?inline";
import preflight from "@/styles/preflight.css?inline";

import editorCss from "../../../ui/Editor/stylesEditorFrontend.css?inline";

export const addStylesToDom = () => {
  if (document.getElementById("typeflowai__css") === null) {
    const styleElement = document.createElement("style");
    styleElement.id = "typeflowai__css";
    styleElement.innerHTML = preflight + global + editorCss;
    document.head.appendChild(styleElement);
  }
};

export const addCustomThemeToDom = ({ brandColor }: { brandColor: string }) => {
  if (document.getElementById("typeflowai__css") === null) return;

  const styleElement = document.createElement("style");
  styleElement.id = "typeflowai__css__custom";
  styleElement.innerHTML = `
    :root {
      --fb-brand-color: ${brandColor};
      ${isLight(brandColor) ? "--fb-brand-text-color: black;" : "--fb-brand-text-color: white;"}
    }
  `;
  document.head.appendChild(styleElement);
};
