import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  workflowId?: string;
  personId?: string | null;
  environmentId?: string;
}

export const displayCache = {
  tag: {
    byId(id: string) {
      return `displays-${id}`;
    },
    byWorkflowId(workflowId: string) {
      return `workflows-${workflowId}-displays`;
    },
    byPersonId(personId: string) {
      return `people-${personId}-displays`;
    },
    byEnvironmentId(environmentId: string) {
      return `environments-${environmentId}-displays`;
    },
  },
  revalidate({ id, workflowId, personId, environmentId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (workflowId) {
      revalidateTag(this.tag.byWorkflowId(workflowId));
    }

    if (personId) {
      revalidateTag(this.tag.byPersonId(personId));
    }

    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }
  },
};
