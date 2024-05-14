import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowHiddenFields,
  TWorkflowQuestionType,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import abTestIcon from "@typeflowai/ui/icons/templates/ab-test.svg";
import articleIcon from "@typeflowai/ui/icons/templates/article.svg";
import buyerPersonaIcon from "@typeflowai/ui/icons/templates/buyerpersona.svg";
import calendarIcon from "@typeflowai/ui/icons/templates/calendar.svg";
import cameraIcon from "@typeflowai/ui/icons/templates/camera.svg";
import campaignIcon from "@typeflowai/ui/icons/templates/campaign.svg";
import captionIcon from "@typeflowai/ui/icons/templates/caption.svg";
import cartIcon from "@typeflowai/ui/icons/templates/cart.svg";
import caseStudyIcon from "@typeflowai/ui/icons/templates/case-study.svg";
import chatbotIcon from "@typeflowai/ui/icons/templates/chatbot.svg";
import coldEmailIcon from "@typeflowai/ui/icons/templates/coldemail.svg";
import comparisonChartIcon from "@typeflowai/ui/icons/templates/comparison-chart.svg";
import contentCalendarIcon from "@typeflowai/ui/icons/templates/content-calendar.svg";
import customerEngagementIcon from "@typeflowai/ui/icons/templates/customer-engagement.svg";
import dataDrivenPaperIcon from "@typeflowai/ui/icons/templates/data-driven-paper.svg";
import dripIcon from "@typeflowai/ui/icons/templates/drip.svg";
import emailResponseIcon from "@typeflowai/ui/icons/templates/email-response.svg";
import emailTemplatesIcon from "@typeflowai/ui/icons/templates/email-templates.svg";
import empathyMapIcon from "@typeflowai/ui/icons/templates/empathy-map.svg";
import engagementReportIcon from "@typeflowai/ui/icons/templates/engagement-report.svg";
import faqIcon from "@typeflowai/ui/icons/templates/faq.svg";
import feedbackProposalIcon from "@typeflowai/ui/icons/templates/feedback-proposal.svg";
import feedbackRequestIcon from "@typeflowai/ui/icons/templates/feedback-request.svg";
import followupEmailsIcon from "@typeflowai/ui/icons/templates/followup-emails.svg";
import growthIcon from "@typeflowai/ui/icons/templates/growth.svg";
import hashtagIcon from "@typeflowai/ui/icons/templates/hashtag.svg";
import ideaIcon from "@typeflowai/ui/icons/templates/idea.svg";
import journeyIcon from "@typeflowai/ui/icons/templates/journey.svg";
import kpiIcon from "@typeflowai/ui/icons/templates/kpi.svg";
import leadScoreIcon from "@typeflowai/ui/icons/templates/lead-score.svg";
import loopIcon from "@typeflowai/ui/icons/templates/loop.svg";
import loyaltyIcon from "@typeflowai/ui/icons/templates/loyalty.svg";
import magnetIcon from "@typeflowai/ui/icons/templates/magnet.svg";
import marketModelsIcon from "@typeflowai/ui/icons/templates/market-models.svg";
import newsletterIcon from "@typeflowai/ui/icons/templates/newsletter.svg";
import optimizeIcon from "@typeflowai/ui/icons/templates/optimize.svg";
import outreachEmailIcon from "@typeflowai/ui/icons/templates/outreach-email.svg";
import personalizedCampaignIcon from "@typeflowai/ui/icons/templates/personalized-campaign.svg";
import personalizedEmailIcon from "@typeflowai/ui/icons/templates/personalized-email.svg";
import pieChartIcon from "@typeflowai/ui/icons/templates/pie-chart.svg";
import pitchIcon from "@typeflowai/ui/icons/templates/pitch.svg";
import policyIcon from "@typeflowai/ui/icons/templates/policy.svg";
import priceIcon from "@typeflowai/ui/icons/templates/price.svg";
import productVideoIcon from "@typeflowai/ui/icons/templates/product-video.svg";
import proposalTemplateIcon from "@typeflowai/ui/icons/templates/proposal-template.svg";
import prospectIcon from "@typeflowai/ui/icons/templates/prospect.svg";
import interactiveQuizIcon from "@typeflowai/ui/icons/templates/quiz2.svg";
import quizIcon from "@typeflowai/ui/icons/templates/quiz.svg";
import reviewResponseIcon from "@typeflowai/ui/icons/templates/review-response.svg";
import reviewIcon from "@typeflowai/ui/icons/templates/review.svg";
import roadmapIcon from "@typeflowai/ui/icons/templates/roadmap.svg";
import salesIncentiveIcon from "@typeflowai/ui/icons/templates/sales-incentive.svg";
import salesProposalIcon from "@typeflowai/ui/icons/templates/sales-proposal.svg";
import seoIcon from "@typeflowai/ui/icons/templates/seo.svg";
import socialMediaIcon from "@typeflowai/ui/icons/templates/socialmedia.svg";
import subjectIcon from "@typeflowai/ui/icons/templates/subject.svg";
import swordFightIcon from "@typeflowai/ui/icons/templates/sword-fight.svg";
import swotIcon from "@typeflowai/ui/icons/templates/swot.svg";
import targetEmailIcon from "@typeflowai/ui/icons/templates/target2.svg";
import targetIcon from "@typeflowai/ui/icons/templates/target.svg";
import voiceIcon from "@typeflowai/ui/icons/templates/voice.svg";
import workflowIcon from "@typeflowai/ui/icons/templates/workflow.svg";

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

