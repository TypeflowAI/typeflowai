import { Prisma } from "@prisma/client";
import { prisma } from "@typeflowai/database";
import { ZString } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError, ValidationError } from "@typeflowai/types/errors";
import {
  TActionMetric,
  TAllOperators,
  TBaseFilters,
  TEvaluateSegmentUserAttributeData,
  TEvaluateSegmentUserData,
  TSegment,
  TSegmentActionFilter,
  TSegmentAttributeFilter,
  TSegmentConnector,
  TSegmentCreateInput,
  TSegmentDeviceFilter,
  TSegmentPersonFilter,
  TSegmentSegmentFilter,
  TSegmentUpdateInput,
  ZSegmentCreateInput,
  ZSegmentFilters,
  ZSegmentUpdateInput,
} from "@typeflowai/types/segment";
import {
  getActionCountInLastMonth,
  getActionCountInLastQuarter,
  getActionCountInLastWeek,
  getFirstOccurrenceDaysAgo,
  getLastOccurrenceDaysAgo,
  getTotalOccurrencesForAction,
} from "../action/service";
import { cache } from "../cache";
import { structuredClone } from "../pollyfills/structuredClone";
import { validateInputs } from "../utils/validate";
import { workflowCache } from "../workflow/cache";
import { getWorkflow } from "../workflow/service";
import { segmentCache } from "./cache";
import { isResourceFilter, searchForAttributeClassNameInSegment } from "./utils";

type PrismaSegment = Prisma.SegmentGetPayload<{
  include: {
    workflows: {
      select: {
        id: true;
      };
    };
  };
}>;

export const selectSegment = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  description: true,
  environmentId: true,
  filters: true,
  isPrivate: true,
  workflows: {
    select: {
      id: true,
      name: true,
      status: true,
    },
  },
};

export const transformPrismaSegment = (segment: PrismaSegment): TSegment => {
  return {
    ...segment,
    workflows: segment.workflows.map((workflow) => workflow.id),
  };
};

export const createSegment = async (segmentCreateInput: TSegmentCreateInput): Promise<TSegment> => {
  validateInputs([segmentCreateInput, ZSegmentCreateInput]);

  const { description, environmentId, filters, isPrivate, workflowId, title } = segmentCreateInput;

  let data: Prisma.SegmentCreateArgs["data"] = {
    environmentId,
    title,
    description,
    isPrivate,
    filters,
  };

  if (workflowId) {
    data = {
      ...data,
      workflows: {
        connect: {
          id: workflowId,
        },
      },
    };
  }

  try {
    const segment = await prisma.segment.create({
      data,
      select: selectSegment,
    });

    segmentCache.revalidate({ id: segment.id, environmentId });
    workflowCache.revalidate({ id: workflowId });

    return transformPrismaSegment(segment);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getSegments = (environmentId: string): Promise<TSegment[]> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId]);
      try {
        const segments = await prisma.segment.findMany({
          where: {
            environmentId,
          },
          select: selectSegment,
        });

        if (!segments) {
          return [];
        }

        return segments.map((segment) => transformPrismaSegment(segment));
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getSegments-${environmentId}`],
    {
      tags: [segmentCache.tag.byEnvironmentId(environmentId)],
    }
  )();

export const getSegment = (segmentId: string): Promise<TSegment> =>
  cache(
    async () => {
      validateInputs([segmentId, ZId]);
      try {
        const segment = await prisma.segment.findUnique({
          where: {
            id: segmentId,
          },
          select: selectSegment,
        });

        if (!segment) {
          throw new ResourceNotFoundError("segment", segmentId);
        }

        return transformPrismaSegment(segment);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getSegment-${segmentId}`],
    {
      tags: [segmentCache.tag.byId(segmentId)],
    }
  )();

