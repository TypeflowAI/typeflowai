import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@typeflowai/database";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const workflowId = req.query.workflowId?.toString();

  if (!workflowId) {
    return res.status(400).json({ message: "Missing workflowId" });
  }

  // CORS
  if (req.method === "OPTIONS") {
    res.status(200).end();
  }
  // GET
  else if (req.method === "GET") {
    // get workflow
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
        type: "link",
        // status: "inProgress",
      },
      select: {
        id: true,
        questions: true,
        thankYouCard: true,
        environmentId: true,
        status: true,
        redirectUrl: true,
        workflowClosedMessage: true,
      },
    });

    // if workflow does not exist, return 404
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // get brandColor from product using environmentId
    const product = await prisma.product.findFirst({
      where: {
        environments: {
          some: {
            id: workflow.environmentId,
          },
        },
      },
      select: {
        brandColor: true,
        linkWorkflowBranding: true,
      },
    });

    if (workflow.status !== "inProgress") {
      return res.status(403).json({
        message: "Workflow not running",
        reason: workflow.status,
        brandColor: product?.brandColor,
        typeflowaiSignature: product?.linkWorkflowBranding,
        workflowClosedMessage: workflow?.workflowClosedMessage,
      });
    }

    // if workflow exists, return workflow
    return res.status(200).json({
      ...workflow,
      brandColor: product?.brandColor,
      typeflowaiSignature: product?.linkWorkflowBranding,
    });
  }

  // Unknown HTTP Method
  else {
    throw new Error(`The HTTP ${req.method} method is not supported by this route.`);
  }
}
