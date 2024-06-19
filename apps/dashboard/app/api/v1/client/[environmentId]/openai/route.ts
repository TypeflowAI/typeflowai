// import { responses } from "@/app/lib/api/response";
// import { NextRequest } from "next/server";
import { createOpenAIMessage } from "@typeflowai/lib/openai/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { updateTeam } from "@typeflowai/lib/team/service";

// export async function POST(req: NextRequest): Promise<Response> {
export async function POST(req: Request): Promise<Response> {
  const { environmentId, openAIRequest } = await req.json();

  if (!environmentId) {
    // return responses.badRequestResponse("environmentId is required");
    return new Response("EnvironmentId is required");
  }

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    // return responses.badRequestResponse("Team does not exist");
    return new Response("Team does not exist");
  }

  if (!openAIRequest) {
    // return responses.badRequestResponse("OpenAI Request is required");
    return new Response("OpenAI Request is required");
  }

  try {
    if (team.billing.features.ai.unlimited) {
      const result = await createOpenAIMessage(team.id, openAIRequest);
      // return responses.successResponse(result);
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
      const result = await createOpenAIMessage(team.id, openAIRequest);
      // return responses.successResponse(result);
      return result;
    } else {
      // return responses.successResponse({
      //   limitReached: true,
      //   message: "No AI responses left for this team",
      // });
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
    // return responses.internalServerErrorResponse("Something went wrong getting OpenAI API response");
    console.log("err", err);
    return err;
  }
}
