import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  environmentId?: string;
  userId?: string;
}

export const personCache = {
  tag: {
    byId(id: string): string {
      return `people-${id}`;
    },
    byEnvironmentId(environmentId: string): string {
      return `environments-${environmentId}-people`;
    },
    byEnvironmentIdAndUserId(environmentId: string, userId: string): string {
      return `environments-${environmentId}-personByUserId-${userId}`;
    },
  },
  revalidate({ id, environmentId, userId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (environmentId && userId) {
      revalidateTag(this.tag.byEnvironmentIdAndUserId(environmentId, userId));
    }

    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }
  },
};
