import { TTypeflowAIApp } from "@typeflowai/js-core/app";
import { TTypeflowAIWebsite } from "@typeflowai/js-core/website";

import { loadTypeflowAIToProxy } from "./shared/loadTypeflowAI";

declare global {
  interface Window {
    typeflowai: TTypeflowAIApp | TTypeflowAIWebsite;
  }
}

const typeflowaiProxyHandler: ProxyHandler<TTypeflowAIWebsite> = {
  get(_target, prop, _receiver) {
    return (...args: any[]) => loadTypeflowAIToProxy(prop as string, "website", ...args);
  },
};

const typeflowaiWebsite: TTypeflowAIWebsite = new Proxy({} as TTypeflowAIWebsite, typeflowaiProxyHandler);
export default typeflowaiWebsite;
