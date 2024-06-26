import { z } from "zod";
import { ZColor } from "./common";

export const ZStylingColor = z.object({
  light: ZColor,
  dark: ZColor.nullish(),
});
export type TStylingColor = z.infer<typeof ZStylingColor>;

export const ZCardSizeOptions = z.enum(["small", "regular", "large"]);
export type TCardSizeOptions = z.infer<typeof ZCardSizeOptions>;

export const ZCardArrangementOptions = z.enum(["casual", "straight", "simple"]);
export type TCardArrangementOptions = z.infer<typeof ZCardArrangementOptions>;

export const ZCardArrangement = z.object({
  linkWorkflows: ZCardArrangementOptions,
  appWorkflows: ZCardArrangementOptions,
});

export const ZCardSize = z.object({
  linkWorkflows: ZCardSizeOptions,
  appWorkflows: ZCardSizeOptions,
});

export const ZWorkflowStylingBackground = z
  .object({
    bg: z.string().nullish(),
    bgType: z.enum(["animation", "color", "image", "upload"]).nullish(),
    brightness: z.number().nullish(),
  })
  .refine(
    (workflowBackground) => {
      if (workflowBackground.bgType === "upload") {
        return !!workflowBackground.bg;
      }

      return true;
    },
    { message: "Invalid background" }
  );

export type TWorkflowStylingBackground = z.infer<typeof ZWorkflowStylingBackground>;

export const ZBaseStyling = z.object({
  brandColor: ZStylingColor.nullish(),
  questionColor: ZStylingColor.nullish(),
  inputColor: ZStylingColor.nullish(),
  inputBorderColor: ZStylingColor.nullish(),
  cardBackgroundColor: ZStylingColor.nullish(),
  cardBorderColor: ZStylingColor.nullish(),
  cardShadowColor: ZStylingColor.nullish(),
  highlightBorderColor: ZStylingColor.nullish(),
  isDarkModeEnabled: z.boolean().nullish(),
  roundness: z.number().nullish(),
  cardSize: ZCardSize.nullish(),
  cardArrangement: ZCardArrangement.nullish(),
  background: ZWorkflowStylingBackground.nullish(),
  hideProgressBar: z.boolean().nullish(),
  isLogoHidden: z.boolean().nullish(),
});

export type TBaseStyling = z.infer<typeof ZBaseStyling>;
