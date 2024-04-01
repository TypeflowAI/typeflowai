import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  attributeClassId?: string;
  actionClassId?: string;
  environmentId?: string;
}

export const workflowCache = {
  tag: {
    byId(id: string) {
      return `workflows-${id}`;
    },
    byEnvironmentId(environmentId: string): string {
      return `environments-${environmentId}-workflows`;
    },
    byAttributeClassId(attributeClassId: string) {
      return `attributeFilters-${attributeClassId}-workflows`;
    },
    byActionClassId(actionClassId: string) {
      return `actionClasses-${actionClassId}-workflows`;
    },
  },
  revalidate({ id, attributeClassId, actionClassId, environmentId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (attributeClassId) {
      revalidateTag(this.tag.byAttributeClassId(attributeClassId));
    }

    if (actionClassId) {
      revalidateTag(this.tag.byActionClassId(actionClassId));
    }

    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }
  },
};
