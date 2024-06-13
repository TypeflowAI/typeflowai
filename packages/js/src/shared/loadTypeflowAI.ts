import { Result, wrapThrowsAsync } from "../../../types/errorHandlers";
import { MethodQueue } from "../methodQueue";

let isInitializing = false;
let isInitialized = false;
const methodQueue = new MethodQueue();

// Load the SDK, return the result
const loadTypeflowAISDK = async (apiHost: string, sdkType: "app" | "website"): Promise<Result<void>> => {
  if (!window.typeflowai) {
    const res = await fetch(`${apiHost}/api/packages/${sdkType}`);

    // Failed to fetch the app package
    if (!res.ok) {
      return { ok: false, error: new Error(`Failed to load TypeflowAI ${sdkType} SDK`) };
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
          reject(new Error(`TypeflowAI ${sdkType} SDK loading timed out`));
        }, 10000);
      });

    try {
      await getTypeflowAI();
      return { ok: true, data: undefined };
    } catch (error: any) {
      return {
        ok: false,
        error: new Error(error.message ?? `Failed to load TypeflowAI ${sdkType} SDK`),
      };
    }
  }

  return { ok: true, data: undefined };
};

// TODO: Fix these types
// type TypeflowAIAppMethods = {
//   [K in keyof TTypeflowAIApp]: TTypeflowAIApp[K] extends Function ? K : never;
// }[keyof TTypeflowAIApp];

// type TypeflowAIWebsiteMethods = {
//   [K in keyof TTypeflowAIWebsite]: TTypeflowAIWebsite[K] extends Function ? K : never;
// }[keyof TTypeflowAIWebsite];

export const loadTypeflowAIToProxy = async (prop: string, sdkType: "app" | "website", ...args: any[]) => {
  const executeMethod = async () => {
    try {
      //  @ts-expect-error
      return await (window.typeflowai[prop] as Function)(...args);
    } catch (error) {
      console.error(`🧱 TypeflowAI - Global error: ${error}`);
      throw error;
    }
  };

  if (!isInitialized) {
    if (isInitializing) {
      methodQueue.add(executeMethod);
    } else {
      if (prop === "init") {
        isInitializing = true;

        const initialize = async () => {
          const { apiHost } = args[0];
          const loadSDKResult = await wrapThrowsAsync(loadTypeflowAISDK)(apiHost, sdkType);

          if (!loadSDKResult.ok) {
            isInitializing = false;
            console.error(`🧱 TypeflowAI - Global error: ${loadSDKResult.error.message}`);
            return;
          }

          try {
            const result = await (window.typeflowai[prop] as Function)(...args);
            isInitialized = true;
            isInitializing = false;

            return result;
          } catch (error) {
            isInitializing = false;
            console.error(`🧱 TypeflowAI - Global error: ${error}`);
            throw error;
          }
        };

        methodQueue.add(initialize);
      } else {
        console.error(
          "🧱 TypeflowAI - Global error: You need to call typeflowai.init before calling any other method"
        );
        return;
      }
    }
  } else {
    // @ts-expect-error
    if (window.typeflowai && typeof window.typeflowai[prop] !== "function") {
      console.error(
        `🧱 TypeflowAI - Global error: TypeflowAI ${sdkType} SDK does not support method ${String(prop)}`
      );
      return;
    }

    methodQueue.add(executeMethod);
    return;
  }
};
