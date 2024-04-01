import { TUserNotificationSettings } from "@typeflowai/types/user";

export interface Membership {
  team: {
    id: string;
    name: string;
    products: {
      id: string;
      name: string;
      environments: {
        id: string;
        workflows: {
          id: string;
          name: string;
        }[];
      }[];
    }[];
  };
}

export interface User {
  id: string;
  notificationSettings: TUserNotificationSettings;
}
