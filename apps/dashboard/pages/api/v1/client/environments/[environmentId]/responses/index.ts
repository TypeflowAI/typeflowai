import { sendToPipeline } from "@/app/lib/pipelines";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@typeflowai/database";
import { transformPrismaPerson } from "@typeflowai/lib/person/service";
import { capturePosthogEvent } from "@typeflowai/lib/posthogServer";
import { captureTelemetry } from "@typeflowai/lib/telemetry";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const environmentId = req.query.environmentId?.toString();

  if (!environmentId) {
    return res.status(400).json({ message: "Missing environmentId" });
  }

  // CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // POST
  else if (req.method === "POST") {
    const { workflowId, personId, response } = req.body;

    if (!workflowId) {
      return res.status(400).json({ message: "Missing workflowId" });
    }
    if (!response) {
      return res.status(400).json({ message: "Missing data" });
    }
    // personId can be null, e.g. for link workflows

    // check if workflow exists
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // get teamId from environment
    const environment = await prisma.environment.findUnique({
      where: {
        id: environmentId,
      },
      select: {
        product: {
          select: {
            team: {
              select: {
                id: true,
                memberships: {
                  select: {
                    userId: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!environment) {
      return res.status(404).json({ message: "Environment not found" });
    }

    const teamId = environment.product.team.id;
    // find team owner
    const teamOwnerId = environment.product.team.memberships.find((m) => m.role === "owner")?.userId;

    const responseInput = {
      workflow: {
        connect: {
          id: workflowId,
        },
      },
      ...response,
    };

    if (personId) {
      responseInput.data.person = {
        connect: {
          id: personId,
        },
      };
    }

    // create new response
    const responsePrisma = await prisma.response.create({
      data: {
        ...responseInput,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        workflowId: true,
        finished: true,
        data: true,
        ttc: true,
        meta: true,
        personAttributes: true,
        singleUseId: true,
        person: {
          select: {
            id: true,
            userId: true,
            environmentId: true,
            createdAt: true,
            updatedAt: true,
            attributes: {
              select: {
                value: true,
                attributeClass: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        notes: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            text: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            isResolved: true,
            isEdited: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                name: true,
                environmentId: true,
              },
            },
          },
        },
      },
    });

    const responseData: TResponse = {
      ...responsePrisma,
      person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
      tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
    };

    // send response to pipeline
    // don't await to not block the response
    sendToPipeline({
      environmentId,
      workflowId,
      event: "responseCreated",
      response: responseData,
    });

    if (response.finished) {
      // send response to pipeline
      // don't await to not block the response
      sendToPipeline({
        environmentId,
        workflowId,
        event: "responseFinished",
        response: responseData,
      });
    }

    captureTelemetry("response created");
    if (teamOwnerId) {
      await capturePosthogEvent(teamOwnerId, "response created", teamId, {
        workflowId,
        workflowType: workflow.type,
      });
    } else {
      console.warn("Posthog capture not possible. No team owner found");
    }

    return res.json({ id: responseData.id });
  }

  // Unknown HTTP Method
  else {
    throw new Error(`The HTTP ${req.method} method is not supported by this route.`);
  }
}
