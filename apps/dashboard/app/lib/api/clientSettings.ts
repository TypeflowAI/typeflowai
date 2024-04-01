import { prisma } from "@typeflowai/database";
import { TSettings } from "@typeflowai/types/js";

export const getSettings = async (environmentId: string, personId: string): Promise<TSettings> => {
  // get recontactDays from product
  const product = await prisma.product.findFirst({
    where: {
      environments: {
        some: {
          id: environmentId,
        },
      },
    },
    select: {
      recontactDays: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const person = await prisma.person.findUnique({
    where: {
      id: personId,
    },
    select: {
      attributes: {
        select: {
          id: true,
          value: true,
          attributeClassId: true,
        },
      },
    },
  });

  if (!person) {
    throw new Error("Person not found");
  }

  // get all workflows that meet the displayOption criteria
  const potentialWorkflows = await prisma.workflow.findMany({
    where: {
      OR: [
        {
          environmentId,
          type: "web",
          status: "inProgress",
          displayOption: "respondMultiple",
        },
        {
          environmentId,
          type: "web",
          status: "inProgress",
          displayOption: "displayOnce",
          displays: { none: { personId } },
        },
        {
          environmentId,
          type: "web",
          status: "inProgress",
          displayOption: "displayMultiple",
          displays: { none: { personId, status: "responded" } },
        },
      ],
    },
    select: {
      id: true,
      questions: true,
      recontactDays: true,
      triggers: {
        select: {
          id: true,
          actionClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        // last display
      },
      attributeFilters: {
        select: {
          id: true,
          condition: true,
          value: true,
          attributeClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      displays: {
        where: {
          personId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          createdAt: true,
        },
      },
      thankYouCard: true,
      welcomeCard: true,
      autoClose: true,
      delay: true,
    },
  });

  // get last display for this person
  const lastDisplayPerson = await prisma.display.findFirst({
    where: {
      personId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
    },
  });

  // filter workflows that meet the attributeFilters criteria
  const potentialWorkflowsWithAttributes = potentialWorkflows.filter((workflow) => {
    const attributeFilters = workflow.attributeFilters;
    if (attributeFilters.length === 0) {
      return true;
    }
    // check if meets all attribute filters criterias
    return attributeFilters.every((attributeFilter) => {
      const attribute = person.attributes.find(
        (attribute) => attribute.attributeClassId === attributeFilter.attributeClass.id
      );
      if (attributeFilter.condition === "equals") {
        return attribute?.value === attributeFilter.value;
      } else if (attributeFilter.condition === "notEquals") {
        return attribute?.value !== attributeFilter.value;
      } else {
        throw Error("Invalid attribute filter condition");
      }
    });
  });

  // filter workflows that meet the recontactDays criteria
  const workflows = potentialWorkflowsWithAttributes
    .filter((workflow) => {
      if (!lastDisplayPerson) {
        // no display yet - always display
        return true;
      } else if (workflow.recontactDays !== null) {
        // if recontactDays is set on workflow, use that
        const lastDisplayWorkflow = workflow.displays[0];
        if (!lastDisplayWorkflow) {
          // no display yet - always display
          return true;
        }
        const lastDisplayDate = new Date(lastDisplayWorkflow.createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - lastDisplayDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= workflow.recontactDays;
      } else if (product.recontactDays !== null) {
        // if recontactDays is not set in workflow, use product recontactDays
        const lastDisplayDate = new Date(lastDisplayPerson.createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - lastDisplayDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= product.recontactDays;
      } else {
        // if recontactDays is not set in workflow or product, always display
        return true;
      }
    })
    .map((workflow) => {
      return {
        id: workflow.id,
        questions: JSON.parse(JSON.stringify(workflow.questions)),
        triggers: workflow.triggers.map((trigger) => trigger.actionClass.name),
        thankYouCard: JSON.parse(JSON.stringify(workflow.thankYouCard)),
        welcomeCard: JSON.parse(JSON.stringify(workflow.welcomeCard)),
        autoClose: workflow.autoClose,
        delay: workflow.delay,
      };
    });

  const noCodeEvents = await prisma.actionClass.findMany({
    where: {
      environmentId,
      type: "noCode",
    },
    select: {
      name: true,
      noCodeConfig: true,
    },
  });

  const environmentProdut = await prisma.environment.findUnique({
    where: {
      id: environmentId,
    },
    select: {
      product: {
        select: {
          brandColor: true,
          linkWorkflowBranding: true,
          placement: true,
          darkOverlay: true,
          clickOutsideClose: true,
        },
      },
    },
  });

  const typeflowaiSignature = environmentProdut?.product.linkWorkflowBranding;
  const brandColor = environmentProdut?.product.brandColor;
  const placement = environmentProdut?.product.placement;
  const darkOverlay = environmentProdut?.product.darkOverlay;
  const clickOutsideClose = environmentProdut?.product.clickOutsideClose;

  return {
    workflows,
    noCodeEvents,
    brandColor,
    typeflowaiSignature,
    placement,
    darkOverlay,
    clickOutsideClose,
  };
};
