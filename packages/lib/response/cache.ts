import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  environmentId?: string;
  personId?: string;
  singleUseId?: string;
  workflowId?: string;
}

export const responseCache = {
  tag: {
    byId(responseId: string) {
      return `responses-${responseId}`;
    },
    byEnvironmentId(environmentId: string) {
      return `environments-${environmentId}-responses`;
    },
    byPersonId(personId: string) {
      return `people-${personId}-responses`;
    },
    bySingleUseId(workflowId: string, singleUseId: string) {
      return `workflows-${workflowId}-singleUse-${singleUseId}-responses`;
    },
    byWorkflowId(workflowId: string) {
      return `workflows-${workflowId}-responses`;
    },
  },
  revalidate({ environmentId, personId, id, singleUseId, workflowId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (personId) {
      revalidateTag(this.tag.byPersonId(personId));
    }

    if (workflowId) {
      revalidateTag(this.tag.byWorkflowId(workflowId));
    }

    if (environmentId) {
      revalidateTag(this.tag.byEnvironmentId(environmentId));
    }

    if (workflowId && singleUseId) {
      revalidateTag(this.tag.bySingleUseId(workflowId, singleUseId));
    }
  },
};
