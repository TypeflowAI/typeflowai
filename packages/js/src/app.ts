import { TTypeflowAIApp } from "@typeflowai/js-core/app";
import { TTypeflowAIWebsite } from "@typeflowai/js-core/website";

import { loadTypeflowAIToProxy } from "./shared/loadTypeflowAI";

declare global {
  interface Window {
    typeflowai: TTypeflowAIApp | TTypeflowAIWebsite;
  }
}

const typeflowaiProxyHandler: ProxyHandler<TTypeflowAIApp> = {
  get(_target, prop, _receiver) {
    return (...args: any[]) => loadTypeflowAIToProxy(prop as string, "app", ...args);
  },
};

const typeflowaiApp: TTypeflowAIApp = new Proxy({} as TTypeflowAIApp, typeflowaiProxyHandler);
export default typeflowaiApp;
