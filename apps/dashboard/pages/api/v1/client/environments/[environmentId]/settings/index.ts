import { getSettings } from "@/app/lib/api/clientSettings";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const environmentId = req.query.environmentId?.toString();

  if (!environmentId) {
    return res.status(400).json({ message: "Missing environmentId" });
  }

  // CORS
  if (req.method === "OPTIONS") {
    res.status(200).end();
  }
  // GET
  else if (req.method === "POST") {
    const { personId } = req.body;

    if (!personId) {
      return res.status(400).json({ message: "Missing sessionId" });
    }

    const settings = await getSettings(environmentId, personId);

    return res.json(settings);
  }

  // Unknown HTTP Method
  else {
    throw new Error(`The HTTP ${req.method} method is not supported by this route.`);
  }
}