export const updateSegment = async (segmentId: string, data: TSegmentUpdateInput): Promise<TSegment> => {
  validateInputs([segmentId, ZId], [data, ZSegmentUpdateInput]);

  try {
    let updatedInput: Prisma.SegmentUpdateInput = {
      ...data,
      workflows: undefined,
    };

    if (data.workflows) {
      updatedInput = {
        ...data,
        workflows: {
          connect: data.workflows.map((workflowId) => ({ id: workflowId })),
        },
      };
    }

    const currentSegment = await getSegment(segmentId);
    if (!currentSegment) {
      throw new ResourceNotFoundError("segment", segmentId);
    }

    const segment = await prisma.segment.update({
      where: {
        id: segmentId,
      },
      data: updatedInput,
      select: selectSegment,
    });

    segmentCache.revalidate({ id: segmentId, environmentId: segment.environmentId });
    segment.workflows.map((workflow) => workflowCache.revalidate({ id: workflow.id }));

    return transformPrismaSegment(segment);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const deleteSegment = async (segmentId: string): Promise<TSegment> => {
  validateInputs([segmentId, ZId]);

  try {
    const currentSegment = await getSegment(segmentId);
    if (!currentSegment) {
      throw new ResourceNotFoundError("segment", segmentId);
    }

    const segment = await prisma.segment.delete({
      where: {
        id: segmentId,
      },
      select: selectSegment,
    });

    // pause all the running workflows that are using this segment
    const workflowIds = segment.workflows.map((workflow) => workflow.id);
    if (!!workflowIds?.length) {
      await prisma.workflow.updateMany({
        where: {
          id: { in: workflowIds },
          status: "inProgress",
        },
        data: {
          status: "paused",
        },
      });
    }

    segmentCache.revalidate({ id: segmentId, environmentId: segment.environmentId });
    segment.workflows.map((workflow) => workflowCache.revalidate({ id: workflow.id }));

    workflowCache.revalidate({ environmentId: currentSegment.environmentId });

    return transformPrismaSegment(segment);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const cloneSegment = async (segmentId: string, workflowId: string): Promise<TSegment> => {
  validateInputs([segmentId, ZId], [workflowId, ZId]);

  try {
    const segment = await getSegment(segmentId);
    if (!segment) {
      throw new ResourceNotFoundError("segment", segmentId);
    }

    const allSegments = await getSegments(segment.environmentId);

    // Find the last "Copy of" title and extract the number from it
    const lastCopyTitle = allSegments
      .map((existingSegment) => existingSegment.title)
      .filter((title) => title.startsWith(`Copy of ${segment.title}`))
      .pop();

    let suffix = 1;
    if (lastCopyTitle) {
      const match = lastCopyTitle.match(/\((\d+)\)$/);
      if (match) {
        suffix = parseInt(match[1], 10) + 1;
      }
    }

    // Construct the title for the cloned segment
    const clonedTitle = `Copy of ${segment.title} (${suffix})`;

    // parse the filters and update the user segment
    const parsedFilters = ZSegmentFilters.safeParse(segment.filters);
    if (!parsedFilters.success) {
      throw new ValidationError("Invalid filters");
    }

    const clonedSegment = await prisma.segment.create({
      data: {
        title: clonedTitle,
        description: segment.description,
        isPrivate: segment.isPrivate,
        environmentId: segment.environmentId,
        filters: segment.filters,
        workflows: {
          connect: {
            id: workflowId,
          },
        },
      },
      select: selectSegment,
    });

    segmentCache.revalidate({ id: clonedSegment.id, environmentId: clonedSegment.environmentId });
    workflowCache.revalidate({ id: workflowId });

    return transformPrismaSegment(clonedSegment);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getSegmentsByAttributeClassName = (environmentId: string, attributeClassName: string) =>
  cache(
    async () => {
      validateInputs([environmentId, ZId], [attributeClassName, ZString]);

      try {
        const segments = await prisma.segment.findMany({
          where: {
            environmentId,
          },
          select: selectSegment,
        });

        // search for attributeClassName in the filters
        const clonedSegments = structuredClone(segments);

        const filteredSegments = clonedSegments.filter((segment) => {
          return searchForAttributeClassNameInSegment(segment.filters, attributeClassName);
        });

        return filteredSegments;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getSegmentsByAttributeClassName-${environmentId}-${attributeClassName}`],
    {
      tags: [
        segmentCache.tag.byEnvironmentId(environmentId),
        segmentCache.tag.byAttributeClassName(attributeClassName),
      ],
    }
  )();

export const resetSegmentInWorkflow = async (workflowId: string): Promise<TSegment> => {
  validateInputs([workflowId, ZId]);

  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    throw new ResourceNotFoundError("workflow", workflowId);
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // for this workflow, does a private segment already exist
      const segment = await tx.segment.findFirst({
        where: {
          title: `${workflowId}`,
          isPrivate: true,
        },
        select: selectSegment,
      });

      // if a private segment already exists, connect it to the workflow
      if (segment) {
        await tx.workflow.update({
          where: { id: workflowId },
          data: { segment: { connect: { id: segment.id } } },
        });

        // reset the filters
        const updatedSegment = await tx.segment.update({
          where: { id: segment.id },
          data: { filters: [] },
          select: selectSegment,
        });

        workflowCache.revalidate({ id: workflowId });
        segmentCache.revalidate({ environmentId: workflow.environmentId });

        return transformPrismaSegment(updatedSegment);
      } else {
        // This case should never happen because a private segment with the title of the workflowId
        // should always exist. But, handling it just in case.

        // if a private segment does not exist, create one
        const newPrivateSegment = await tx.segment.create({
          data: {
            title: `${workflowId}`,
            isPrivate: true,
            filters: [],
            workflows: { connect: { id: workflowId } },
            environment: { connect: { id: workflow?.environmentId } },
          },
          select: selectSegment,
        });

        workflowCache.revalidate({ id: workflowId });
        segmentCache.revalidate({ environmentId: workflow.environmentId });

        return transformPrismaSegment(newPrivateSegment);
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

const evaluateAttributeFilter = (
  attributes: TEvaluateSegmentUserAttributeData,
  filter: TSegmentAttributeFilter
): boolean => {
  const { value, qualifier, root } = filter;
  const { attributeClassName } = root;

  const attributeValue = attributes[attributeClassName];
  if (!attributeValue) {
    return false;
  }

  const attResult = compareValues(attributeValue, value, qualifier.operator);
  return attResult;
};

const evaluatePersonFilter = (userId: string, filter: TSegmentPersonFilter): boolean => {
  const { value, qualifier, root } = filter;
  const { personIdentifier } = root;

  if (personIdentifier === "userId") {
    const attResult = compareValues(userId, value, qualifier.operator);
    return attResult;
  }

  return false;
};

const getResolvedActionValue = async (actionClassId: string, personId: string, metric: TActionMetric) => {
  if (metric === "lastQuarterCount") {
    const lastQuarterCount = await getActionCountInLastQuarter(actionClassId, personId);
    return lastQuarterCount;
  }

  if (metric === "lastMonthCount") {
    const lastMonthCount = await getActionCountInLastMonth(actionClassId, personId);
    return lastMonthCount;
  }

  if (metric === "lastWeekCount") {
    const lastWeekCount = await getActionCountInLastWeek(actionClassId, personId);
    return lastWeekCount;
  }

  if (metric === "lastOccurranceDaysAgo") {
    const lastOccurranceDaysAgo = await getLastOccurrenceDaysAgo(actionClassId, personId);
    return lastOccurranceDaysAgo;
  }

  if (metric === "firstOccurranceDaysAgo") {
    const firstOccurranceDaysAgo = await getFirstOccurrenceDaysAgo(actionClassId, personId);
    return firstOccurranceDaysAgo;
  }

  if (metric === "occuranceCount") {
    const occuranceCount = await getTotalOccurrencesForAction(actionClassId, personId);
    return occuranceCount;
  }
};

const evaluateActionFilter = async (
  actionClassIds: string[],
  filter: TSegmentActionFilter,
  personId: string
): Promise<boolean> => {
  const { value, qualifier, root } = filter;
  const { actionClassId } = root;
  const { metric } = qualifier;

  // there could be a case when the actionIds do not have the actionClassId
  // in such a case, we return false

  const actionClassIdIndex = actionClassIds.findIndex((actionId) => actionId === actionClassId);
  if (actionClassIdIndex === -1) {
    return false;
  }

  try {
    // we have the action metric and we'll need to find out the values for those metrics from the db
    const actionValue = await getResolvedActionValue(actionClassId, personId, metric);

    const actionResult =
      actionValue !== undefined && compareValues(actionValue ?? 0, value, qualifier.operator);

    return actionResult;
  } catch (error) {
    throw error;
  }
};

const evaluateSegmentFilter = async (
  userData: TEvaluateSegmentUserData,
  filter: TSegmentSegmentFilter
): Promise<boolean> => {
  const { qualifier, root } = filter;
  const { segmentId } = root;
  const { operator } = qualifier;

  const segment = await getSegment(segmentId);

  if (!segment) {
    return false;
  }

  const parsedFilters = ZSegmentFilters.safeParse(segment.filters);
  if (!parsedFilters.success) {
    return false;
  }

  const isInSegment = await evaluateSegment(userData, parsedFilters.data);

  if (operator === "userIsIn") {
    return isInSegment;
  }

  if (operator === "userIsNotIn") {
    return !isInSegment;
  }

  return false;
};

const evaluateDeviceFilter = (device: "phone" | "desktop", filter: TSegmentDeviceFilter): boolean => {
  const { value, qualifier } = filter;
  return compareValues(device, value, qualifier.operator);
};

export const compareValues = (
  a: string | number | undefined,
  b: string | number,
  operator: TAllOperators
): boolean => {
  switch (operator) {
    case "equals":
      return a === b;
    case "notEquals":
      return a !== b;
    case "lessThan":
      return (a as number) < (b as number);
    case "lessEqual":
      return (a as number) <= (b as number);
    case "greaterThan":
      return (a as number) > (b as number);
    case "greaterEqual":
      return (a as number) >= (b as number);
    case "isSet":
      return a !== undefined;
    case "isNotSet":
      return a === "" || a === null || a === undefined;
    case "contains":
      return (a as string).includes(b as string);
    case "doesNotContain":
      return !(a as string).includes(b as string);
    case "startsWith":
      return (a as string).startsWith(b as string);
    case "endsWith":
      return (a as string).endsWith(b as string);
    default:
      throw new Error(`Unexpected operator: ${operator}`);
  }
};

type ResultConnectorPair = {
  result: boolean;
  connector: TSegmentConnector;
};

export const evaluateSegment = async (
  userData: TEvaluateSegmentUserData,
  filters: TBaseFilters
): Promise<boolean> => {
  let resultPairs: ResultConnectorPair[] = [];

  try {
    for (let filterItem of filters) {
      const { resource } = filterItem;

      let result: boolean;

      if (isResourceFilter(resource)) {
        const { root } = resource;
        const { type } = root;

        if (type === "attribute") {
          result = evaluateAttributeFilter(userData.attributes, resource as TSegmentAttributeFilter);
          resultPairs.push({
            result,
            connector: filterItem.connector,
          });
        }

        if (type === "person") {
          result = evaluatePersonFilter(userData.userId, resource as TSegmentPersonFilter);
          resultPairs.push({
            result,
            connector: filterItem.connector,
          });
        }

        if (type === "action") {
          result = await evaluateActionFilter(
            userData.actionIds,
            resource as TSegmentActionFilter,
            userData.personId
          );

          resultPairs.push({
            result,
            connector: filterItem.connector,
          });
        }

        if (type === "segment") {
          result = await evaluateSegmentFilter(userData, resource as TSegmentSegmentFilter);
          resultPairs.push({
            result,
            connector: filterItem.connector,
          });
        }

        if (type === "device") {
          result = evaluateDeviceFilter(userData.deviceType, resource as TSegmentDeviceFilter);
          resultPairs.push({
            result,
            connector: filterItem.connector,
          });
        }
      } else {
        result = await evaluateSegment(userData, resource);

        // this is a sub-group and we need to evaluate the sub-group
        resultPairs.push({
          result,
          connector: filterItem.connector,
        });
      }
    }

    if (!resultPairs.length) {
      return false;
    }

    // Given that the first filter in every group/sub-group always has a connector value of "null",
    // we initialize the finalResult with the result of the first filter.

    let finalResult = resultPairs[0].result;

    for (let i = 1; i < resultPairs.length; i++) {
      const { result, connector } = resultPairs[i];

      if (connector === "and") {
        finalResult = finalResult && result;
      } else if (connector === "or") {
        finalResult = finalResult || result;
      }
    }

    return finalResult;
  } catch (error) {
    throw error;
  }
};
