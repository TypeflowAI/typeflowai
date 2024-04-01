import { TJsConfig, TJsConfigUpdateInput } from "@typeflowai/types/js";

import { Result, err, ok, wrapThrows } from "./errors";

export const LOCAL_STORAGE_KEY = "typeflowai-js";

export class Config {
  private static instance: Config | undefined;
  private config: TJsConfig | null = null;

  private constructor() {
    const localConfig = this.loadFromLocalStorage();
    if (localConfig.ok) {
      this.config = localConfig.value;
    }
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public update(newConfig: TJsConfigUpdateInput): void {
    if (newConfig) {
      const expiresAt = new Date(new Date().getTime() + 15 * 60000); // 15 minutes in the future

      this.config = {
        ...this.config,
        ...newConfig,
        expiresAt,
      };

      this.saveToLocalStorage();
    }
  }

  public get(): TJsConfig {
    if (!this.config) {
      throw new Error("config is null, maybe the init function was not called?");
    }
    return this.config;
  }

  public loadFromLocalStorage(): Result<TJsConfig, Error> {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedConfig) {
        // TODO: validate config
        // This is a hack to get around the fact that we don't have a proper
        // way to validate the config yet.
        const parsedConfig = JSON.parse(savedConfig) as TJsConfig;

        // check if the config has expired
        if (parsedConfig.expiresAt && new Date(parsedConfig.expiresAt) <= new Date()) {
          return err(new Error("Config in local storage has expired"));
        }

        return ok(JSON.parse(savedConfig) as TJsConfig);
      }
    }

    return err(new Error("No or invalid config in local storage"));
  }

  private saveToLocalStorage(): Result<void, Error> {
    return wrapThrows(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.config)))();
  }

  // reset the config

  public resetConfig(): Result<void, Error> {
    this.config = null;

    return wrapThrows(() => localStorage.removeItem(LOCAL_STORAGE_KEY))();
  }
}
