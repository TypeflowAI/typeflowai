import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(
    async (tx) => {
      // Retrieve all workflows of type "web" with necessary fields for efficient processing
      const webWorkflows = await tx.workflow.findMany({
        where: { type: "web" },
        select: {
          id: true,
          segment: {
            select: {
              id: true,
              isPrivate: true,
            },
          },
        },
      });

      const linkWorkflowsWithSegment = await tx.workflow.findMany({
        where: {
          type: "link",
          segmentId: {
            not: null,
          },
        },
        include: {
          segment: true,
        },
      });

      const updateOperations = [];
      const segmentDeletionIds = [];
      const workflowTitlesForDeletion = [];

      if (webWorkflows?.length > 0) {
        for (const webWorkflow of webWorkflows) {
          const latestResponse = await tx.response.findFirst({
            where: { workflowId: webWorkflow.id },
            orderBy: { createdAt: "desc" },
            select: { personId: true },
          });

          const newType = latestResponse?.personId ? "app" : "website";
          updateOperations.push(
            tx.workflow.update({
              where: { id: webWorkflow.id },
              data: { type: newType },
            })
          );

          if (newType === "website") {
            if (webWorkflow.segment) {
              if (webWorkflow.segment.isPrivate) {
                segmentDeletionIds.push(webWorkflow.segment.id);
              } else {
                updateOperations.push(
                  tx.workflow.update({
                    where: { id: webWorkflow.id },
                    data: {
                      segment: { disconnect: true },
                    },
                  })
                );
              }
            }

            workflowTitlesForDeletion.push(webWorkflow.id);
          }
        }

        await Promise.all(updateOperations);

        if (segmentDeletionIds.length > 0) {
          await tx.segment.deleteMany({
            where: {
              id: { in: segmentDeletionIds },
            },
          });
        }

        if (workflowTitlesForDeletion.length > 0) {
          await tx.segment.deleteMany({
            where: {
              title: { in: workflowTitlesForDeletion },
              isPrivate: true,
            },
          });
        }
      }

      if (linkWorkflowsWithSegment?.length > 0) {
        const linkWorkflowSegmentDeletionIds = [];
        const linkWorkflowSegmentUpdateOperations = [];

        for (const linkWorkflow of linkWorkflowsWithSegment) {
          const { segment } = linkWorkflow;
          if (segment) {
            linkWorkflowSegmentUpdateOperations.push(
              tx.workflow.update({
                where: {
                  id: linkWorkflow.id,
                },
                data: {
                  segment: {
                    disconnect: true,
                  },
                },
              })
            );

            if (segment.isPrivate) {
              linkWorkflowSegmentDeletionIds.push(segment.id);
            }
          }
        }

        await Promise.all(linkWorkflowSegmentUpdateOperations);

        if (linkWorkflowSegmentDeletionIds.length > 0) {
          await tx.segment.deleteMany({
            where: {
              id: { in: linkWorkflowSegmentDeletionIds },
            },
          });
        }
      }
    },
    {
      timeout: 50000,
    }
  );
}

main()
  .catch((e: Error) => {
    console.error("Error during migration: ", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
