import { TWorkflowQuestionTypeEnum } from "@typeflowai/types/workflows";

export const TYPE_MAPPING = {
  [TWorkflowQuestionTypeEnum.CTA]: ["checkbox"],
  [TWorkflowQuestionTypeEnum.MultipleChoiceMulti]: ["multi_select"],
  [TWorkflowQuestionTypeEnum.MultipleChoiceSingle]: ["select", "status"],
  [TWorkflowQuestionTypeEnum.OpenText]: [
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
  [TWorkflowQuestionTypeEnum.NPS]: ["number"],
  [TWorkflowQuestionTypeEnum.Consent]: ["checkbox"],
  [TWorkflowQuestionTypeEnum.Rating]: ["number"],
  [TWorkflowQuestionTypeEnum.PictureSelection]: ["url"],
  [TWorkflowQuestionTypeEnum.FileUpload]: ["url"],
  [TWorkflowQuestionTypeEnum.Date]: ["date"],
  [TWorkflowQuestionTypeEnum.Address]: ["rich_text"],
  [TWorkflowQuestionTypeEnum.Matrix]: ["rich_text"],
  [TWorkflowQuestionTypeEnum.Cal]: ["checkbox"],
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
