import { cache } from "@typeflowai/lib/cache";
import { capturePosthogEnvironmentEvent } from "@typeflowai/lib/posthogServer";

export const sendFreeLimitReachedEventToPosthogBiWeekly = (
  environmentId: string,
  plan: "inAppWorkflow" | "userTargeting"
): Promise<string> =>
  cache(
    async () => {
      try {
        await capturePosthogEnvironmentEvent(environmentId, "free limit reached", {
          plan,
        });
        return "success";
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [`sendFreeLimitReachedEventToPosthogBiWeekly-${plan}-${environmentId}`],
    {
      revalidate: 60 * 60 * 24 * 15, // 15 days
    }
  )();
