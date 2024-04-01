import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowHiddenFields,
  TWorkflowQuestionType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import automationIcon from "@typeflowai/ui/icons/templates/automation.svg";
import benefitsIcon from "@typeflowai/ui/icons/templates/benefits.svg";
import bonusIcon from "@typeflowai/ui/icons/templates/bonus.svg";
import complianceIcon from "@typeflowai/ui/icons/templates/compliance.svg";
import computerIcon from "@typeflowai/ui/icons/templates/computer.svg";
import cultureIcon from "@typeflowai/ui/icons/templates/culture.svg";
import descriptionIcon from "@typeflowai/ui/icons/templates/description.svg";
import diversityIcon from "@typeflowai/ui/icons/templates/diversity.svg";
import documentIcon from "@typeflowai/ui/icons/templates/document.svg";
import employeeTrainerIcon from "@typeflowai/ui/icons/templates/employee-trainer.svg";
import exitIcon from "@typeflowai/ui/icons/templates/exit.svg";
import formIcon from "@typeflowai/ui/icons/templates/form.svg";
import goalIcon from "@typeflowai/ui/icons/templates/goal.svg";
import growthIcon from "@typeflowai/ui/icons/templates/growth.svg";
import jobIcon from "@typeflowai/ui/icons/templates/job.svg";
import leadershipIcon from "@typeflowai/ui/icons/templates/leadership.svg";
import LearningPathsIcon from "@typeflowai/ui/icons/templates/learning-paths.svg";
import learningIcon from "@typeflowai/ui/icons/templates/learning.svg";
import negotiationIcon from "@typeflowai/ui/icons/templates/negotiation.svg";
import payIcon from "@typeflowai/ui/icons/templates/pay.svg";
import performanceIcon from "@typeflowai/ui/icons/templates/performance.svg";
import phoneIcon from "@typeflowai/ui/icons/templates/phone.svg";
import planIcon from "@typeflowai/ui/icons/templates/plan.svg";
import reportIcon from "@typeflowai/ui/icons/templates/report.svg";
import rewardIcon from "@typeflowai/ui/icons/templates/reward.svg";
import chatbotIcon from "@typeflowai/ui/icons/templates/robot3.svg";
import salaryIcon from "@typeflowai/ui/icons/templates/salary.svg";
import scorecardIcon from "@typeflowai/ui/icons/templates/scorecard.svg";
import selectionIcon from "@typeflowai/ui/icons/templates/selection.svg";
import surveyIcon from "@typeflowai/ui/icons/templates/survey.svg";
import templateIcon from "@typeflowai/ui/icons/templates/template.svg";
import trackingIcon from "@typeflowai/ui/icons/templates/tracking.svg";
import wellnessIcon from "@typeflowai/ui/icons/templates/wellness.svg";
import workforceIcon from "@typeflowai/ui/icons/templates/workforce.svg";
import writeIcon from "@typeflowai/ui/icons/templates/write.svg";

const thankYouCardDefault = {
  enabled: true,
  headline: "Thank you!",
  subheader: "We appreciate your feedback.",
};

const hiddenFieldsDefault: TWorkflowHiddenFields = {
  enabled: true,
  fieldIds: [],
};

const welcomeCardDefault: TWorkflowWelcomeCard = {
  enabled: false,
  headline: "Welcome!",
  html: "Thanks for providing your feedback - let's go!",
  timeToFinish: true,
  showResponseCount: false,
};

