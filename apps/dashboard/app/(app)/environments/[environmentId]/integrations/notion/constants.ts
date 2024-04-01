import { TWorkflowQuestionType } from "@typeflowai/types/workflows";

export const TYPE_MAPPING = {
  [TWorkflowQuestionType.CTA]: ["checkbox"],
  [TWorkflowQuestionType.MultipleChoiceMulti]: ["multi_select"],
  [TWorkflowQuestionType.MultipleChoiceSingle]: ["select", "status"],
  [TWorkflowQuestionType.OpenText]: [
    "created_by",
    "created_time",
    "date",
    "email",
    "last_edited_by",
    "last_edited_time",
    "number",
    "phone_number",
    "rich_text",
    "title",
    "url",
  ],
  [TWorkflowQuestionType.NPS]: ["number"],
  [TWorkflowQuestionType.Consent]: ["checkbox"],
  [TWorkflowQuestionType.Rating]: ["number"],
  [TWorkflowQuestionType.PictureSelection]: ["url"],
  [TWorkflowQuestionType.FileUpload]: ["url"],
};

export const UNSUPPORTED_TYPES_BY_NOTION = [
  "rollup",
  "created_by",
  "created_time",
  "last_edited_by",
  "last_edited_time",
];

export const ERRORS = {
  MAPPING: "Mapping Error",
  UNSUPPORTED_TYPE: "Unsupported type by Notion",
};
