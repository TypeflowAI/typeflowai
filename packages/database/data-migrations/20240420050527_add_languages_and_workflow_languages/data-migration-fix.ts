// migration script to translate workflows where thankYouCard buttonLabel is a string or question subheaders are strings
import { PrismaClient } from "@prisma/client";

import { hasStringSubheaders, translateWorkflow } from "./lib/i18n";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(
    async (tx) => {
      // Translate Workflows
      const workflows = await tx.workflow.findMany({
        select: {
          id: true,
          questions: true,
          thankYouCard: true,
          welcomeCard: true,
        },
      });

      if (!workflows) {
        // stop the migration if there are no workflows
        return;
      }

      for (const workflow of workflows) {
        if (
          typeof workflow.thankYouCard.buttonLabel === "string" ||
          hasStringSubheaders(workflow.questions)
        ) {
          const translatedWorkflow = translateWorkflow(workflow, []);

          // Save the translated workflow
          await tx.workflow.update({
            where: { id: workflow.id },
            data: { ...translatedWorkflow },
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
