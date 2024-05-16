import { PrismaClient } from "@prisma/client";
import { AttributeType } from "@prisma/client";

import { translateWorkflow } from "./lib/i18n";

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
        if (workflow.questions.length > 0 && typeof workflow.questions[0].headline === "string") {
          const translatedWorkflow = translateWorkflow(workflow, []);

          // Save the translated workflow
          await tx.workflow.update({
            where: { id: workflow.id },
            data: { ...translatedWorkflow },
          });
        }
      }

      // Add language attributeClass
      const environments = await tx.environment.findMany({
        select: {
          id: true,
          attributeClasses: true,
        },
      });

      if (!environments) {
        // stop the migration if there are no environments
        return;
      }

      for (const environment of environments) {
        const languageAttributeClass = environment.attributeClasses.find((attributeClass) => {
          return attributeClass.name === "language";
        });
        if (languageAttributeClass) {
          // Update existing attributeClass if needed
          if (
            languageAttributeClass.type === AttributeType.automatic &&
            languageAttributeClass.description === "The language used by the person"
          ) {
            continue;
          }

          await tx.attributeClass.update({
            where: { id: languageAttributeClass.id },
            data: {
              type: AttributeType.automatic,
              description: "The language used by the person",
            },
          });
        } else {
          // Create new attributeClass
          await tx.attributeClass.create({
            data: {
              name: "language",
              type: AttributeType.automatic,
              description: "The language used by the person",
              environment: {
                connect: { id: environment.id },
              },
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
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
