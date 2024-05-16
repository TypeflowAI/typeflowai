import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";

import {
  TBaseFilter,
  TBaseFilters,
  TSegmentAttributeFilter,
  TSegmentPersonFilter,
} from "@typeflowai/types/segment";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const allWorkflowsWithAttributeFilters = await prisma.workflow.findMany({
      where: {
        attributeFilters: {
          some: {},
        },
      },
      include: {
        attributeFilters: { include: { attributeClass: true } },
      },
    });

    if (!allWorkflowsWithAttributeFilters?.length) {
      // stop the migration if there are no workflows with attribute filters
      return;
    }

    allWorkflowsWithAttributeFilters.forEach(async (workflow) => {
      const { attributeFilters } = workflow;
      // if there are no attribute filters, we can skip this workflow
      if (!attributeFilters?.length) {
        return;
      }
      // from these attribute filters, we need to create user segments
      // each attribute filter will be a filter in the user segment
      // all the filters will be joined by AND
      // the user segment will be private

      const filters: TBaseFilters = attributeFilters.map((filter, idx) => {
        const { attributeClass } = filter;
        let resource: TSegmentAttributeFilter | TSegmentPersonFilter;
        // if the attribute class is userId, we need to create a user segment with the person filter
        if (attributeClass.name === "userId" && attributeClass.type === "automatic") {
          resource = {
            id: createId(),
            root: {
              type: "person",
              personIdentifier: "userId",
            },
            qualifier: {
              operator: filter.condition,
            },
            value: filter.value,
          };
        } else {
          resource = {
            id: createId(),
            root: {
              type: "attribute",
              attributeClassName: attributeClass.name,
            },
            qualifier: {
              operator: filter.condition,
            },
            value: filter.value,
          };
        }

        const attributeSegment: TBaseFilter = {
          id: filter.id,
          connector: idx === 0 ? null : "and",
          resource,
        };

        return attributeSegment;
      });

      await tx.segment.create({
        data: {
          title: `${workflow.id}`,
          description: "",
          isPrivate: true,
          filters,
          workflows: {
            connect: {
              id: workflow.id,
            },
          },
          environment: {
            connect: {
              id: workflow.environmentId,
            },
          },
        },
      });
    });

    // delete all attribute filters
    await tx.workflowAttributeFilter.deleteMany({});
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