export const hrTemplates: TTemplate[] = [
  {
    name: "HR Selection Criteria",
    icon: selectionIcon.src,
    category: "Human Resources",
    subcategory: "HR Technology",
    description: "Identify key features and suggest evaluation criteria.",
    objectives: ["improve_business_strategy", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "HR Selection Criteria",
      welcomeCard: welcomeCardDefault,
      icon: selectionIcon.src,
      questions: [
        {
          id: "hr-need",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's your Hr need?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefit",
          type: TWorkflowQuestionType.OpenText,
          headline: "What benefit do you need?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you suggest key features and capabilities to look for when evaluating HR technologies for @hr-need , and how do they @benefit ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "HR Chatbot",
    icon: chatbotIcon.src,
    category: "Human Resources",
    subcategory: "HR Technology",
    description: "Optimize job candidate sourcing by generating profiles and descriptions.",
    objectives: ["optimize_content_and_seo_strategy", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "HR Chatbot",
      welcomeCard: welcomeCardDefault,
      icon: chatbotIcon.src,
      questions: [
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "required-qualifications",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe the required qualifications",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Generate a list of potential job candidates for an open position in @job-title with @required-qualifications . Include their experience, education, and any relevant skills.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "HR Automation",
    icon: automationIcon.src,
    category: "Human Resources",
    subcategory: "HR Technology",
    description: "Enhance HR automation: job descriptions, onboard and programs.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "HR Automation",
      welcomeCard: welcomeCardDefault,
      icon: automationIcon.src,
      questions: [
        {
          id: "areas",
          type: TWorkflowQuestionType.OpenText,
          headline: "In what areas are you going to implement automation?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        "What are some strategies/tactics we can implement to streamline our HR automation process in @areas ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Team Leadership Programs",
    icon: leadershipIcon.src,
    category: "Human Resources",
    subcategory: "Leadership development",
    description: "Improve team leadership: brainstorm ideas and strategies for effective training.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Team Leadership Programs",
      welcomeCard: welcomeCardDefault,
      icon: leadershipIcon.src,
      questions: [
        {
          id: "department",
          type: TWorkflowQuestionType.OpenText,
          headline: "What department would you like to focus on?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry-niche",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the goal?",
          subheader: "E.g. improving communication, trust, or problem-solving skills",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are some effective team-building activities/icebreakers/exercises that I can include in my leadership program for @department to achieve a @goal ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Leadership Shadowing",
    icon: leadershipIcon.src,
    category: "Human Resources",
    subcategory: "Leadership development",
    description: "Manage leadership shadowing: plan programs and select candidates.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Leadership Shadowing",
      welcomeCard: welcomeCardDefault,
      icon: leadershipIcon.src,
      questions: [
        {
          id: "department",
          type: TWorkflowQuestionType.OpenText,
          headline: "What department would you like to focus on?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the key elements to consider when designing a leadership shadowing program for @department in my company?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Phone screening",
    icon: phoneIcon.src,
    category: "Human Resources",
    subcategory: "Recruiting",
    description: "Streamline phone screenings: ask, capture, and analyze responses.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Phone Screening",
      welcomeCard: welcomeCardDefault,
      icon: phoneIcon.src,
      questions: [
        {
          id: "skill",
          type: TWorkflowQuestionType.OpenText,
          headline: "What skill are you evaluating?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionType.OpenText,
          headline: "What position are you looking for?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me come up with interview questions to evaluate @skill for the @position phone screening?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Job Description Copy",
    icon: descriptionIcon.src,
    category: "Human Resources",
    subcategory: "Recruiting",
    description: "Transform job descriptions into narratives for recruiting.",
    objectives: ["optimize_content_and_seo_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Job Description Copy",
      welcomeCard: welcomeCardDefault,
      icon: descriptionIcon.src,
      questions: [
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "company-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the company size?",
          subheader: "E.g. Small/Medium/Large",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the location?",
          subheader: "E.g. Remote/On-site/Hybrid",
          required: true,
          inputType: "text",
        },
        {
          id: "experience-level",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the experience level?",
          subheader: "E.g. ntry-Level/Mid-Level/Senior",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        Context:
        You are HR Writing Wizard GPT, an AI expert specializing in crafting compelling and detailed job descriptions for various industries. With your expertise, you understand the nuances of different roles and how to attract the right candidates through clear, engaging, and inclusive language.
        
        Goal:
        I need you to create a job description for a position in my company. This job description should be appealing to potential candidates and clearly communicate the requirements and expectations of the role.
        
        Job Description Structure:
        - **Job Title**: Accurately reflects the nature and level of the work.
        - **Company Overview**: A brief but engaging description of the company, its culture, and mission.
        - **Role Summary**: A concise overview of what the job entails and its importance to the company.
        - **Key Responsibilities**: Detailed list of the main duties and tasks.
        - **Required Skills and Qualifications**: Specific skills, experiences, and educational qualifications needed.
        - **Desired Characteristics**: Traits and attributes that would be beneficial in this role.
        - **Benefits and Compensation**: Overview of salary range, benefits, and any unique company perks.
        - **Application Process**: Clear instructions on how to apply and what the process entails.
        - **Equal Opportunity Statement**: Inclusive language ensuring all qualified applicants are encouraged to apply regardless of their background.
        
        Job Description Criteria:
        - **Language**: Use clear, concise, and engaging language.
        - **Inclusivity**: Ensure the language is inclusive and non-discriminatory.
        - **Specificity**: Be specific about role expectations and requirements.
        - **Alignment**: Ensure the job description aligns with the company's culture and values.
        - **Compliance**: Adhere to legal standards and best practices in recruitment.
        - **Optimization**: Include keywords relevant for SEO to make the job description easily searchable.
        
        Information About the Role:
        - **Job Title**: [Your job title here]
        - **Industry**: [Your industry here]
        - **Company Size**: [Small/Medium/Large]
        - **Location**: [Remote/On-site/Hybrid]
        - **Experience Level**: [Entry-Level/Mid-Level/Senior]
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Resume Screening Tool",
    icon: documentIcon.src,
    category: "Human Resources",
    subcategory: "Recruiting",
    description: "Screen resumes of top candidates, saving time and reducing bias.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Resume Screening Tool",
      welcomeCard: welcomeCardDefault,
      icon: documentIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide a list of the top 5 candidates who have the most relevant experience in @industry ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Writing I-9 forms",
    icon: writeIcon.src,
    category: "Human Resources",
    subcategory: "Compliance",
    description: "Generate accurate I-9 Forms based on templates and guidelines.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Writing I-9 forms",
      welcomeCard: welcomeCardDefault,
      icon: writeIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the of the employee?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "hire-date",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the hire date?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "document-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What document they provided?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "issue-date",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the issue date?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "expiration-date",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the expiration date?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I need help with completing Section 1, 2 and 3 of the I-9 Form for @employee-name . The employee is a @job-title and was hired on @hire-date . They have provided @document-type , which was issued on @issue-date , which expires on @expiration-date . Can you guide me on what to do if the employee is unable to provide the required documents?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "OFCCP Compliance",
    icon: complianceIcon.src,
    category: "Human Resources",
    subcategory: "Compliance",
    description: "Develop OFCCP compliance strategies based on recommendations.",
    objectives: ["improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "OFCCP Compliance",
      welcomeCard: welcomeCardDefault,
      icon: complianceIcon.src,
      questions: [
        {
          id: "role-department",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the role/department for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "organization-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the organization type?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the location?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe the demographic",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "barrier-entry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the barrier to entry?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        What are some strategies that @role-department can implement to ensure compliance with OFCCP guidelines for @organization-type in @location that also take into account the unique challenges of @demographic candidates, such as @barrier-entry ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "HR Scorecards",
    icon: scorecardIcon.src,
    category: "Human Resources",
    subcategory: "Data & Analytics",
    description: "Generate HR scorecards offering suggestions for comprehensive design.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "HR Scorecards",
      welcomeCard: welcomeCardDefault,
      icon: scorecardIcon.src,
      questions: [
        {
          id: "company-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the company type?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "metrics",
          type: TWorkflowQuestionType.OpenText,
          headline: "What metrics are you looking to track?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me create an HR scorecard for my @company-type company in the @industry industry? We are looking to track @metrics , to get a more comprehensive view of our HR performance.        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "HR Reports Dashboards",
    icon: reportIcon.src,
    category: "Human Resources",
    subcategory: "Data & Analytics",
    description: "Generate customized HR reports dashboards based on input data.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "HR Reports Dashboards",
      welcomeCard: welcomeCardDefault,
      icon: reportIcon.src,
      questions: [
        {
          id: "metric",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's metric are you looking to track?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "employee-group",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the employee group?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "criteria",
          type: TWorkflowQuestionType.OpenText,
          headline: "Add some criteria to take nto account?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "additional-information",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us additional information",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I want to track the @metric of @employee-group who work remotely, compared to those who work in-office, broken down by @criteria . Can you help me generate a report that includes @additional-information to help me understand the data?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Performance Review Summaries",
    icon: performanceIcon.src,
    category: "Human Resources",
    subcategory: "Performance management",
    description: "Enhance performance reviews by generating concise and personalized summaries.",
    objectives: ["improve_customer_and_employee_experience", "optimize_content_and_seo_strategy", "other"],

    isPremium: false,
    preset: {
      name: "Performance Review Summaries",
      welcomeCard: welcomeCardDefault,
      icon: performanceIcon.src,
      questions: [
        {
          id: "department-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the department name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "period",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the period for this context?",
          subheader: "E.g. quarter/semester/year",
          required: true,
          inputType: "text",
        },
        {
          id: "event",
          type: TWorkflowQuestionType.OpenText,
          headline: "Add some event or circumstance to take into account?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "timeframe",
          type: TWorkflowQuestionType.OpenText,
          headline: "Next timeframe",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - How would you summarize @department-name 's performance this @period , taking into account @event that impacted their work? Please highlight 3 key achievements, 3 areas for opportunity, and provide recommendations for how they can improve in the next @timeframe .
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Employee Goal-Setting",
    icon: goalIcon.src,
    category: "Human Resources",
    subcategory: "Performance management",
    description: "Optimize employee goal-setting to enhance performance and motivation.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Employee Goal-Setting",
      welcomeCard: welcomeCardDefault,
      icon: goalIcon.src,
      questions: [
        {
          id: "department-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific department or team",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific goal or outcome",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "challenge",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific challenge or constraint",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "kpi",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific performance metric or KPI",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are some effective goal-setting strategies for @department in @indsutry that focus on @goal while taking into account @challenge and @kpi ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Performance Review Templates",
    icon: templateIcon.src,
    category: "Human Resources",
    subcategory: "Performance management",
    description: "Generate personalized performance review templates for evaluations.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Performance Review Templates",
      welcomeCard: welcomeCardDefault,
      icon: templateIcon.src,
      questions: [
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "competencies",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the required compentecies?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific goal or outcome",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "skills",
          type: TWorkflowQuestionType.OpenText,
          headline: "What soft skills or attributes would you like to assess?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me create a performance review template for @job-title ? I want to make sure that it covers all the key competencies and performance indicators required for this role, such as @competencies . Additionally, I want to assess @skills in this role. Can you generate some prompts that can help me evaluate these skills and provide constructive feedback to my employees?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Performance Improvement Plans",
    icon: growthIcon.src,
    category: "Human Resources",
    subcategory: "Performance management",
    description: "Create performance improvement plans based on personalized insights.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Performance Improvement Plans",
      welcomeCard: welcomeCardDefault,
      icon: growthIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the name of the employee?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "improvement-area",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific area of improvement",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "performance",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific examples of poor performance",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "metrics",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific goals or metrics",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "timeframe",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific timeframe",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me write a performance improvement plan for @employee-name , who is struggling with @improvement-area ? Some examples of their performance issues include @performance . I would like to see improvements in @metrics within @timeframe .
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Performance Appraisal Forms",
    icon: formIcon.src,
    category: "Human Resources",
    subcategory: "Performance management",
    description: "Use performance appraisal forms to efficiently provide feedback.",
    objectives: ["improve_customer_and_employee_experience", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Performance Appraisal Forms",
      welcomeCard: welcomeCardDefault,
      icon: formIcon.src,
      questions: [
        {
          id: "kpis",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert key performance indicators (KPIs)",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "team",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the name of the team?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "period",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert period",
          subheader: "E.g. quarter/year",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me generate a list of @kpis that I should consider when creating an appraisal form for my @team in @period , based on their sales targets, customer satisfaction ratings, and number of successful leads?        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Remote Work Policies",
    icon: computerIcon.src,
    category: "Human Resources",
    subcategory: "Employee relations",
    description: "Create remote work policies based on suggestions and examples.",
    objectives: ["improve_customer_and_employee_experience", "optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Remote Work Policies",
      welcomeCard: welcomeCardDefault,
      icon: computerIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "Such as healthcare or finance",
          required: true,
          inputType: "text",
        },
        {
          id: "concerns",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific concerns or regulations",
          subheader: "Such as data privacy or HIPAA compliance",
          required: true,
          inputType: "text",
        },
        {
          id: "company-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert company size or structure",
          subheader: "Such as a small clinic or a large hospital",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you give me some examples of remote work policies for @industry , taking into account @concerns and @company-size ?"
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Diversity & Inclusion Strategies",
    icon: diversityIcon.src,
    category: "Human Resources",
    subcategory: "Employee relations",
    description: "Devise diversity and inclusion strategies based on ideas and real examples.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Diversity & inclusion Strategies",
      welcomeCard: welcomeCardDefault,
      icon: diversityIcon.src,
      questions: [
        {
          id: "data",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific data/feedback/employee input",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific goals/challenges",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "policies",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific policies/resources",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Based on @data , can you suggest at least 5 innovative strategies or best practices to improve diversity and inclusion in the workplace, with a focus on @goals , and taking into account @policies ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Exit Interviews",
    icon: exitIcon.src,
    category: "Human Resources",
    subcategory: "Employee relations",
    description: "Conduct exit interviews by generating questions and suggesting actions.",
    objectives: ["improve_customer_and_employee_experience", "optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Exit Interviews",
      welcomeCard: welcomeCardDefault,
      icon: exitIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the employee name",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "issue",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific issue",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Hi ChatGPT, can you help me conduct an exit interview? I want to know why @employee-name has decided to leave the company. Can you also suggest follow-up questions to ask based on their responses to better understand their perspective on @issue ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Employee Engagement Surveys",
    icon: surveyIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Enhance employee engagement by creating structured survey questions.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Employee Engagement Surveys",
      welcomeCard: welcomeCardDefault,
      icon: surveyIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "Such as healthcare or finance",
          required: true,
          inputType: "text",
        },
        {
          id: "focus",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your focus?",
          subheader: "E.g. customer service/innovation/diversity",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide me with a list of survey questions for measuring employee engagement in the @industry sector that focuses on @focus ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Paid Time Off Policies",
    icon: payIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Design comprehensive paid time off policies efficiently.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Paid Time Off Policies",
      welcomeCard: welcomeCardDefault,
      icon: payIcon.src,
      questions: [
        {
          id: "company-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the company-size?",
          subheader: "E.g. Small/medium/large",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "team-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the team type?",
          subheader: "E.g. multi-national/cross-functional/remote",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are the best practices for designing a PTO policy for @company-size companies, and how can they be tailored for @industry ? What are the considerations for @team-type teams, and how can the policy be communicated effectively to diverse/immigrant/non-native workforce?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Equity Compensation Programs",
    icon: rewardIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Create comprehensive equity compensation programs efficiently.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Equity Compensation Programs",
      welcomeCard: welcomeCardDefault,
      icon: rewardIcon.src,
      questions: [
        {
          id: "situation",
          type: TWorkflowQuestionType.OpenText,
          headline: "Describe the situation for this context",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "regulation",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific law or regulation",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "scenario",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific scenario to include provisions",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide me with some legal language that I can use in an equity compensation plan for @situation that complies with @regulation and includes provisions for @scenario ? Also, could you suggest some strategies for mitigating legal risks associated with equity compensation?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Job Evaluations",
    icon: jobIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Conduct thorough job evaluations gaining insights and recommendations.",
    objectives: ["improve_business_strategy", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Conducting job evaluations",
      welcomeCard: welcomeCardDefault,
      icon: jobIcon.src,
      questions: [
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "scenario",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific scenario to include provisions",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - How do different job responsibilities/competencies/experience levels impact the salary range/compensation package/benefits for @job-title in @industry , and what strategies/tactics can we implement to improve the compensation/job description for our organization?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Health and Wellness Programs",
    icon: wellnessIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Create comprehensive health and wellness programs for your employees.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Health and Wellness Programs",
      welcomeCard: welcomeCardDefault,
      icon: wellnessIcon.src,
      questions: [
        {
          id: "audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the audience for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "health-issue",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific health issue for this context",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "activity",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific activity or behavior",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "interventions-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific activity or behavior for this context",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I need help designing a health and wellness program for @audience that @health-issue , with a focus on @activity . Can you suggest some effective @interventions-type that have been successful with similar populations?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Employee Satisfaction Surveys",
    icon: surveyIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Write employee satisfaction surveys by generating relevant questions and responses.",
    objectives: ["improve_customer_and_employee_experience", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Employee Satisfaction Surveys",
      welcomeCard: welcomeCardDefault,
      icon: surveyIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the company name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "work-aspect",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific aspect of work to consider on",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "demographics",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert demographics of your employees",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you suggest some questions to ask in an employee satisfaction survey for @company-name in the @industry sector that relate to @work-aspect and consider the @demographics of the employees?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Salary Survey Reports",
    icon: salaryIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Generate salary survey reports, analyzing data efficiently for accurate insights.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Salary Survey Reports",
      welcomeCard: welcomeCardDefault,
      icon: salaryIcon.src,
      questions: [
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "location",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the geographic location?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "experience",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert number of years of experience",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "criteria",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert additional criteria to take into account",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Could you please provide me with a detailed salary report for @job-title , @location , and @industry with @experience years of experience, including the median, 25th and 75th percentile salaries, as well as any relevant bonuses, benefits, variable pay structures, remote work options, and @criteria ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Bonus Plan Generator",
    icon: bonusIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Create bonus plans with incentives that align with company goals.",
    objectives: ["improve_business_strategy", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Bonus Plan Generator",
      welcomeCard: welcomeCardDefault,
      icon: bonusIcon.src,
      questions: [
        {
          id: "company-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific company size",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "job-role",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert job role(s) for this context",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "experience",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific experience or tenure",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "action",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert specific action or behavior",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are some effective bonus plans for @company-size companies in the @industry sector, particularly for @job-role with @experience that @action?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Employee Benefits",
    icon: benefitsIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Optimize employee benefits by offering tailored packages and personalized advice.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Employee Benefits",
      welcomeCard: welcomeCardDefault,
      icon: benefitsIcon.src,
      questions: [
        {
          id: "benefits",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the benefits?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "employees-number",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the size of workforce",
          subheader: "Number of employees",
          required: true,
          inputType: "text",
        },
        {
          id: "demographic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What demographic are you trying to attract and retain",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "amount",
          type: TWorkflowQuestionType.OpenText,
          headline: "Insert the budget amount per employee",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you create a comprehensive benefits package that includes @benefits for our diverse workforce of @employees-number , with a focus on attracting and retaining @demographic and staying within our budget of @amount per employee?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Holistic Wellness Programs",
    icon: wellnessIcon.src,
    category: "Human Resources",
    subcategory: "Compensation & Benefits",
    description: "Transform the office into a wellness space, promoting work-life balance.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Holistic Wellness Programs",
      welcomeCard: welcomeCardDefault,
      icon: wellnessIcon.src,
      questions: [
        {
          id: "sector",
          type: TWorkflowQuestionType.OpenText,
          headline: "What sector do you work in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        CONTEXT:
        You are Employee Wellness Advocate GPT, an AI advisor focused on holistic employee wellness programs. Your expertise includes integrating physical, mental, and financial wellness into comprehensive employee benefit plans.
        
        CHALLENGE:
        Many companies overlook the broader aspects of employee wellness, focusing solely on traditional benefits, and missing opportunities to enhance overall employee well-being.
        
        GOAL:
        Create a comprehensive and holistic wellness program for this sector: @sector that addresses the physical, mental, and financial well-being of employees.
        
        PROMPT STRUCTURE:
        - Physical Wellness Initiatives (Developing programs for physical health, such as fitness memberships or health screenings)
        - Mental Health Support (Integrating mental health resources, like counseling services and stress management workshops)
        - Financial Wellness Education (Offering financial planning resources and education)
        - Work-Life Balance Policies (Implementing policies that promote a healthy work-life balance)
        - Continuous Program Evaluation (Establishing mechanisms for ongoing assessment and improvement of the wellness program)
        
        PROMPT CRITERIA:
        - Suggest 4 distinct initiatives or resources for each aspect of the wellness program.
        - Emphasize a holistic approach, addressing various aspects of employee well-being.
        - Ensure that the initiatives are inclusive and accessible to all employees.
        - Include innovative and modern methods to promote and support employee wellness.
        
        FORMAT OF OUR INTERACTION:
        Use a supportive and informative tone, simulating a consultation with HR professionals or business leaders.
        Be prepared for interactive discussions, offering detailed explanations and additional insights.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Benefit Packages",
    icon: benefitsIcon.src,
    category: "Human Resources",
    subcategory: "Workforce planning",
    description: "Create benefit packages by empowering employees to customize their perks.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      name: "Benefit Packages",
      welcomeCard: welcomeCardDefault,
      icon: benefitsIcon.src,
      questions: [
        {
          id: "sector",
          type: TWorkflowQuestionType.OpenText,
          headline: "What sector do you work in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        Context: 
        You are Compensation Customization Expert GPT, an AI specialist in designing personalized compensation and benefit packages for employees. Your expertise is in creating flexible and diverse packages that cater to the varying needs of a diverse workforce.
        
        CHALLENGE:
        Standardized benefit packages often fail to meet the diverse needs and preferences of employees in this sector: @sector, leading to less satisfaction and engagement.
        
        GOAL:
        Develop a range of customizable benefit options that employees in this @sector can choose from to best suit their individual needs and lifestyles.
        
        PROMPT STRUCTURE:
        - Employee Needs Assessment (Conducting surveys and assessments to understand diverse employee needs)
        - Flexible Benefits Options (Creating a variety of benefit options for employees to choose from)
        - Package Customization Process (Developing an easy-to-use system for employees to tailor their benefit packages)
        - Communication and Education (Ensuring clear communication and education about the available options)
        - Feedback and Iteration (Setting up a feedback system to continuously improve and update the benefits options)
        
        PROMPT CRITERIA:
        - Propose 3 innovative ideas for each step in creating tailored benefit packages.
        - Focus on inclusivity, ensuring options cater to a wide range of needs and lifestyles.
        - Ensure the customization process is user-friendly and accessible.
        - Include ideas that are cost-effective and feasible for businesses of various sizes.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Coaching Plans",
    icon: employeeTrainerIcon.src,
    category: "Human Resources",
    subcategory: "Training & Development",
    description: "Write coaching plans with goal-setting iniciatives and actionable strategies.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Coaching Plans",
      welcomeCard: welcomeCardDefault,
      icon: employeeTrainerIcon.src,
      questions: [
        {
          id: "plan",
          type: TWorkflowQuestionType.OpenText,
          headline: "Is a plan for individual or group?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "issue",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific the issue/behavior who is struggling with",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "preference",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific learning style/behavioral preference",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - What are some key elements to include in a coaching plan for @plan who is struggling with @issue , and how can I tailor the plan to @preference ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Employee Development Plans",
    icon: planIcon.src,
    category: "Human Resources",
    subcategory: "Training & Development",
    description: "Design employee development plans aligned with organizational and individual goals.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Employee Development Plans",
      welcomeCard: welcomeCardDefault,
      icon: planIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the employee name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "skill",
          type: TWorkflowQuestionType.OpenText,
          headline: "What skill needs to improve",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I'm designing an employee development plan for @employee-name who needs to improve their @skill . Can you suggest 5 learning opportunities that align with their career goals and our organizational needs?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Learning Objectives",
    icon: learningIcon.src,
    category: "Human Resources",
    subcategory: "Training & Development",
    description: "Develop clear, specific, and measurable learning objectives aligned with your goals.",
    objectives: [
      "improve_customer_and_employee_experience",
      "innovate_and_develop",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Learning Objectives",
      welcomeCard: welcomeCardDefault,
      icon: learningIcon.src,
      questions: [
        {
          id: "program",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific type of course/training program",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "What skill needs to improve",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "objectives",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific learning outcomes/objectives",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the industry for this context?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the target audience?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I'm developing a @program , and I need help creating learning objectives for @topic that align with @objectives in @industry . Can you provide some guidance on how to make them measurable/attainable for @target-audience ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Employee Learning Paths",
    icon: LearningPathsIcon.src,
    category: "Human Resources",
    subcategory: "Training & Development",
    description:
      "Empower employees with cutting-edge learning paths for rapid adaptation and continuous innovation.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Employee Learning Paths",
      welcomeCard: welcomeCardDefault,
      icon: LearningPathsIcon.src,
      questions: [
        {
          id: "sector",
          type: TWorkflowQuestionType.OpenText,
          headline: "What sector do you work in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        CONTEXT:
        You are a Personalized Learning Architect GPT specialized in this @sector, an AI expert in designing individualized learning and development programs for employees. Your specialty lies in tailoring training to match the unique skills, career goals, and learning styles of each employee, ensuring maximum engagement and effectiveness.
        
        CHALLENGE:
        A one-size-fits-all approach to employee training often leads to disengagement and limited skill development. Businesses need a more personalized approach to help employees grow in alignment with their personal and professional goals.
        
        GOAL: Craft personalized learning paths for employees that cater to their individual development needs and align with company objectives.
        
        PROMPT STRUCTURE:
        - Skills and Goals Assessment (Identifying each employee's current skills, career aspirations, and learning preferences)
        - Customized Learning Modules (Developing tailored learning modules addressing specific skills and career paths)
        - Interactive Learning Methods (Incorporating interactive and diverse learning methods suited to different learning styles)
        - Progress Tracking and Adaptation (Implementing systems to track progress and adapt learning paths as needed)
        - Feedback and Continuous Improvement (Creating a feedback loop for continuous improvement of the personalized learning experience)
        
        PROMPT CRITERIA:
        1. Offer 3 distinct and innovative approaches for each step of developing personalized learning paths.
        2. Ensure that each suggestion is actionable and feasible within various organizational structures.
        3. Emphasize creative and engaging learning methods to enhance employee participation and retention.
        4. Include strategies that can be scaled and adapted for different team sizes and industry sectors.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Job Offers Negotiation Script",
    icon: negotiationIcon.src,
    category: "Human Resources",
    subcategory: "Recruituiting",
    description: "Create negotiation scripts for job offers, guiding users through the process.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Job Offers Negotiation Script",
      welcomeCard: welcomeCardDefault,
      icon: negotiationIcon.src,
      questions: [
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's your job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "company",
          type: TWorkflowQuestionType.OpenText,
          headline: "Which company are you applying to?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "salary-range",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's your desired salary range?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - I'm @job-title negotiating a job offer with @company , and I'm hoping to get a salary in the range of @salary-range . However, I'm not sure how to approach the negotiation without jeopardizing the offer. Can you help me develop a strategy for negotiating salary that aligns with my goals?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Cultural Fit Assessments",
    icon: cultureIcon.src,
    category: "Human Resources",
    subcategory: "Recruituiting",
    description: "Generate cultural fit assessment questions, aiding in evaluating candidates.",
    objectives: ["optimize_content_and_seo_strategy", "improve_business_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Cultural Fit Assessments",
      welcomeCard: welcomeCardDefault,
      icon: cultureIcon.src,
      questions: [
        {
          id: "job-role",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the job role?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "company-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the company type?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me generate at least 10 behavioral-based questions to assess a candidate's cultural fit for a @job-role ? @company-type . The ideal candidate should have experience in at least 3 areas, and the cultural values we are looking for include at least 3 core values.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Applicant Tracking System",
    icon: trackingIcon.src,
    category: "Human Resources",
    subcategory: "Recruituiting",
    description: "Optimize your hiring process by managing an Applicant Tracking System (ATS).",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Applicant Tracking System",
      welcomeCard: welcomeCardDefault,
      icon: trackingIcon.src,
      questions: [
        {
          id: "use-ats",
          type: TWorkflowQuestionType.OpenText,
          headline: "How do you want to use the ATS?",
          subheader: "E.g. machine learning algorithms",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you provide me with some tips on how to optimize candidate profiles using an ATS? Specifically, how can I use @use-ats to analyze unstructured data and predict candidate fit for specific job requirements?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Onboarding Plans",
    icon: planIcon.src,
    category: "Human Resources",
    subcategory: "Recruituiting",
    description: "Create onboarding plans to ensure new employees thrive.",
    objectives: ["improve_customer_and_employee_experience", "innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Onboarding Plans",
      welcomeCard: welcomeCardDefault,
      icon: planIcon.src,
      questions: [
        {
          id: "employee-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the name of the new employee?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "job-title",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's their job title?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "department",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's their department?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "start-date",
          type: TWorkflowQuestionType.OpenText,
          headline: "What's the start date?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "responsibility",
          type: TWorkflowQuestionType.OpenText,
          headline: "Specific task/duty/responsibility",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        - Can you help me create a comprehensive onboarding plan for @employee-name who will be working as a @job-title in the @department department, starting on @start-date , and who will be responsible for @responsibility ?
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Workforce Demands",
    icon: workforceIcon.src,
    category: "Human Resources",
    subcategory: "Workforce planning",
    description: "Integrate workforce ensuring rapid adaptation and fostering innovation within teams.",
    objectives: ["innovate_and_develop", "other"],
    isPremium: false,
    preset: {
      name: "Workforce Demands",
      welcomeCard: welcomeCardDefault,
      icon: workforceIcon.src,
      questions: [
        {
          id: "sector",
          type: TWorkflowQuestionType.OpenText,
          headline: "What sector do your work in?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        message: `
        CONTEXT:
        You are Agile Workforce Planner GPT specialized in this sector: @sector, an AI consultant with expertise in helping businesses adapt their workforce planning to rapidly changing market and industry demands. Your skills include agile planning, flexible staffing strategies, and predictive workforce analytics.
        
        CHALLENGE:
        In today's fast-paced business environment, companies need to swiftly adapt their workforce to meet changing demands and remain competitive.
        
        GOAL:
        Create a flexible and responsive workforce plan that can quickly adapt to changing business needs and market conditions.
        
        PROMPT STRUCTURE:
        1. Market Trend Analysis (Staying informed about market and industry trends affecting workforce needs)
        2. Flexible Staffing Models (Developing staffing models that allow for quick adaptation)
        3. Cross-Training Programs (Implementing cross-training to increase workforce flexibility)
        4. Technology Integration (Leveraging technology for efficient workforce planning and adaptation)
        5. Continuous Feedback Loop (Establishing mechanisms for ongoing feedback and rapid response)
        
        PROMPT CRITERIA:
        - Suggest 3 innovative strategies or tools for each aspect of adaptive workforce planning.
        - Focus on creating a workforce that is both flexible and resilient to change.
        - Ensure the recommendations are feasible for implementation in various business contexts.
        - Include forward-thinking approaches that anticipate future workforce trends and needs.
        
        FORMAT OF OUR INTERACTION:
        Use an engaging and informative tone, simulating a real-time consultation with a business leader or HR professional.
        Be prepared to provide clarifications or additional insights as needed.
        `,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
];
