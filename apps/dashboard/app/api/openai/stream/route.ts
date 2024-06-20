import { createOpenAIStreamMessage } from "@typeflowai/lib/openai/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { updateTeam } from "@typeflowai/lib/team/service";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req: Request): Promise<Response> {
  const { environmentId, openAIRequest } = await req.json();

  if (!environmentId) {
    return new Response("environmentId is required");
  }

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    return new Response("Team does not exist");
  }

  if (!openAIRequest) {
    return new Response("OpenAI Request is required");
  }

  try {
    if (team.billing.features.ai.unlimited) {
      const result = await createOpenAIStreamMessage(team.id, openAIRequest);
      return result;
    }

    if (team.billing.features.ai.responses !== null && team.billing.features.ai.responses > 0) {
      const updatedCount = team.billing.features.ai.responses - 1;
      await updateTeam(team.id, {
        billing: {
          ...team.billing,
          features: {
            ...team.billing.features,
            ai: { ...team.billing.features.ai, responses: updatedCount },
          },
        },
      });
      const result = await createOpenAIStreamMessage(team.id, openAIRequest);
      return result;
    } else {
      return new Response(
        JSON.stringify({
          limitReached: true,
          message: "No AI responses left for this team",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.log("err", err);
    return err;
  }
}