export const salesTemplates: TTemplate[] = [
  {
    name: "Personalized outreach emails",
    icon: personalizedEmailIcon.src,
    category: "Sales",
    subcategory: "Customer Outreach",
    description: "Create personalized prospecting outreach emails.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Personalized outreach emails",
      welcomeCard: welcomeCardDefault,
      icon: personalizedEmailIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
        {
          id: "pricing-model",
          type: TWorkflowQuestionType.OpenText,
          headline: "What pricing model do you want to use?",
          subheader: "E.g. Subscription-based, ranging from $100 to $500 per month",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        CONTEXT:
        You are an outreach master, a seasoned expert in customer communication and relationship building. Your specialty is in crafting unique, personalized outreach strategies for businesses aiming to connect deeply with their target audience.
        
        GOAL:
        I need innovative and personalized strategies to reach out to potential customers. These strategies should be effective in initiating conversations, building relationships, and ultimately converting leads into loyal customers.
        
        CUSTOMER OUTREACH STRATEGY:
        Initial Contact (How can I first connect with potential customers in a way that grabs their attention?)
        Follow-Up (What are creative ways to follow up that keep the conversation going and show value?)
        Conversion (What strategies can I use to turn these interactions into actual sales or commitments?)
        Relationship Building (How can I continue to engage with these customers to build a long-term relationship?)
        Feedback Loop (How can I effectively gather and use customer feedback to improve and tailor my outreach?)
        
        OUTREACH CRITERIA:
        - Provide 3 unique strategies for each step of the customer outreach process.
        - Each strategy must be detailed and actionable, avoiding vague suggestions like "send emails".
        - Strategies should be innovative and stand out in a crowded market.
        - Prioritize low-cost, high-impact strategies that can be implemented by small teams or individuals.
        - Emphasize methods with a high likelihood of success and immediate results.
        
        INFORMATION ABOUT MY BUSINESS:
        Target Audience: @target-audience
        Product/Service Offered: @product-service
        Pricing Model: @pricing-model
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
    name: "Quiz for lead generation",
    icon: quizIcon.src,
    category: "Sales",
    subcategory: "Lead Generation",
    description: "Create interactive lead generation content aligned with your goals.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Quiz for lead generation",
      welcomeCard: welcomeCardDefault,
      icon: quizIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I'm looking to create an interactive quiz to generate leads for our @product-service. Can you provide me with some ideas for quiz questions and how to design the quiz to be engaging and effective?
        - I want to create a ROI calculator to help potential customers understand the value of our @product-service. Can you help me create the calculations and design the calculator to be user-friendly and informative?
        - Can you help me create an assessment tool that will help potential customers identify their unique needs and how our @product-service can meet those needs? What are some best practices for designing and promoting an assessment tool?
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
    name: "Lead scoring criteria",
    icon: leadScoreIcon.src,
    category: "Sales",
    subcategory: "Lead Generation",
    description: "Simplify lead scoring criteria development.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Lead scoring criteria",
      welcomeCard: welcomeCardDefault,
      icon: leadScoreIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the top factors to consider when creating lead scoring criteria for @client-company based on @product-service?
        - Help me improve @client-company's lead scoring model for @product-service?
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
    name: "Targeted social media ads",
    icon: targetIcon.src,
    category: "Sales",
    subcategory: "Lead Generation",
    description: "Optimize your social media ads with creative copy.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Targeted social media ads",
      welcomeCard: welcomeCardDefault,
      icon: targetIcon.src,
      questions: [
        {
          id: "social-media-platform",
          type: TWorkflowQuestionType.OpenText,
          headline: "What social media platform do you use for ads?",
          subheader: "E.g. Google Ads, Facebook Ads...",
          required: true,
          inputType: "text",
        },
        {
          id: "unique-value-proposition",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your unique value proposition?",
          subheader: "E.g. One-of-a-kind, customizable jewelry pieces",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - My brand needs to develop a series of @social-media-platform ads that convey our @unique-value-proposition to @target-audience. Can you suggest some Ad copy and messaging variations?
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
    name: "Prospecting emails",
    icon: prospectIcon.src,
    category: "Sales",
    subcategory: "Lead Generation",
    description: "Write personalized prospecting tailored to recipients.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Prospecting emails",
      welcomeCard: welcomeCardDefault,
      icon: prospectIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company you want to send the email?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me craft a compelling email to @company-name about our @product-service? We want to highlight our unique value proposition and stand out from the competition.
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
    name: "Email subject line A/B tests",
    icon: abTestIcon.src,
    category: "Sales",
    subcategory: "Customer Outreach",
    description: "Improve open rate by A/B testing subject lines.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Email subject line A/B tests",
      welcomeCard: welcomeCardDefault,
      icon: abTestIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me generate some new email subject lines for our @product-service that would resonate with our @target-audience? What type of language or messaging should I use to improve our open rates?
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
    name: "Personalized email campaigns",
    icon: personalizedCampaignIcon.src,
    category: "Sales",
    subcategory: "Customer Outreach",
    description: "Create personalized email campaigns to enhance conversion rates.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Personalized email campaigns",
      welcomeCard: welcomeCardDefault,
      icon: personalizedCampaignIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of your company?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
        {
          id: "specific-content",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us some specific content that should be on the email",
          subheader: "Please, be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me create an email campaign for @company-name promoting our new product? We want to target @target-audience, and we'd like to include @specific-content. Can you suggest a subject line and some talking points to include in the email?"
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
    name: "Sales pitch generator",
    icon: pitchIcon.src,
    category: "Sales",
    subcategory: "Customer Outreach",
    description: "Develop sales pitch variations and A/B test them.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Sales pitch generator",
      welcomeCard: welcomeCardDefault,
      icon: pitchIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of your company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "number",
          type: TWorkflowQuestionType.OpenText,
          headline: "How many version would you like to generate?",
          subheader: "Set a number between 0 & 3",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I am looking to improve my sales pitch for my @product-service. Can you help me come up with at least @number different versions of my pitch that I can test through A/B testing? I want to know which version is most effective in terms of conversion rate. Also, can you give me some guidance on how to structure the A/B testing experiment and interpret the results?
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
    name: "Product comparison charts",
    icon: comparisonChartIcon.src,
    category: "Sales",
    subcategory: "Product Information",
    description: "Develop product comparison charts with accurate information.",
    objectives: ["optimize_content_and_seo_strategy", "other"],
    isPremium: false,
    preset: {
      name: "Product comparison charts",
      welcomeCard: welcomeCardDefault,
      icon: comparisonChartIcon.src,
      questions: [
        {
          id: "product-a",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name the first product to compare",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-b",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name the second product to compare",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me create a product comparison chart between @product-a and @product-b? I want to highlight key features, benefits, and pricing information to help customers make an informed decision.
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
    name: "Product roadmap generator",
    icon: roadmapIcon.src,
    category: "Sales",
    subcategory: "Product Information",
    description: "Develop a product roadmap with these feature suggestions.",
    objectives: ["innovate_and_develop"],
    isPremium: false,
    preset: {
      name: "Product roadmap generator",
      welcomeCard: welcomeCardDefault,
      icon: roadmapIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I am looking to create a product roadmap for @product-service that addresses the needs of @target-audience. Can you suggest some specific features and functionalities that would be valuable to this audience?
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
    name: "Product tutorial videos",
    icon: productVideoIcon.src,
    category: "Sales",
    subcategory: "Product Information",
    description: "Generate structured product tutorial videos with clear instructions.",
    objectives: ["innovate_and_develop", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Product tutorial videos",
      welcomeCard: welcomeCardDefault,
      icon: productVideoIcon.src,
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product about?",
          subheader: "E.g. A fitness app designed to help users track their exercise routines",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I'm looking to create a tutorial video for @product-service, can you suggest a format and structure that would be effective in communicating how to use the product?
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
    name: "Product reviews generator",
    icon: reviewIcon.src,
    category: "Sales",
    subcategory: "Product Information",
    description: "Generate compelling product reviews to drive more sales.",
    objectives: ["enhance_online_presence", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Product reviews generator",
      welcomeCard: welcomeCardDefault,
      icon: reviewIcon.src,
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product about?",
          subheader: "E.g. A fitness app designed to help users track their exercise routines",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I am looking to write a problem-solving review of @product. Can you suggest some scenarios or issues that potential customers may face that this product can effectively solve?
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
    name: "Product FAQs generator",
    icon: faqIcon.src,
    category: "Sales",
    subcategory: "Product Information",
    description: "Generate user-centric product FAQs to answer customer's queries.",
    objectives: ["optimize_content_and_seo_strategy", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Product FAQs generator",
      welcomeCard: welcomeCardDefault,
      icon: faqIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the product or service to write about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are the most common questions that customers have about @product-service? Can you provide answers that are clear and concise, and address any concerns that customers may have?
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
    name: "SEO Keyword research",
    icon: seoIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Optimize content generating relevant keywords for SEO.",
    objectives: ["enhance_online_presence", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "SEO Keyword research",
      welcomeCard: welcomeCardDefault,
      icon: seoIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the topic for the keyword research",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate a list of high-volume keywords for @topic? The keywords should be relevant to @target-audience, and have low competition. Please include any related keywords or phrases that may be useful for optimizing content.
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
    name: "Case studies generator",
    icon: caseStudyIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Ideas, content, and data to simplify the creation of case studies",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Crafting case studies",
      welcomeCard: welcomeCardDefault,
      icon: caseStudyIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the topic for the case study",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        "Can you generate a case study on @topic that is targeted to @target-audience? The case study should be engaging, informative, and easy to follow, with clear explanations and relevant examples. Please include any relevant data or statistics."
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
    name: "Social media copy",
    icon: socialMediaIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Create social media copy that highlights the benefits of your product",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      name: "Social media copy",
      welcomeCard: welcomeCardDefault,
      icon: socialMediaIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the product or service to write about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I'm looking to craft social media copy that highlights the unique features and benefits of my @product-service, and effectively communicates the value of my offerings to my target audience. Can you assist me in generating a range of ideas and insights that are creative, engaging, and resonate with my audience of @target-audience?
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
    name: "Content calendar generator",
    icon: contentCalendarIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Generate tailored content calendars for your social media strategy.",
    objectives: ["enhance_online_presence", "optimize_content_and_seo_strategy", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Content calendar generator",
      welcomeCard: welcomeCardDefault,
      icon: contentCalendarIcon.src,
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the topic for the social media posts",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide me with some ideas for social media posts related to @topic? I'm trying to fill out my content calendar for the next month.
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
    name: "Interactive quiz for marketing",
    icon: interactiveQuizIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Create an interactive and engaging quiz to engage your audience.",
    objectives: ["boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Interactive quiz for marketing",
      welcomeCard: welcomeCardDefault,
      icon: interactiveQuizIcon.src,
      questions: [
        {
          id: "business-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of business are you running?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the product or service to write about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Small Business Owners and Independent Entrepreneurs",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - As a @business-type, I'm looking to create an interactive quiz that engages my audience of @target-audience and promotes my @product-service. Can you assist me in generating a range of quiz questions and topics that are relevant and interesting to my target audience?
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
    name: "Data-driven white papers",
    icon: dataDrivenPaperIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Create data-driven white papers with the latest trends of your field.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Data-driven white papers",
      welcomeCard: welcomeCardDefault,
      icon: dataDrivenPaperIcon.src,
      questions: [
        {
          id: "field",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name the field for the with paper",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate a white paper that outlines the latest trends and innovations in the field of @field? Please provide data-driven insights and use cases to support the findings.
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
    name: "Blog articles generator",
    icon: articleIcon.src,
    category: "Sales",
    subcategory: "Content Marketing",
    description: "Write blog articles based on the benefits of your product.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      name: "Blog articles generator",
      welcomeCard: welcomeCardDefault,
      icon: articleIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the product or service to write about?",
          subheader: "E.g. Customized Business Consulting Services",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - We're looking to create a blog article that showcases the benefits and features of @product-service. Can you help us generate content that effectively communicates how our product can help businesses overcome specific challenges and achieve their goals?
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
    name: "Sales growth trend reports",
    icon: growthIcon.src,
    category: "Sales",
    subcategory: "Sales Reporting",
    description: "Write insightful sales growth trend reports effortlessly.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Sales growth trend reports",
      welcomeCard: welcomeCardDefault,
      icon: growthIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the name of the company to know about?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Based on historical sales data, can you predict the expected sales growth for @company-name for the upcoming quarter? Please include any relevant factors or variables that may impact sales performance.
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
    name: "Customer segmentation reports",
    icon: pieChartIcon.src,
    category: "Sales",
    subcategory: "Sales Reporting",
    description: "Generate insightful customer segmentation reports effortlessly.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Customer segmentation reports",
      welcomeCard: welcomeCardDefault,
      icon: pieChartIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me identify the most profitable customer segments for @company-name? Please provide a detailed analysis of the factors contributing to profitability and identify any notable trends or patterns.
        - Based on our customer data, can you help me identify the customer segments that are most likely to be interested in our new product or service? Please provide any recommendations for targeting these segments effectively."
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
    name: "Competitor analysis reports",
    icon: swordFightIcon.src,
    category: "Sales",
    subcategory: "Sales Reporting",
    description: "Swiftly generate thorough competitor analysis reports.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Competitor analysis reports",
      welcomeCard: welcomeCardDefault,
      icon: swordFightIcon.src,
      questions: [
        {
          id: "company-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the type of your company",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to generate a sales win/loss analysis report for my @company-type that sells @product-service. Can you help me identify the right metrics to track and generate a report that provides insights on our sales performance and how we can optimize our win/loss ratio?
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
    name: "Sales automation workflows",
    icon: workflowIcon.src,
    category: "Sales",
    subcategory: "Sales Operations",
    description: "Optimize sales automation workflows based on customer needs.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Sales automation workflows",
      welcomeCard: welcomeCardDefault,
      icon: workflowIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "What goal do you want to achieve with automation?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Please generate a sales automation workflow for @company-name, that automates the sales process for @product-service. The workflow should be designed to help us @goal, while also taking into account the unique needs of our customers.
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
    name: "Sales policy frameworks",
    icon: policyIcon.src,
    category: "Sales",
    subcategory: "Sales Operations",
    description: "Create comprehensive sales policy frameworks for your business.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Sales policy frameworks",
      welcomeCard: welcomeCardDefault,
      icon: policyIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "policy-areas",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some specifc policy areas to generate the framework",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Please provide a sales policy framework for @company-name, that outlines the policies for @policy-areas and takes into account the unique needs of our business and industry.
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
    name: "Feedback for proposals",
    icon: feedbackProposalIcon.src,
    category: "Sales",
    subcategory: "Proporsal Development",
    description: "Find constructive feedback on proposal drafts.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Feedback for proposals",
      welcomeCard: welcomeCardDefault,
      icon: feedbackProposalIcon.src,
      questions: [
        {
          id: "draft-proporsal",
          type: TWorkflowQuestionType.OpenText,
          headline: "Copy-paste your draft proposal",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        CONTEXT:
        You are Proposal Feedback GPT, an experienced evaluator of business proposals with a knack for identifying strengths and weaknesses. Your role is to provide detailed, objective feedback to enhance the quality of proposals.
        
        GOAL:
        I'm looking for detailed feedback on my draft proposal. Your insights will help me identify areas for improvement and ensure my proposal is robust, coherent, and appealing.
        
        FEEDBACK PROCESS:
        - I will provide the draft proposal
        - You will review the proposal thoroughly
        - You will provide specific feedback on key sections
        - You will rate the overall proposal and suggest improvements
        - I may ask for clarification or further advice on your feedback
        
        PROPOSAL FEEDBACK CRITERIA:
        - Focus on both content and presentation aspects
        - Offer constructive criticism and actionable suggestions
        - Be honest and objective in your assessment
        - Address the proposal's alignment with its intended audience and purpose
        
        FORMAT OF OUR INTERACTION:
        I will present the proposal and ask for feedback on specific sections or elements
        You will provide your feedback in a structured and clear manner
        We will interact in a back-and-forth manner for clarifications and additional insights
        
        - @draft-proporsal
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
    name: "Proposal template libraries",
    icon: proposalTemplateIcon.src,
    category: "Sales",
    subcategory: "Proporsal Development",
    description: "Create multiple proposal templates for different product and services.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
    ],
    isPremium: false,
    preset: {
      name: "Proposal template libraries",
      welcomeCard: welcomeCardDefault,
      icon: proposalTemplateIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to create a new proposal template for our @product-service. Can you help me gather and organize the key information that should be included in the proposal, and provide suggestions for formatting and structure?
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
    name: "Influencer contracts",
    icon: cameraIcon.src,
    category: "Sales",
    subcategory: "Social Media Management",
    description: "Create detailed influencer contracts to manage different marketing campaigns.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion", "other"],
    isPremium: false,
    preset: {
      name: "Influencer contracts",
      welcomeCard: welcomeCardDefault,
      icon: cameraIcon.src,
      questions: [
        {
          id: "influencer-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the name of the influencer",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - We're launching a new social media campaign and need to create influencer contracts that protect our brand and ensure compliance with all legal requirements. Can you provide guidance and recommendations on how to craft effective influencer contracts?
        - Can you help me draft an influencer contract for @influencer-name that includes all necessary legal requirements and sets clear expectations for the campaign goals and deliverables?
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
    name: "Customer engagement reports",
    icon: engagementReportIcon.src,
    category: "Sales",
    subcategory: "Social Media Management",
    description: "Make customer engagement and satisfaction reports to improve CX.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
    ],
    isPremium: false,
    preset: {
      name: "Customer engagement reports",
      welcomeCard: welcomeCardDefault,
      icon: engagementReportIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What metrics should I use to measure customer engagement and satisfaction, and how can I track them over time to monitor the effectiveness of our engagement strategies?
        - Can you help me generate a report that provides insights into @product-service preferences, purchase behavior, and feedback to inform our engagement strategy?
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
    name: "Social media hashtags",
    icon: hashtagIcon.src,
    category: "Sales",
    subcategory: "Social Media Management",
    description: "Enhance your brand's social media hashtag strategy.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      name: "Social media hashtags",
      welcomeCard: welcomeCardDefault,
      icon: hashtagIcon.src,
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some trending hashtags in the @industry industry that we could use to increase our social media visibility and engagement, particularly among @target-audience?
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
    name: "Brand voice guidelines",
    icon: voiceIcon.src,
    category: "Sales",
    subcategory: "Social Media Management",
    description: "Develop consistent brand voice guidelines based on your business type.",
    objectives: ["enhance_online_presence", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Brand voice guidelines",
      welcomeCard: welcomeCardDefault,
      icon: voiceIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to create a brand voice guideline for my @product-service that is clear and concise. Can you provide me with some suggestions on how to achieve this?
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
    name: "Social media captions",
    icon: captionIcon.src,
    category: "Sales",
    subcategory: "Social Media Management",
    description: "Write compelling and data-driven social media captions.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      name: "Social media captions",
      welcomeCard: welcomeCardDefault,
      icon: captionIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - How can we use data to craft a social media caption that resonates with @target-audience and highlights the unique features of our @product-service?`,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Feedback request emails",
    icon: feedbackRequestIcon.src,
    category: "Sales",
    subcategory: "Customer Feedback",
    description: "Create feedback request emails that are easy to complete.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Feedback request emails",
      welcomeCard: welcomeCardDefault,
      icon: feedbackRequestIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you give me some tips on how to write a feedback request email that is concise but also covers all the important aspects?
        - What are some ways to incentivize customers to provide feedback in a feedback request email?
        - Can you suggest a template for a feedback request email for a new product launch to @company-name customers?
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
    name: "Customer review responses",
    icon: reviewResponseIcon.src,
    category: "Sales",
    subcategory: "Customer Feedback",
    description: "Write customized responses to customer reviews.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Customer review responses",
      welcomeCard: welcomeCardDefault,
      icon: reviewResponseIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide me with a template for a response to a review that highlights the benefits of our @product-service?
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
    name: "Email response templates",
    icon: emailResponseIcon.src,
    category: "Sales",
    subcategory: "Email management",
    description: "Generate personalized email templates based on best practices.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Email response templates",
      welcomeCard: welcomeCardDefault,
      icon: emailResponseIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - What are some best practices for crafting email response templates that are personalized and engaging for @product-service
        - What are some key metrics and KPIs that can be used to measure the effectiveness of email response templates and overall customer service performance?
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
    name: "Email marketing campaign calendars",
    icon: calendarIcon.src,
    category: "Sales",
    subcategory: "Email management",
    description: "Personalize email campaign timing to your specific needs.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      name: "Email marketing campaign calendars",
      welcomeCard: welcomeCardDefault,
      icon: calendarIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "time-preiod",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us a time period for the email campaign",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you suggest a calendar of email campaigns for @product-service for the @time-period, including the email content and the target audience?
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
    name: "Follow-up sales emails",
    icon: followupEmailsIcon.src,
    category: "Sales",
    subcategory: "Email management",
    description: "Create compelling follow-up emails for client engagement.",
    objectives: ["boost_engagement_and_conversion", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Follow-up sales emails",
      welcomeCard: welcomeCardDefault,
      icon: followupEmailsIcon.src,
      questions: [
        {
          id: "role",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your role",
          subheader: "E.g. Sales Representative",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us what is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "last-interaction",
          type: TWorkflowQuestionType.OpenText,
          headline: "What was the last interaction with your client?",
          subheader: "Details about your last communication or meeting with the client",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Context: You are Sales Communication GPT, an expert in crafting persuasive and effective follow-up communications for sales professionals. With a deep understanding of client psychology and sales tactics, you specialize in composing emails that encourage positive client responses.

        Goal: Create a follow-up email that will engage my client and encourage them to take the next step in the sales process.
        
        Email Structure:
        Opening: Personalized greeting and a warm reminder of our last interaction.
        Body:
        Recap of the client's needs and how our product/service addresses them.
        Any new information or updates about our product/service that might interest the client.
        A subtle urgency or incentive to prompt a response or action.
        Closing: Clear call-to-action, and an invitation for further dialogue.
        Signature: Professional sign-off with my contact details.
        
        Email Criteria:
        - Personalization: Tailor the email to reflect the client's industry, company, or specific needs discussed previously.
        - Clarity: Communicate the message concisely and clearly, avoiding jargon or overly technical terms.
        - Engagement: Use engaging language and, if appropriate, a touch of humor to build rapport.
        - Professionalism: Maintain a tone that is professional yet approachable.
        - Action-oriented: Include a clear call-to-action that guides the client to the next step.
        
        Information About Me:
        - My role: @role
        - My industry: @industry
        - My product/service: @product-service
        - Client's last interaction: @last-interaction
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
    name: "Targeted email segmentations",
    icon: targetEmailIcon.src,
    category: "Sales",
    subcategory: "Email management",
    description: "Enhance email segmentation depending on your needs.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Targeted email segmentations",
      welcomeCard: welcomeCardDefault,
      icon: targetEmailIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide me with segmentation ideas for @industry customers who are interested in @product-service?
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
    name: "Email newsletter content",
    icon: newsletterIcon.src,
    category: "Sales",
    subcategory: "Email management",
    description: "Generate email newsletter thought-provoking content ideas.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      name: "Email newsletter content",
      welcomeCard: welcomeCardDefault,
      icon: newsletterIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me generate an email newsletter for @company-name that includes updates on @product-service, upcoming events, and a featured article from one of our experts? Please include a call-to-action for signing up for our newsletter and sharing on social media.
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
    name: "Market analysis models",
    icon: marketModelsIcon.src,
    category: "Sales",
    subcategory: "Marketing research",
    description: "Create predictive market analysis based on your industry or niche.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Market analysis models",
      welcomeCard: welcomeCardDefault,
      icon: marketModelsIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or niche of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - We need to develop a predictive market analysis model for our @industry. Can you provide insights and analysis based on historical data and industry trends that can help us make informed business decisions?
        - We want to understand the factors that influence customer behavior and preferences in the [Industry/Niche] and develop a predictive model based on these insights. Can you help us identify key trends and patterns in customer behavior?
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
    name: "Customer engagement strategies",
    icon: customerEngagementIcon.src,
    category: "Sales",
    subcategory: "Marketing research",
    description: "Create customer engagement strategies based on their behaviour.",
    objectives: [
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Customer engagement strategies",
      welcomeCard: welcomeCardDefault,
      icon: customerEngagementIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or sector of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you provide an analysis of customer behavior and preferences related to @product-service that can inform our customer engagement strategy?
        - What are some examples of successful customer engagement strategies used by companies in @industry that we can learn from and adapt to our own needs?
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
    name: "Customer personas generator",
    icon: buyerPersonaIcon.src,
    category: "Sales",
    subcategory: "Marketing research",
    description: "Generate customer personas including behavior and preferences.",
    objectives: ["improve_business_strategy", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Customer personas generator",
      welcomeCard: welcomeCardDefault,
      icon: buyerPersonaIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry or segment of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me create a customer persona for @product-service 's target audience in the @industry? Can you provide insights into their behavior, preferences, and motivations?
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
    name: "Partnership feedback loop",
    icon: loopIcon.src,
    category: "Sales",
    subcategory: "Partnership Management",
    description: "Learn to orchestrate harmonious partnerships.",
    objectives: [
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Partnership feedback loop",
      welcomeCard: welcomeCardDefault,
      icon: loopIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-partners",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are your ideal Business partners?",
          subheader: "Describe Ideal Business Partners",
          required: true,
          inputType: "text",
        },
        {
          id: "target-partners",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are your partnership objectives?",
          subheader: "List specific partnership objectives",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Overview:
        This prompt is designed for sales professionals seeking to enhance their partnership management skills. As Sales Partnership Optimizer GPT, you provide strategic advice on managing and nurturing business relationships, focusing on mutual growth and efficient collaboration.
        
        Context:
        You are Sales Partnership Optimizer GPT, an expert in developing and maintaining effective sales partnerships. Your expertise lies in identifying key partnership opportunities, creating synergies between partners, and implementing strategies for long-term success.
        
        Goal:
        Your objective is to provide actionable strategies for managing sales partnerships, ensuring mutual benefits and sustained growth.
        
        Partnership Management Process:
        - Identification: How to identify potential partners that align with our business goals?
        - Initiation: Best practices for initiating contact and proposing partnerships.
        - Negotiation: Key elements for successful partnership negotiations.
        - Collaboration: Strategies for maintaining a healthy and productive relationship.
        - Growth: Methods to jointly grow and expand partnership benefits.
        
        Partnership Management Criteria:
        - Return 3 strategies or action steps for each phase of the partnership management process.
        - Strategies should be specific, outlining clear actions and expected outcomes.
        - Focus on innovative and effective practices that stand out in the industry.
        - Emphasize low-cost, high-impact strategies suitable for various business sizes.
        - Provide real-world examples or case studies where similar strategies have proven successful.
        
        Information About Me:
        - My industry: @industry
        - My target partners: @target-partners
        - My business goals: @business-goal
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
    name: "Cross-promotion marketing campaigns",
    icon: campaignIcon.src,
    category: "Sales",
    subcategory: "Partnership Management",
    description: "Create cross-promotion campaigns including timeline, budget, and KPIs.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Cross-promotion marketing campaigns",
      welcomeCard: welcomeCardDefault,
      icon: campaignIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you generate cross-promotion campaign ideas for @product-service that will appeal to @target-audience, and suggest potential partner brands and channels for promotion?
        - Please create a detailed cross-promotion marketing plan for @product-service that includes a timeline, budget, and metrics for measuring success, and incorporates both online and offline channels.
        - I need help identifying potential partner brands and audiences for a cross-promotion campaign for @product-service that aligns with our company values and mission.
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
    name: "Lead nurturing chatbot scripts",
    icon: chatbotIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Create a lead nurturing chatbot script based on your sales playbook.",
    objectives: ["streamline_operations_and_sales", "other"],
    isPremium: false,
    preset: {
      name: "Lead nurturing chatbot scripts",
      welcomeCard: welcomeCardDefault,
      icon: chatbotIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "Could you tell us what is your product or service?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "questions",
          type: TWorkflowQuestionType.OpenText,
          headline: "List some questions you want the chatbot to answer",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "sales-funnel",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the sales funnel?",
          subheader: "Sales funnel / Buyer's journey",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me create a custom lead nurturing chatbot script for @company-name, that can answer @questions about our @product-service and guide users through the @sales-funnel?"
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
    name: "Drip email campaigns",
    icon: dripIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Streamline drip email campaign creation with AI's personalized content generation.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Drip email campaigns",
      welcomeCard: welcomeCardDefault,
      icon: dripIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
        {
          id: "interests-needs",
          type: TWorkflowQuestionType.OpenText,
          headline: "Name some interests or needs of your target audience ",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me create a drip email campaign for @product-service targeting @target-audience who are interested in @interests-needs?
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
    name: "Lead nurturing KPI dashboards",
    icon: kpiIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Optimize lead nurturing strategies with autogenerated KPI dashboards.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      name: "Lead nurturing KPI dashboards",
      welcomeCard: welcomeCardDefault,
      icon: kpiIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help us create a lead nurturing KPI dashboard that includes metrics such as lead velocity, lead quality, engagement rates, and conversion rates, and provides insights on which campaigns and channels are driving the most ROI for @product-service?`,
        attributes: {},
        isVisible: true,
        engine: OpenAIModel.GPT4,
      },
      thankYouCard: thankYouCardDefault,
      hiddenFields: hiddenFieldsDefault,
    },
  },
  {
    name: "Lead magnet campaigns",
    icon: magnetIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Generate lead magnet campaigns to get emails and nurture your leads.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      name: "Lead magnet campaigns",
      welcomeCard: welcomeCardDefault,
      icon: magnetIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        I need help creating a lead magnet campaign for @company-name , @product-service. Can you suggest some ideas for lead magnets that would appeal to our target audience of @target-audience?"
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
    name: "Lead nurturing optimization",
    icon: optimizeIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Optimize lead nurturing analyzing KPIs and refining strategies.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Lead nurturing optimization",
      welcomeCard: welcomeCardDefault,
      icon: optimizeIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "improvements",
          type: TWorkflowQuestionType.OpenText,
          headline: "What would you like to improve?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "improvements",
          type: TWorkflowQuestionType.OpenText,
          headline: "What would you like to improve?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
        {
          id: "roi",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your ROI?",
          subheader: "Please be as specific as possible.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need to analyze the results of @company-name for the @product-service, and identify areas for improvement @improvements. Can you provide recommendations for how to refine our performance optimization framework and improve our ROI @roi?
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
    name: "Lead nurturing workflows",
    icon: outreachEmailIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Personalize lead nurturing workflows to engage and convert leads.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Lead nurturing workflows",
      welcomeCard: welcomeCardDefault,
      icon: outreachEmailIcon.src,
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target audience?",
          subheader: "E.g. Tech-Savvy Consumers",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - Can you help me create a lead nurturing workflow for @product-service that targets @target-audience and includes personalized email content at each stage of the journey? Please provide recommendations on how to optimize the workflow and measure its effectiveness.
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
    name: "Lead nurturing email templates",
    icon: emailTemplatesIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Create data-driven lead nurturing email templates, optimizing engagement and conversions.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_customer_and_employee_experience",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Lead nurturing email templates",
      welcomeCard: welcomeCardDefault,
      icon: emailTemplatesIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your product or service about?",
          subheader: "E.g. Actionable DIY marketing guides and video courses.",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I want to send a re-engagement email to @company-name @product-service subscribers who haven't opened or clicked on recent emails. Can you suggest some attention-grabbing subject lines and a compelling message that encourages them to re-engage with the course and our brand?
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
    name: "Customer loyalty programs",
    icon: loyaltyIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Design personalized loyalty programs, enhancing customer retention and brand loyalty.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "improve_customer_and_employee_experience",
    ],
    isPremium: false,
    preset: {
      name: "Customer loyalty programs",
      welcomeCard: welcomeCardDefault,
      icon: loyaltyIcon.src,
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the company",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "exclusive-discounts",
          type: TWorkflowQuestionType.OpenText,
          headline: "Tell us the exclusive discount you want to offer",
          subheader: "E.g. early access, loyalty rewards",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        - I need a loyalty program that encourages repeat purchases and upselling. Can you generate a program that offers @exclusive-discounts for customers who make multiple purchases or upgrade to premium services?
        - Can you help me create a loyalty program that integrates with our existing rewards program? The program should provide additional benefits and perks for our most loyal customers, and should be seamless and easy to participate in.
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
    name: "Sales incentive programs",
    icon: salesIncentiveIcon.src,
    category: "Sales",
    subcategory: "Lead Nurturing",
    description: "Generate unique and effective sales incentive strategies.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      name: "Sales incentive programs",
      welcomeCard: welcomeCardDefault,
      icon: salesIncentiveIcon.src,
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the industry of your business?",
          subheader: "E.g. Consumer Electronics",
          required: true,
          inputType: "text",
        },
        {
          id: "team-size",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your team size?",
          subheader: "Set a number",
          required: true,
          inputType: "text",
        },
        {
          id: "average-sales",
          type: TWorkflowQuestionType.OpenText,
          headline: "Average Sales Target",
          subheader: "E.g. $50,000 per month per representative",
          required: true,
          inputType: "text",
        },
        {
          id: "incentive-structure",
          type: TWorkflowQuestionType.OpenText,
          headline: "Current Incentive Structure",
          subheader: "E.g. Primarily commission-based with annual bonuses",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Context:
        You are Sales Incentive Planner GPT, a renowned expert in designing sales incentive programs. You specialize in creating unique, motivating, and achievable incentives for sales teams in various industries.
        
        Goal:
        I need to develop a new sales incentive plan for my team. The plan should be innovative, motivating, and feasible within my company's budget and policies.
        
        Sales Incentive Plan Criteria:
        - Innovation: Propose incentives that go beyond traditional monetary rewards.
        - Motivation: Ensure that the incentives are genuinely motivating for the sales team.
        - Feasibility: The ideas should be executable within a typical corporate structure and budget.
        - Variety: Offer a mix of short-term and long-term incentives.
        - Personalization: Include options that can be tailored to individual preferences or performance levels.
        
        Information About My Team:
        - Team Size: @team-size
        - Industry: @industry
        - Average Sales Target: @average-sales
        - Current Incentive Structure: @incentive-structure
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
    name: "Cold Email Generator",
    icon: coldEmailIcon.src,
    category: "Sales",
    subcategory: "Email",
    description: "Create custom cold emails in seconds to boost sales opportunities.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: true,
    preset: {
      name: "Cold Email Generator",
      welcomeCard: welcomeCardDefault,
      icon: coldEmailIcon.src,
      questions: [
        {
          id: "lead-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your lead's name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "lead-company-do",
          type: TWorkflowQuestionType.OpenText,
          headline: "What does the lead's company do?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "challenges",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the main challenges of the lead?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "lead-company",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of the lead's company?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the lead's position?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "my-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "company-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of your company?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "sector-industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the sector or industry of the lead?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "solution",
          type: TWorkflowQuestionType.OpenText,
          headline: "What solution do you offer?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefits",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the benefits of your service or product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        @lead-name , holding the position of @position at @lead-company in this industry @lead-company-do faces these challenges: @challenges . The company specializes in @lead-company-do .
        
        My company @company-name offers @solution with these benefits @benefits .
        
        Write a first cold email choosing only one of these [structures] randomly:
        
        [Structure 1 based on problem-solution]: Start by identifying a specific problem your prospect might be facing and then present your product or service as the solution. This structure focuses on creating an immediate connection through a deep understanding of the prospect's challenges.
        
        Example of structure 1:
        Subject: Improve Your Time Management with @solution
        
        Hi @lead-name ,
        
        Many professionals in @lead-company-do struggle with efficient time management, preventing them from maximizing their productivity. Do you face this challenge in your day-to-day?
        
        I'm @my-name , from @company-name . Our tool helps optimize your schedule and prioritize tasks effectively, giving you more control over your time.
        
        Could we have a meeting this week to show you a demo?
        
        Here is the link to my calendar:
        
        [Structure 2 based on open-ended questions]: Start the email with an open-ended question that invites the prospect to reflect on their current situation and possible improvements. This can help generate curiosity and encourage a response.
        
        Example of structure 2:
        
        Subject: How is Project Management Impacting Your ROI?
        
        Hi @lead-name ,
        
        How are you ensuring that each project contributes positively to your return on investment in @sector-industry ?
        
        I'm @my-name with @company-name, and we've helped companies like yours to improve visibility and control over their projects, ensuring each one is a profitable investment.
        
        I would love to learn more about your current strategies to discuss how we can support you.
        
        [Structure 3 based on value]: Highlight the unique value your product or service can bring to the prospect. Instead of focusing on features, concentrate the message on how you can help improve their business or personal life.
        
        Example of structure 3:
        
        Subject: Transform Your Operational Efficiency with @company-name
        
        Hi @lead-name ,
        
        Have you faced the challenge of managing inefficient processes that drain your time and resources? At @company-name , we specialize in turning those challenges into efficiency and growth.
        
        I'm @my-name , and I've seen how businesses in @sector-industry like yours encounter obstacles that prevent them from reaching their full potential. Our innovative solution simplifies complex operations, automates tedious tasks, and frees up valuable resources, allowing you to focus on growth strategies and what truly matters.
        
        Imagine significantly reducing the time spent on manual processes, improving not only productivity but also your team's satisfaction. I am confident that a collaboration between
        
        lead-company and @company-name can unlock this potential.
        
        Can we schedule a 15-minute call this week to explore how our solution can be tailored to your specific needs?
        
        I look forward to your response.
        
        Kind regards.
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
    name: "E-commerce product descriptions",
    icon: cartIcon.src,
    category: "Sales",
    subcategory: "E-commerce",
    description: "Generate ecommerce product descriptions without effort.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      name: "E-commerce product descriptions",
      welcomeCard: welcomeCardDefault,
      icon: cartIcon.src,
      questions: [
        {
          id: "product-type",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of product is it?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "category",
          type: TWorkflowQuestionType.OpenText,
          headline: "Under which category does the product fall?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "activity",
          type: TWorkflowQuestionType.OpenText,
          headline: "What specific activity is the product designed for?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "size",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the size or measurement of the product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "brand",
          type: TWorkflowQuestionType.OpenText,
          headline: "Which brand manufactures the product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "color",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the color of the product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "gender",
          type: TWorkflowQuestionType.OpenText,
          headline: "Is the product specifically designed for a particular gender?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefit-1",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the first benefit or advantage of using this product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefit-2",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the second benefit or advantage of using this product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefit-3",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the third benefit or advantage of using this product?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        You are a seller on Amazon and you need to create descriptions for a product catalog.
        
        The product has all these characteristics:
        - Product type: @product-type
        - Category: @category
        - Activity: @activity
        - Size: @size
        - Brand: @brand
        - Color: @color
        - Gender: @gender
        
        And it has these benefits:
        - Benefit 1: @benefit-1
        - Benefit 2: @benefit-2
        - Benefit 3: @benefit-3
        
        To generate the description, use the following structure:
        First: Bullet Points: 5 key points highlighting benefits and features (advantages, uses, technical specifications, etc.). The goal is to provide quick and easy-to-digest information that addresses buyers' main questions.
        Second: Detailed Product Description: Brief introduction + Detailed description (including usage context, compatibility, care instructions, etc.) + Warranty or support information. The aim is to expand on the key points, offering context and addressing potential specific queries.     
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
    name: "Business Model Ideas Generator",
    icon: ideaIcon.src,
    category: "Sales",
    subcategory: "Business",
    description: "Generate low-investment, digital business ideas with a business model canvas.",
    objectives: [
      "boost_engagement_and_conversion",
      "innovate_and_develop",
      "streamline_operations_and_sales",
    ],
    isPremium: true,
    preset: {
      name: "Business Model Ideas Generator",
      welcomeCard: welcomeCardDefault,
      icon: ideaIcon.src,
      questions: [
        {
          id: "sector",
          type: TWorkflowQuestionType.OpenText,
          headline: "Which sector are you targeting?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        You are a Silicon Valley entrepreneur looking to generate digital business ideas that don't require a large investment and can be implemented relatively easily without facing too much competition or entry barriers.

        You want to break into the @sector sector and are searching for business ideas.

        Step 1: Research the latest current trends, make a list, and based on them, identify 5 unsolved problems. Propose 5 solutions that could be implemented and how to solve them through business models.

        Step 2: Evaluate by degree of difficulty which is the easiest, has the highest profitability, and the greatest chances of success. Present the solution in a business model canvas.
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
    name: "Custom Price Quotes",
    icon: priceIcon.src,
    category: "Sales",
    subcategory: "Business",
    description: "Create a budget with services, prices, and a timeline for a client project.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: true,
    preset: {
      name: "Custom Price Quotes",
      welcomeCard: welcomeCardDefault,
      icon: priceIcon.src,
      questions: [
        {
          id: "client-name",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your name?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "client-company",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the name of your company?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "service1",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of service do you want?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goals",
          type: TWorkflowQuestionType.OpenText,
          headline: "What goals do you want to achieve?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "service2",
          type: TWorkflowQuestionType.OpenText,
          headline: "Will you have other services?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Generate a budget for the following concepts:

        Use this structure:
        Index: Listing of the sections of the document.
        Introduction: Thanks to @client-name from @client-company , brief description of the project and its goals @goals .
        Detail of services and prices
        
        Services offered: Detailed list of all the proposed services:

        - @service1
        - @service2
        
        Prices: Individual cost of each service.
        Price justification: Brief explanation of the value each service brings to the project.
        Project Timeline
        Project phases: Breakdown of the project stages with their respective estimated durations.
        Key dates: Includes start dates, major milestones, and expected completion date taking as reference one week from today.
        
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
    name: "Customer Journey Map Generator",
    icon: journeyIcon.src,
    category: "Sales",
    subcategory: "Business",
    description: "Create a customer journey map including touchpoints, KPIs, and roles.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: true,
    preset: {
      name: "Customer Journey Map Generator",
      welcomeCard: welcomeCardDefault,
      icon: journeyIcon.src,
      questions: [
        {
          id: "business",
          type: TWorkflowQuestionType.OpenText,
          headline: "What kind of business do you want to generate a customer journey map for?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "In which industry?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the goal of the customer journey map?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        You are a Customer Experience expert and you need to generate a customer journey map. 

        Follow these steps:
        
        Step 1: Create a buyer persona for a typical buyer of @business and specifically in this industry: @industry . Your goal is @goal .
        
        Step 2: Based on this buyer persona and the @goal , generate a customer journey map that includes the following sections:
        Stages of the customer journey map: awareness, consideration, decision, purchase, post-purchase, loyalty, advocacy.
        Define and map the customer touchpoints
        Define the jobs to be done at each stage
        Assign an emotional state at each stage using emojis
        Create KPIs for each stage
        Assign a team member responsible for the work     
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
    name: "Email Subject Generator",
    icon: subjectIcon.src,
    category: "Sales",
    subcategory: "Copywriting",
    description: "Generate email subjects to achieve a goal, focusing on a company's benefits and solutions.",
    objectives: ["boost_engagement_and_conversion"],
    isPremium: true,
    preset: {
      name: "Email Subject Generator",
      welcomeCard: welcomeCardDefault,
      icon: subjectIcon.src,
      questions: [
        {
          id: "focus",
          type: TWorkflowQuestionType.OpenText,
          headline: "What does your company do?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefit",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the main benefit of your product, service, or promotion?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "solution",
          type: TWorkflowQuestionType.OpenText,
          headline: "What main problem does your product or service solve?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the goal of the email? ",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Generate email subjects (maximum 15 words) with the goal of @goal for a company that focuses on @focus and whose solution involves @solution thanks to its @benefit .
        
        Use these structures and generate email subjects:
        
        Structure 1: @benefit + [Limited Time]
        Example: "Boost your productivity by 50%: Access the course before Sunday"
        
        Structure 2: @solution  + [Limited availability]
        Example: "Eliminate back pain in 30 days: Only 100 spots available"
        
        Structure 3: Resonating question
        Example: "Would you like to double your income in 6 months?"
        
        Structure 4: Specific benefit
        Example: "Save 50% on your next purchase: only until midnight"
        
        Structure 5: Scarcity or urgency
        Example: "Last chance: enroll before spots run out"
        
        Structure 6: Intrigue or mystery
        Example: "The secret fitness experts don't want you to know"
        
        Structure 7: Exclusivity
        Example: "Early access for subscribers only: new collection launched"
        
        Structure 8: Stories or anecdotes
        Example: "How [name] transformed their business with a simple strategy"
        
        Structure 9: Provocation or controversy
        Example: "Why everything you know about [subject] is wrong"
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
    name: "Empathy Map Generator",
    icon: empathyMapIcon.src,
    category: "Sales",
    subcategory: "Business",
    description: "Create empathy maps for any customers, focusing on their needs and experiences.",
    objectives: ["improve_business_strategy", "improve_customer_and_employee_experience"],
    isPremium: true,
    preset: {
      name: "Empathy Map Generator",
      welcomeCard: welcomeCardDefault,
      icon: empathyMapIcon.src,
      questions: [
        {
          id: "business",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of business do you want to generate an empathy map for?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "In which industry?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "age",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the predominant age of your customers?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "gender",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the predominant gender of your customers?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "goal",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the goal of the empathy map?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        You are a marketing expert and you need to generate an empathy map. Follow these steps:

        Step 1: create a buyer persona for a typical buyer from @business with this age @age , with this gender @gender , and specifically in this industry: @industry . Your goal is @goal .
        
        Step 2: based on this buyer persona and the goal @goal , generate an empathy map that includes these sections:
        
        What they think and feel: what truly matters to them, that is, their main concerns, aspirations, and worries.
        What they hear: What people who influence their decisions say.
        What they see: In their environment, among their friends, in the market
        What they say and do: attitude in public, appearance, behavior towards others
        Pain points: pain points and fears
        Outcomes: benefits                 
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
    name: "Unique Sales Proposal Generator",
    icon: salesProposalIcon.src,
    category: "Sales",
    subcategory: "Business",
    description: "Generate a unique value proposition for businesses based on expert methods.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: true,
    preset: {
      name: "Unique Sales Proposal Generator",
      welcomeCard: welcomeCardDefault,
      icon: salesProposalIcon.src,
      questions: [
        {
          id: "business",
          type: TWorkflowQuestionType.OpenText,
          headline: "What type of business do you want to generate a unique value proposition for?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "solution",
          type: TWorkflowQuestionType.OpenText,
          headline: "What problem does your product solve?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionType.OpenText,
          headline: "In which industry?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "age",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the predominant age of your customers?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "gender",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is the predominant gender of your customers?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "products",
          type: TWorkflowQuestionType.OpenText,
          headline: "What products or services do you offer?",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "benefits",
          type: TWorkflowQuestionType.OpenText,
          headline: "What are the main benefits of your product or service?",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        You are a marketing expert and you have to generate a unique value proposition for this @business . Follow these steps:

        Step 1: Generate a buyer persona for a typical @business buyer of this age @age , with this @gender specifically in this industry: @industry .
        
        Step 2: Based on this buyer persona, generate 3 unique value propositions using these 3 methods (1 for each):
        
        - Steve Blank value proposition method: Instead of focusing on the features, Blank emphasizes the benefits derived from the features in a simple sentence. By following this formula, you'll connect the target market and their pain points to the solution: "We help [Buyer persona] do @benefit by doing @solution "
        - Geoff Moore Method value proposition formula: "For [buyer persona] who [needs or wants X], our @products is @industry that @benefits "
        - Harvard Business School value proposition method:
          - "What is my brand offering?"
          - "What job does the customer hire my brand to do?"
          - "What companies and products compete with my brand to do this job for the customer?"
          - "What sets my brand apart from competitors?"                          
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
    name: "SWOT Analysis",
    icon: swotIcon.src,
    category: "Sales",
    subcategory: "Business",
    description: "Conduct a SWOT analysis of a business based on its products, services and market.",
    objectives: [
      "boost_engagement_and_conversion",
      "improve_business_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: true,
    preset: {
      name: "SWOT Analysis",
      welcomeCard: welcomeCardDefault,
      icon: swotIcon.src,
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionType.OpenText,
          headline: "What products or services do you sell? ",
          subheader: "",
          required: true,
          inputType: "text",
        },
        {
          id: "target-market",
          type: TWorkflowQuestionType.OpenText,
          headline: "What is your target market? ",
          subheader: "",
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",
        description: "Prompt",
        message: `
        Develop a SWOT analysis for a company that sells these products and services @product and whose target market is @target-market. To do this, answer all these questions by analyzing the business and the specific market in which it operates, connecting to the internet to carry out the analysis.

        Strengths
        
        - What do you consider to be the strongest aspects of your product or service?
        - In what areas do you feel you surpass your competition?
        - What internal processes contribute to your success?
        - How would you rate the loyalty and satisfaction of your current customer?
        - Do you have any unique advantages in the supply chain or access to exclusive resources?
        
        Weaknesses
        
        - What are the biggest internal challenges your business faces?
        - Are there areas where your competition has a clear advantage over you?
        - How do you assess the effectiveness of your current marketing strategies?
        - What financial or resource limitations do you face?
        - Do you identify any friction points in the customer experience?
        
        Opportunities
        
        - Do you see any emerging trends in the @target-market market that you could leverage?
        - Are there new markets or demographic segments you have not yet explored?
        - Are there potential strategic alliances or collaborations that could benefit your business?
        - How could you use technology to improve your product or process?
        - Are there events, fairs, or exhibitions participating in which could increase your visibility?
        
        Threats
        
        - What are the main economic or market concerns that could affect you?
        - How could government regulations impact your business?
        - Do you see any trends in consumption habits that could represent a threat?
        - What is the impact of competition on your market share?
        - How could changes in the supply chain affect your operation?                               
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
