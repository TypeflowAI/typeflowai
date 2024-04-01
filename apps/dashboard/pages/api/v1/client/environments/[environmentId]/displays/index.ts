import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@typeflowai/database";
import { capturePosthogEvent } from "@typeflowai/lib/posthogServer";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const environmentId = req.query.environmentId?.toString();

  if (!environmentId) {
    return res.status(400).json({ message: "Missing environmentId" });
  }

  // CORS
  if (req.method === "OPTIONS") {
    res.status(200).end();
  }

  // POST
  else if (req.method === "POST") {
    const { workflowId, personId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ message: "Missing workflowId" });
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

    const createBody: any = {
      select: {
        id: true,
      },
      data: {
        workflow: {
          connect: {
            id: workflowId,
          },
        },
      },
    };

    if (personId) {
      createBody.data.person = {
        connect: {
          id: personId,
        },
      };
    }

    // create new display
    const displayData = await prisma.display.create(createBody);

    if (teamOwnerId) {
      await capturePosthogEvent(teamOwnerId, "display created", teamId, {
        workflowId,
      });
    } else {
      console.warn("Posthog capture not possible. No team owner found");
    }

    return res.json(displayData);
  }

  // Unknown HTTP Method
  else {
    throw new Error(`The HTTP ${req.method} method is not supported by this route.`);
  }
}
