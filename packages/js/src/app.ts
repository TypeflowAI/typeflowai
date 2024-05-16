import { TTypeflowAIApp } from "@typeflowai/js-core/app";
import { TTypeflowAIWebsite } from "@typeflowai/js-core/website";

import { Result, wrapThrowsAsync } from "../../types/errorHandlers";

declare global {
  interface Window {
    typeflowai: TTypeflowAIApp | TTypeflowAIWebsite;
  }
}

// load the sdk, return the result
async function loadTypeflowAIAppSDK(apiHost: string): Promise<Result<void>> {
  if (!window.typeflowai) {
    const res = await fetch(`${apiHost}/api/packages/app`);

    // failed to fetch the app package
    if (!res.ok) {
      return { ok: false, error: new Error("Failed to load TypeflowAI App SDK") };
    }

    const sdkScript = await res.text();
    const scriptTag = document.createElement("script");
    scriptTag.innerHTML = sdkScript;
    document.head.appendChild(scriptTag);

    const getTypeflowAI = async () =>
      new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (window.typeflowai) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("TypeflowAI App SDK loading timed out"));
        }, 10000);
      });

    try {
      await getTypeflowAI();
      return { ok: true, data: undefined };
    } catch (error: any) {
      // typeflowai loading failed, return the error
      return {
        ok: false,
        error: new Error(error.message ?? "Failed to load TypeflowAI App SDK"),
      };
    }
  }

  return { ok: true, data: undefined };
}

type TypeflowAIAppMethods = {
  [K in keyof TTypeflowAIApp]: TTypeflowAIApp[K] extends Function ? K : never;
}[keyof TTypeflowAIApp];

const typeflowaiProxyHandler: ProxyHandler<TTypeflowAIApp> = {
  get(_target, prop, _receiver) {
    return async (...args: any[]) => {
      if (!window.typeflowai) {
        if (prop !== "init") {
          console.error(
            "🧱 TypeflowAI - Global error: You need to call typeflowai.init before calling any other method"
          );
          return;
        }

        // still need to check if the apiHost is passed
        if (!args[0]) {
          console.error("🧱 TypeflowAI - Global error: You need to pass the apiHost as the first argument");
          return;
        }

        const { apiHost } = args[0];
        const loadSDKResult = await wrapThrowsAsync(loadTypeflowAIAppSDK)(apiHost);

        if (!loadSDKResult.ok) {
          console.error(`🧱 TypeflowAI - Global error: ${loadSDKResult.error.message}`);
          return;
        }
      }

      // @ts-expect-error
      if (window.typeflowai && typeof window.typeflowai[prop as TypeflowAIAppMethods] !== "function") {
        console.error(
          `🧱 TypeflowAI - Global error: TypeflowAI App SDK does not support method ${String(prop)}`
        );
        return;
      }

      try {
        // @ts-expect-error
        return (window.typeflowai[prop as TypeflowAIAppMethods] as Function)(...args);
      } catch (error) {
        console.error(`Something went wrong: ${error}`);
        return;
      }
    };
  },
};

const typeflowaiApp: TTypeflowAIApp = new Proxy({} as TTypeflowAIApp, typeflowaiProxyHandler);
export default typeflowaiApp;
