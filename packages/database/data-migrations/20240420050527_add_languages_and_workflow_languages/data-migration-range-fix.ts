// migration script to convert range field in rating question from string to number
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(
    async (tx) => {
      const workflows = await tx.workflow.findMany({
        select: {
          id: true,
          questions: true,
        },
      });

      if (workflows.length === 0) {
        // stop the migration if there are no workflows
        return;
      }

      for (const workflow of workflows) {
        let updateNeeded = false;
        const updatedWorkflow = structuredClone(workflow) as any;
        if (updatedWorkflow.questions.length > 0) {
          for (const question of updatedWorkflow.questions) {
            if (question.type === "rating" && typeof question.range === "string") {
              const parsedRange = parseInt(question.range);
              if (!isNaN(parsedRange)) {
                updateNeeded = true;
                question.range = parsedRange;
              } else {
                throw new Error(`Invalid range value for question Id ${question.id}: ${question.range}`);
              }
            }
          }
        }
        if (updateNeeded) {
          // Save the translated workflow
          await tx.workflow.update({
            where: { id: workflow.id },
            data: { ...updatedWorkflow },
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
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
