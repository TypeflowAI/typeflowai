import { z } from "zod";

export enum PromptAttributes {
  actAs = "Act as",
  style = "Style",
  tone = "Tone",
  length = "Length",
  language = "Language",
  readerComprehension = "Reader Comprehension",
  outputAs = "Output as",
  formatting = "Formatting",
}

export enum promptActAs {
  ProblemSolver = "Problem Solver",
  CodeGenerator = "Code Generator",
  InformationResearcher = "Information Researcher",
  LanguageTranslator = "Language Translator",
  LearningAssistant = "Learning Assistant",
  CreativeWriter = "Creative Writer",
  DataAnalyzer = "Data Analyzer",
  TechnicalAdvisor = "Technical Advisor",
  HealthAndFitnessGuide = "Health and Fitness Guide",
  TravelPlanner = "Travel Planner",
  EntertainmentRecommender = "Entertainment Recommender",
  CookingAndRecipeAdvisor = "Cooking and Recipe Advisor",
  HistoricalInquirer = "Historical Inquirer",
  FinancialAdvisor = "Financial Advisor",
  Copywriter = "Copywriter",
  MarketingManager = "Marketing Manager",
}

export enum promptStyle {
  Formal = "Formal",
  Informal = "Informal",
  Casual = "Casual",
  Emotional = "Emotional",
  Creative = "Creative",
  Persuasive = "Persuasive",
  Business = "Business",
  Technical = "Technical",
  Legal = "Legal",
  Medical = "Medical",
  Academic = "Academic",
}

export enum promptTone {
  Funny = "Funny",
  Serious = "Serious",
  Friendly = "Friendly",
  Professional = "Professional",
  Empathetic = "Empathetic",
  Confident = "Confident",
  Enthusiastic = "Enthusiastic",
  Assertive = "Assertive",
  Encouraging = "Encouraging",
  Excited = "Excited",
  Witty = "Witty",
  Sympathetic = "Sympathetic",
  Analytical = "Analytical",
  Authoritative = "Authoritative",
  Romantic = "Romantic",
}

export enum promptLanguage {
  Spanish = "Spanish",
  French = "French",
  German = "German",
  Italian = "Italian",
  Arabic = "Arabic",
  Japanese = "Japanese",
  Chinese = "Chinese",
  USEnglish = "US English",
  UKEnglish = "UK English",
  AustralianEnglish = "Australian English",
  NewZealandEnglish = "New Zealand English",
  Irish = "Irish",
  Scottish = "Scottish",
}

export enum promptReaderComprehension {
  Age5Years = "5 years old",
  Age10Years = "10 years old",
  Age25Years = "25 years old",
  Age85Years = "85 years old",
  IQ69 = "IQ 69",
  IQ115 = "IQ 115",
  IQ150 = "IQ 150",
  Beginner = "beginner, assume no prior knowledge",
  Intermediate = "intermediate, assume some prior knowledge",
  Advanced = "advanced, assume extensive prior knowledge",
  PhDGraduate = "PhD Graduate",
  TriplePhDGalacticBrain = "Triple PhD galactic brain",
}

export enum promptLength {
  Characters280 = "280 characters",
  ShortSimpleToPoint = "Short, simple and to the point",
  Paragraph1 = "1 Paragraph",
  Paragraphs3 = "3 Paragraphs",
  Words100 = "100 Words",
  Words300 = "300 Words",
  Words500 = "500 Words",
  Words1000 = "1000 Words",
}

export enum promptOutputAs {
  NumberedList = "Numbered list",
  BulletedList = "Bulleted list",
  BulletedListWithNestedItems = "Bulleted list with nested items",
  TaskList = "Task List",
  MarkdownTable = "Markdown table",
  MarkdownTableWithColumn1Number = "Markdown table with Column 1: Number",
  Blockquote = "Blockquote",
  CodeBlock = "Code block",
  JSON = "JSON",
  YAML = "YAML",
  XML = "XML",
  SQL = "SQL",
}

export enum promptFormatting {
  BoldImportantWords = "Bold the important words",
  OnlyTextNoComments = "Only the text. No comments before and after.",
  HighlightKeyWords = "Highlight key words and phrases",
}

export const ZPromptAttributes = z.object({
  actAs: z.nativeEnum(promptActAs).optional(),
  style: z.nativeEnum(promptStyle).optional(),
  tone: z.nativeEnum(promptTone).optional(),
  language: z.nativeEnum(promptLanguage).optional(),
  readerComprehension: z.nativeEnum(promptReaderComprehension).optional(),
  length: z.nativeEnum(promptLength).optional(),
  outputAs: z.nativeEnum(promptOutputAs).optional(),
  formatting: z.nativeEnum(promptFormatting).optional(),
});
