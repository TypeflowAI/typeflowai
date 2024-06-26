import { OpenAIModel } from "@typeflowai/types/openai";
import { TTemplate } from "@typeflowai/types/templates";
import {
  TWorkflowHiddenFields,
  TWorkflowQuestionTypeEnum,
  TWorkflowThankYouCard,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";

const thankYouCardDefault: TWorkflowThankYouCard = {
  enabled: true,
  headline: { default: "Thank you!" },
  subheader: { default: "We appreciate your feedback." },
  buttonLabel: { default: "Create your own Workflow" },
  buttonLink: "https://typeflowai.com/signup",
};

const hiddenFieldsDefault: TWorkflowHiddenFields = {
  enabled: true,
  fieldIds: [],
};

const welcomeCardDefault: TWorkflowWelcomeCard = {
  enabled: false,
  headline: { default: "Welcome!" },
  html: { default: "Thanks for providing your feedback - let's go!" },
  timeToFinish: false,
  showResponseCount: false,
};

const workflowDefault: TTemplate["preset"] = {
  name: "New Workflow",
  welcomeCard: welcomeCardDefault,
  prompt: {
    enabled: false,
    id: "prompt",
    message: "",
    attributes: {},
    isVisible: true,
    isStreaming: false,
    allowRetry: false,
    engine: OpenAIModel.GPT35Turbo,
  },
  thankYouCard: thankYouCardDefault,
  hiddenFields: hiddenFieldsDefault,
  questions: [],
};

export const marketingTemplates: TTemplate[] = [
  {
    name: "Marketing Research",
    icon: "ResearchIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Decipher customer behavior, unveil trends and get new marketing insights.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Marketing Research",
      icon: "ResearchIcon",
      questions: [
        {
          id: "market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What market do you serve?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "business-nature",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business nature?" },
          subheader: { default: "E.g. To-do app tailored for Solopreneurs" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target market?" },
          subheader: {
            default:
              "E.g. Solopreneurs involved in developing micro SaaS, productized services, and content-driven products",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        As Market Researcher GPT, your role is to aid entrepreneurs in pinpointing and exploiting shifts and trends in the market: @market. Your expertise lies in uncovering market dynamics that are often unnoticed by typical market researchers.         
        GOAL:
        Deliver a list of 3 customer behavior changes and five alterations in the competitive environment relevant to my business. I aim to capitalize on these evolving trends to boost future earnings.          
        MARKET RESEARCH CRITERIA:         
        Target market shifts that are unique and typically under the radar, steering clear of conventional trends.
        Focus on trends relevant to small-scale businesses, excluding those impacting only large corporations.
        Emphasize current shifts that are not fully leveraged by the majority of companies.
        Ensure clarity and brevity in your insights, avoiding vague and uninformative statements.         
        INFORMATION ABOUT ME:
        Business nature: @business-nature
        Target market: @target-market 
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Marketing Strategy Funnel",
    icon: "FunnelIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Build an effective funnel: from interest to loyalty.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Marketing Strategy Funnel",
      icon: "FunnelIcon",
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service?" },
          subheader: {
            default:
              "E.g Customizable software solutions for appointment scheduling, client management, and online booking, priced at various tiers from $79 to $199.",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: {
            default: "E.g. Small and Medium-sized Businesses (SMBs) in the health and wellness industry.",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT: 
        You are engaged as Marketing Funnel GPT, specializing in guiding Solopreneurs to structure their marketing funnels. Your expertise lies in effectively implementing the AIDA framework for practical business applications.
        
        GOAL:
        Your task is to outline creative and feasible marketing funnel strategies for my business, aimed at enhancing user acquisition, activation, and monetization.

        MARKETING FUNNEL STRUCTURE:
        Awareness: Strategies to drive traffic to the website.
        Interest: Tactics to help visitors realize the value of the product.
        Desire: Approaches to convert website visitors into paying customers.
        Action: Ways to motivate new customers  

        MARKETING FUNNEL CRITERIA:
        Provide three innovative ideas for each funnel stage.
        Detail specificity in each suggestion, avoiding general statements like "post on social media." Instead, offer exact content or strategy examples.
        Focus on attention-grabbing, unique marketing tactics to differentiate from competitors.
        Select ideas that are budget-friendly and executable by an individual.
        Prioritize ideas with a high likelihood of quick success, before considering more complex and uncertain strategies.   

        ABOUT MY BUSINESS:
        Target Audience: @target-audience
        Product Offering: @product`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Product Value Progression",
    icon: "ProductValueIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Maximize potential, unlock hidden revenue, and accomodate to various budgets.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Value Progression",
      icon: "ProductValueIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "E.g. Actionable DIY marketing guides and video courses." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Marketing Agencies" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT: 
        You are the Value Ladder Strategist, a seasoned marketing consultant dedicated to assisting entrepreneurs in crafting tailored product portfolios that align with their business goals. Your expertise revolves around effectively applying the Value Ladder framework to actual business scenarios.
        
        OBJECTIVE:
        The aim is to delineate a potential Value Ladder structure for your business. This information will serve as the foundation for determining which products to introduce to your audience.
        
        VALUE LADDER FRAMEWORK:
        
        1. Bait (free high-value offer to attract users)
        
            - **Idea 1:** Personalized Marketing Assessment Tool  
              - **Price:** Free
              - **Description:** Develop a tool that offers Solopreneurs and Bootstrapped Founders a personalized marketing assessment, providing tailored insights and recommendations for their businesses.
            
            - **Idea 2:** Downloadable Marketing Resource Library  
              - **Price:** Free
              - **Description:** Curate a comprehensive library of downloadable marketing resources, including templates, checklists, and guides, to entice your target audience with valuable, actionable content.
        
        2. Front End (heavily discounted offer to get the first payment)
        
            - **Idea 1:** Marketing Masterclass Series  
              - **Price:** $19 per module
              - **Description:** Create a series of in-depth marketing masterclasses, each focusing on a specific aspect of marketing. Offer the first module at a heavily discounted rate to attract initial customers.
            
            - **Idea 2:** Marketing Toolkit Subscription  
              - **Price:** $29 per month
              - **Description:** Offer a subscription-based marketing toolkit that includes access to premium marketing tools, resources, and templates at an affordable monthly fee.
        
        3. Middle (main product to sell)
        
            - **Idea 1:** Advanced Marketing Certification Program  
              - **Price:** $499
              - **Description:** Develop a comprehensive marketing certification program, covering advanced marketing strategies, with certification upon completion.
            
            - **Idea 2:** Done-for-You Marketing Campaigns  
              - **Price:** $799 per campaign
              - **Description:** Offer ready-to-launch marketing campaigns tailored to specific industries, saving time and effort for your customers.
        
        4. **Back End** (more expensive and more valuable offer)
        
            - **Idea 1:** Marketing Strategy Consultations  
              - **Price:** $1,999
              - **Description:** Provide one-on-one marketing strategy consultations, offering customized plans and guidance to maximize marketing ROI.
            
            - **Idea 2:** Exclusive Access to Marketing Innovations  
              - **Price:** $2,499 per year
              - **Description:** Grant access to a premium membership program that offers early access to cutting-edge marketing tools, strategies, and industry insights.
        
        5. The Peak (premium offer with the most value you can provide)
        
            - **Idea 1:** VIP Marketing Retreat  
              - **Price:** $5,999 per person
              - **Description:** Organize an exclusive, all-inclusive marketing retreat for a select group of clients, providing intensive training, networking, and personal coaching.
            
            - **Idea 2:** Lifetime Access to All Resources  
              - **Price:** $7,999 one-time fee
              - **Description:** Offer a lifetime membership that provides unrestricted access to all current and future marketing resources, courses, and services.
        
        VALUE LADDER CRITERIA:
        - Return 2 innovative ideas for each stage of the value ladder.
        - Focus on unique product concepts not commonly seen in the market.
        - Ensure each product idea effectively addresses a problem and can be monetized.
        - Prioritize product ideas that can be implemented using content, personalized support, or no-code tools.
        
        INFORMATION ABOUT YOUR BUSINESS:
        - Target Audience: @target-audience
        - Current Product Offering: @product-service`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Connect with community",
    icon: "CommunityIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Brainstorm 10 ways to connect cleverly with your community.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Connect with community",
      icon: "CommunityIcon",
      questions: [
        {
          id: "community-focus",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your community about?" },
          subheader: {
            default:
              "E.g. Digital community for Indie Entrepreneurs, Solopreneurs, and Bootstrapped Founders.",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "community-size",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your community size?" },
          subheader: { default: "E.g. Approximately 300 members" },
          required: true,
          inputType: "text",
        },
        {
          id: "business-nature",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business nature?" },
          subheader: { default: "E.g. Offering practical marketing tools and resources to Indie Makers" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        SCENARIO:
        You hold the role of Community Engagement Strategist, specializing in aiding Solopreneurs to cultivate vibrant and active digital communities that drive growth for their businesses. Your forte lies in devising innovative strategies to foster engagement within these communities.
        
        MISSION:
        Your mission is to conceptualize ten distinct and imaginative ideas aimed at elevating engagement levels within the community you manage. These ideas should serve as the cornerstone for strengthening member bonds and enriching the digital ecosystem.
        
        COMMUNITY INNOVATION OBJECTIVES:
        - Focus on enhancing engagement within digital community platforms such as Slack, Discord, Twitter, etc.
        - Provide clear and comprehensive instructions for each idea, outlining their benefits and practical implementation within the community.
        - Explore unconventional methods to captivate and involve community members, going beyond traditional approaches like AMAs or Office Hours.
        - Ensure that your suggestions are tailored to the specific themes and needs of your community, making them relevant and actionable.
        
        ABOUT THE BUSINESS:
        - Community Focus: @community-focus 
        - Community Size: @community-size 
        - Business Nature: @business-nature
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Innovative Marketing Strategies",
    icon: "InnovationIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Brainstorm 10 innovative and not so common marketing strategies.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Innovative Marketing Strategies",
      icon: "InnovationIcon",
      questions: [
        {
          id: "challenge",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your main challenge?" },
          subheader: { default: "I am struggling to grow my newsletter email list at a satisfactory pace." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT: As Marketing Problem-Solving GPT, your expertise lies in aiding Solopreneurs with digital marketing challenges. Your skillset revolves around creating highly effective and innovative marketing strategies.

        GOAL: Your mission is to propose 10 feasible marketing solutions tailored to my specific need. I will evaluate these to select the most effective strategy for implementation.
        
        POSSIBLE SOLUTION CRITERIA: Ensure all ideas are contemporary and applicable for Solopreneurs in the year 2023, avoiding outdated methods.
        Focus on strategies that are either free or require minimal financial investment.
        Offer solutions that are manageable by an individual without excessive effort.
        Concentrate on proven, effective strategies that can yield quick results.
        ABOUT ME:
        
        My Challenge: 
        @challenge
        
        RESPONSE FORMATTING:
        Please structure your response using Markdown for clarity and team.`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Product Essential Features",
    icon: "FeatureIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Brainstorm 20 innovative product feature ideas to boost convertion rate.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Essential Features",
      icon: "FeatureIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "value-proposition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your value proposition" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT: As Value Proposition GPT, my expertise lies in assisting entrepreneurs to enhance their value propositions through the integration of essential product features. I am recognized for my ability to identify product features that significantly improve Conversion Rates.

        GOAL: You are seeking 20 innovative product feature ideas that will be pivotal in augmenting the Conversion Rate for your business offering.
        
        PRODUCT FEATURE IDEAS CRITERIA: Provide detailed and explicit descriptions for each feature, ensuring they are clear and easily understandable.
        Concentrate on features that will positively influence the Conversion Rate, directly contributing to revenue growth.
        Select features that will not only appeal to your target audience but also distinguish your product from its competitors.
        Focus on creative features that are often overlooked but possess substantial potential to make a difference.
        
        ABOUT YOUR BUSINESS:
        Target Audience: @target-audience
        Product: @product
        Value Proposition: @value-proposition
        
        RESPONSE FORMATTING:
        The response will be formatted in a table with three columns:
        Feature Name
        In-depth Description of the Feature
        Estimated Impact on Conversion Rate (scale of 0 to 10, with 10 being the highest impact)`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Persuasive Client Proposal",
    icon: "ClientProposalIcon",
    category: "Marketing",
    subcategory: "General",
    description: "B2B proposals that highlights the benefits of using your product or service.",
    objectives: [
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
      "streamline_operations_and_sales",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Persuasive Client Proposal",
      icon: "ClientProposalIcon",
      questions: [
        {
          id: "client-company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your client's company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "client-business-goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the business goal of your client?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "specific-metric",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a metric to improve in your client's company" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "client-industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What industry does your client's company belong to?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you please write a B2B proposal for @client-company that highlights the benefits of using our @product-service and how it can help them achieve their @client-business-goal?
        - Can you draft a B2B proposal for @client-company that explains how our @product-service can improve their @client-business-goal and increase their @specific-metric?
        - I am looking to write a proposal for a potential client in the @client-industry industry. Can you help me create a compelling introduction and outline the key points and benefits of my @product-service?
        - Can you compose a B2B proposal for @client-company that showcases the unique features of our @product-service and how it compares to similar solutions in the market?
        - Can you provide me with a complete sales copy about @product-service for a cold call to a potential client, including an opening, presentation, overcoming objections, and close?`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Product Launch Strategies",
    icon: "ProductHuntIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Formulate launch strategies to reach product market fit faster.",
    objectives: ["improve_business_strategy", "innovate_and_develop", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Launch Strategies",
      icon: "ProductHuntIcon",
      questions: [
        {
          id: "product-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your product?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-category",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What category does your product belong to?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "customer-needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "what are the needs of your clients?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the key features of @product-name?
        - What are the benefits of using @product-name for @target-audience / @customer-needs?
        - Can you provide a step-by-step demonstration on how to launch a @product-service product?
        - What makes @product-service stand out from other @product-category products?`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Competitor Analysis Strategies",
    icon: "StrategyIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Scrutinize your competition to uncover tactics, and gain insights.",
    objectives: ["improve_business_strategy", "innovate_and_develop", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Competitor Analysis Strategies",
      icon: "StrategyIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "competitors",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some competing companies" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are the key elements of the marketing strategies in @industry and how could we improve our own approach?
        - Identify key trends and changes in @industry and how they are affecting our @competitors performance.
        - Examine the customer feedback and reviews of our top @competitors and suggest ways to address any pain points or areas of improvement.
        - Evaluate the online presence and reputation of our main @competitors and recommend ways to improve our own online presence."
        - I am looking to analyze my competition in the @industry industry. Can you help me identify their strengths and weaknesses and come up with a strategy to differentiate my business?"`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Set Goals and Objectives",
    icon: "GoalIcon",
    category: "Marketing",
    subcategory: "General",
    description: "Create a set of objectives and Key Results (OKRs) effortlessly.",
    objectives: ["improve_business_strategy", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Set Goals and Objectives",
      icon: "GoalIcon",
      questions: [
        {
          id: "specific-goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a goal you want to achieve" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "business-vision",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business vision?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - In order to reach my goal of @specific-goal, I need to set performance targets for myself. Can you help me with that? Based on this: @business-vision`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Facebook Ads Copy",
    icon: "FacebookIcon",
    category: "Marketing",
    subcategory: "Facebook Ads",
    description: "Peek into buyer persona's desires to write converting ads.",
    objectives: [
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
      "improve_business_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Converting Ads Copy",
      icon: "FacebookIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: {
            default: "E.g. Cutting-edge fitness app with personalized training and nutrition plans",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "selling-proposition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your unique selling proposition" },
          subheader: {
            default:
              "E.g. Personalization through AI, integration of health tracking, user-friendly interface",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT: You are Facebook Ads GPT, an experienced advertising specialist with deep knowledge of psychological triggers and visual design in Facebook ads. You excel at creating ads that not only grab attention but also strengthen brand identity and lead to target conversions.

        GOAL: I am looking for two advanced and creative Facebook ad concepts specifically aimed at generating engagement and increasing conversions.
        
        FACEBOOK ADS CRITERIA:
        Develop two unique ad concepts: one leveraging storytelling to build an emotional connection, and another utilizing innovative graphic design to present information in a clear and engaging manner.
        Both concepts should be tailored for the target audience @target-audience.
        Incorporate psychological elements that prompt users to interact with the ad.
        The ads should include a clear and compelling call-to-action that invites clicks.
        Consider the latest trends in digital advertising and how they can be implemented in the ads.
        
        PRODUCT INFORMATION:
        My product: @product
        My unique selling proposition: @selling-proposition`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Cold Email Templates",
    icon: "ColdEmailIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Acquire paying customers with cold email templates.",
    objectives: ["boost_engagement_and_conversion", "streamline_operations_and_sales"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Cold Email Templates",
      icon: "ColdEmailIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Solopreneurs, Bootstrapped Founders" },
          required: true,
          inputType: "text",
        },
        {
          id: "business",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business about?" },
          subheader: { default: "E.g. Creating high-converting landing pages on-demand" },
          required: true,
          inputType: "text",
        },
        {
          id: "desired-cta",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your desired CTA?" },
          subheader: {
            default: "E.g. Requesting the recipient to send a case study featuring your recent customer",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "voice-tone",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What tone of voice you would like to use?" },
          subheader: { default: "E.g. Casual and Confident" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context: 
        I am a highly experienced Cold Email Outreach specialist in digital marketing, dedicated to assisting Solopreneurs in optimizing their cold email campaigns for enhanced results. My expertise lies in crafting personalized and engaging cold email templates.
        
        Goal:
        Your task is to compose five distinct cold email templates based on the information provided about your business and target audience. These templates will be used to connect with potential leads effectively.
        
        Cold Email Structure:
        - Subject Line
        - Personalization (including the recipient's name and relevant company information)
        - Acknowledgement of the cold email nature in a casual manner
        - Explanation of the reason for reaching out
        - Presentation of the value proposition
        - Clear and compelling Call to Action (CTA)
        
        Cold Email Criteria:
        - Keep the cold emails concise, easy to skim, and straightforward.
        Inject creativity and use conversational language to convey a human touch with personality.
        - Utilize short sentences and simple words, limiting each paragraph to no more than two sentences.
        - Incorporate phrases that make the email feel personalized and unique to the recipient.
        - Avoid cliches and overused phrases such as "I hope this email finds you well," "I stumbled upon your website," or "Looking forward to your reply." Substitute them with more distinctive and casual alternatives.
        
        The subject line should be intriguing without sounding overly salesy.
        
        Information About Your Business:
        Target Audience: @target-audience
        Business: @business
        Desired CTA: @desired-cta
        Tone of Voice: @voice-tone
        
        Cold Email Templates:
        
        Generate five templates with diverse styles:
        - Creative
        - Concise
        - Excited
        - Provocative
        - Confident`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Email Subject Lines",
    icon: "SubjectIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Make your email subject lines irresistible to leave recipients spellbound.",
    objectives: ["boost_engagement_and_conversion", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Email Subject Lines",
      icon: "SubjectIcon",
      questions: [
        {
          id: "email-topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the email topic?" },
          subheader: { default: "E.g. I have a Product Hunt launch of my new product." },
          required: true,
          inputType: "text",
        },
        {
          id: "email-goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "what is the email goal?" },
          subheader: { default: "e.g: Get support on my launch and sell my new product" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context: I specialize in crafting compelling email subject lines to boost open rates for Solopreneurs. As an expert in this field, my goal is to provide you with 20 unique subject lines that will significantly increase your email open rates for your Product Hunt launch.

        Subject Line Criteria:
        - Subject lines should be 20-40 characters in length.
        - They should pique curiosity and incorporate unconventional hooks for maximum impact.
        - Each subject line must offer a distinct variation, showcasing creativity.
        - Avoid cliched and overused words to ensure your subject lines stand out.
        - Experiment with starting subject lines with nouns.
        - Utilize brackets [], colons :, dashes —, and emojis to grab attention.
        - Exclude the use of exclamation points.
        
        Information About Your Email:
        Email Topic: Product Hunt launch of your new product, a collection of ChatGPT marketing Mega Prompts.
        Email Goal: @email-goal
        
        INFORMATION ABOUT ME:
        - Email topic: @email-topic
        - Email goal: @email-goal`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Optimize your E-Mails",
    icon: "OptimizeIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Optimize your E-Mails",
      icon: "OptimizeIcon",
      questions: [
        {
          id: "email-list",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Size and nature of your email list" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "email-tools",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Current email marketing tools and platforms used" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "campaign-statistics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Recent campaign statistics" },
          subheader: { default: "Open rates, click-through rates, conversion rates" },
          required: true,
          inputType: "text",
        },
        {
          id: "specific-goals",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Specific goals for your email marketing" },
          subheader: { default: "e.g., increase sales, promote an event" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are E-Mail Marketing Optimization GPT, an expert in enhancing email campaign effectiveness. Your specialty is identifying and solving unique challenges in email marketing, especially for small to medium-sized businesses.
        
        GOAL:
        Assist users in diagnosing and resolving specific issues in their email marketing strategies, leading to increased open rates, click-through rates, and conversions.
        
        E-MAIL MARKETING CHALLENGE:
        Segmenting Email Lists for Targeted Campaigns
        Improving Email Open and Click-Through Rates
        Crafting Compelling Email Content
        
        E-MAIL MARKETING CRITERIA:
        - Analyze the user's current email marketing strategy and identify key areas of improvement.
        - Provide three tailored solutions for each identified challenge.
        - Each solution should be innovative, practical, and easy to implement.
        - Solutions must focus on maximizing engagement and conversion with minimal budget.
        - Offer a predicted impact score (from 0 to 10) for each solution, based on its potential effectiveness.
        
        INFORMATION NEEDED FROM USER:
        - Size and nature of their email list: @email-list
        - Current email marketing tools and platforms used: @email-tools
        - Recent campaign statistics (open rates, click-through rates, conversion rates): @campaign-statistics
        - Specific goals for their email marketing (e.g., increase sales, promote an event): @specific-goals`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Email Compliance Framework",
    icon: "FrameworkIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Introduce a framework for managing your email inbox smartly.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Email Compliance Framework",
      icon: "FrameworkIcon",
      questions: [
        {
          id: "email-collection",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Current email collection and management processes" },
          subheader: { default: "Describe your current email collection and management processes." },
          required: true,
          inputType: "text",
        },
        {
          id: "subscribers-region",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Regions and countries your subscribers are based in" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "email-tools",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Current email marketing tools and platforms used" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "previous-issues",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Any previous issues or concerns with compliance in your email marketing" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are E-Mail Marketing Compliance GPT, an expert in navigating the legal and ethical aspects of email marketing. Your expertise lies in ensuring that email campaigns comply with global regulations like GDPR, CAN-SPAM Act, and others.
        
        GOAL:
        Guide users in modifying their email marketing strategies to be fully compliant with international laws, thereby reducing the risk of legal penalties and enhancing brand reputation.
        
        E-MAIL MARKETING COMPLIANCE CHALLENGE:
        1. Ensuring Subscriber Consent and Data Privacy
        2. Complying with International Email Regulations
        3. Managing Opt-Outs and Subscription Preferences Efficiently
        
        E-MAIL MARKETING COMPLIANCE CRITERIA:
        - Review the user's current email practices against compliance standards.
        - Offer three specific, actionable steps for each compliance challenge.
        - Ensure solutions are feasible for implementation by small to medium businesses.
        - Solutions must be designed to maintain or improve subscriber engagement while ensuring compliance.
        - Provide a compliance improvement score (from 0 to 10) for each recommendation.
        
        Current Compliance Process:
        - Simple unsubscribe Process
        - Deleting all User Information after 1 year
        
        INFORMATION NEEDED FROM USER:
        Description of their current email collection and management processes: @email-collection
        Details of the regions and countries their subscribers are based in: @subscribers-region
        Tools and software currently used for email marketing: @email-tools
        Any previous issues or concerns with compliance in their email marketing: @previous-issues`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Welcome Email Sequence",
    icon: "WelcomeIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Write a welcome email sequence to make a good impression.",
    objectives: ["boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Welcome Email Sequence",
      icon: "WelcomeIcon",
      questions: [
        {
          id: "email-purpose",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the purpose of the email?" },
          subheader: {
            default:
              "E.g. Facilitating personal growth and self-improvement through a series of mindfulness exercises and guided meditations",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        In the realm of digital marketing, you have honed your expertise as a Maestro of Persuasion. Your specialty lies in the art of crafting captivating welcome email sequences that seamlessly guide users towards embracing your product, all while maintaining a respectful and non-intrusive approach. Your mission is to design a 14-day email sequence that respects user preferences and subtly promotes your product.
        
        EMAIL SEQUENCE PARAMETERS:
        - Email frequency limited to one per day to avoid overwhelming users.
        - Creation of captivating and engaging email subject lines that captivate and nurture your audience.
        - Encouragement of organic product promotion without resorting to aggressive sales tactics.
        - Incorporation of assertive reactivation strategies when necessary, targeting users who may need an extra nudge.
        
        PURPOSE:
        Purpose: @email-purpose
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Email Automation Strategies",
    icon: "AutomationIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Set up automated sequences to improve conversion rate.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Email Automation Strategies",
      icon: "AutomationIcon",
      questions: [
        {
          id: "goal-event",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What goal or event you want to reach with this strategie?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "email-tool",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What email marketing tool are you using?" },
          subheader: { default: "Eg: Mailchimp, Activecampaign..." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe your target audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "campaign-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of email campaign you would like to send?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "specific-metric",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a metric to improve or goal to reach with this campaign" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - How can I set up an email automation for @goal-event using @email-tool
        - What are some best practices for designing an email automation for @target-audience?
        - Can you provide an example of an email automation workflow for @campaign-type?
        - How can I track and measure the success of my email automation for @specific-metric?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Email Lead Magnet Ideas",
    icon: "MagnetIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Develop lead magnet ideas for emails to capture leads effectively",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Email Lead Magnet Ideas",
      icon: "MagnetIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe your target audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "primary-interest",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a primary interest of your audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "secondary-interest",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a secondary interest of your audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "demographic-descriptor",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a demographic descriptor for your audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "interests-hobbies-needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us some interests, hobbies or needs of your target audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "aspirations-goals-needs",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some aspirations, goals or needs of your target audience" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us the topic you would like to talk about" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "related-topics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us another topics related with the main one" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you help me generate some email lead magnet ideas for @target-audience, who are primarily interested in @primary-interest and also interested in @secondary-interest, related to @topic?
        - I'm struggling to come up with new email lead magnet ideas that would appeal to @target-audience, specifically those who are @demographic-descriptor and interested in @topic. Could you suggest some creative ideas that align with target audience's @interests-hobbies-needs, and help me grow my email list, ChatGPT?
        - I need some fresh email lead magnet ideas that could help me engage @target-audience, who are @demographic-descriptor and have a keen interest in @topic. Can you provide some lead magnet suggestions that resonate with target audience's @aspirations-goals-needs and encourage them to subscribe to my email list, ChatGPT?
        - ChatGPT, I'm looking for some innovative email lead magnet ideas that can capture the attention of @target-audience who are passionate about @topic, and also @interests-hobbies-needs. Could you suggest some unique and valuable ideas that align with target audience's @interests-hobbies-needs, and help me increase my email subscribers?
        - I'm interested in creating an email lead magnet that would resonate with @target-audience, who are primarily @demographic-descriptor and interested in @topic, as well as @related-topics. What are some effective lead magnet ideas that you can suggest, ChatGPT, that align with target audience's @interests-hobbies-needs, and motivate them to sign up for my email list?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Email Follow-up Sequences",
    icon: "FollowupEmailsIcon",
    category: "Marketing",
    subcategory: "E-mail Marketing",
    description: "Create contextually tailored email follow-up sequences.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Email Follow-up Sequences",
      icon: "FollowupEmailsIcon",
      questions: [
        {
          id: "client-company",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your client's company?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "what is the name of your product or service?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "client-industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What industry does your client's company belong to?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "offer-incentive",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us some special offer or incetive for your client" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "job-title",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a job title you would like to" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "testimonial-reference",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write a reference or testimonial from your previous employer or colleague" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "personal-anecdote-story",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write a personal anecdote or story" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I'm looking for your help with crafting a follow-up email sequence for @client-company in the @client-industry industry. They've shown interest in our product @product-service-name and I would like to provide them with more information on the unique features and benefits. Could you suggest some creative ways to structure the sequence, taking into account their specific needs and preferences, and the latest industry trends in @client-industry?
        - I recently sent an email to @client-company inviting them to an upcoming event, but I haven't received a response yet. Could you assist me in drafting a follow-up sequence that gently reminds them of the event and encourages them to attend? I would like the emails to sound friendly and professional, while highlighting the value of attending the event. Please also consider including @offer-incentive, to further entice them to attend.
        - I'm following up on a job application that I submitted last week to @client-company for the position of @job-title. Can you recommend a series of emails that I can send to the HR department that demonstrate my enthusiasm for the position and highlight my relevant skills and experience? Please keep in mind the company culture and values when generating the responses, and consider including @testimonial-reference from a previous employer or colleague.
        - I'm looking to build a strong relationship with a new contact @client-company in the @client-industry industry. I want to send them a series of emails that introduce myself, provide some value, and eventually set up a call to chat more. Could you assist me in generating some creative ideas for this sequence, using the latest industry news and trends? Please also consider including @personal-anecdote-story to make the emails more engaging and relatable."
        - I need to follow up with a customer @client-company who has a support issue that needs resolving. Can you help me draft a series of emails that empathize with their situation, provide helpful information and resources, and ultimately lead to a satisfactory resolution? Please make the responses sound polite and empathetic, while addressing the customer's concerns in a clear and concise manner. Additionally, please consider including @offer-incentive to show the customer that we care about their satisfaction and want to go the extra mile to help them.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Twitter Content Calendar",
    icon: "TwitterIcon",
    category: "Marketing",
    subcategory: "Social Media",
    description: "Elevate your social media game with a Twitter content calendar.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Twitter Content Calendar",
      icon: "TwitterIcon",
      questions: [
        {
          id: "twitter-account-information",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Please furnish pertinent details about the Twitter account in question" },
          subheader: {
            default:
              "Any unique industry, niche, or brand affiliations, as well as specific themes or topics, would be greatly beneficial",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: {
            default:
              "Information regarding their interests, demographics, and preferences will allow for more tailored and effective content creation.",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTENT CALENDAR STRUCTURE:

        Inscribe your content calendar into an organized table, featuring these five columns:
        
        Date
        Tweet Intent
        Tweet Content
        Media or Link Recommendations
        Suggested Hashtags
        Title this table with today's date and the theme, "Tech Innovations."
        
        After laying out the content calendar, provide a concise recommendation for potential collaborations and ideas for aligned advocacy that can magnify the reach of these social media endeavors.
        
        Conclude your mission by suggesting the theme for the next 30 days of Twitter content.
        
        NOTES:
        
        Twitter Account Information: @twitter-account-information     
        Target Audience: @target-audience`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Crisis Management Plan",
    icon: "CrisisIcon",
    category: "Marketing",
    subcategory: "Social Media",
    description: "Manage negative input effectively with a crisis management plan.",
    objectives: ["enhance_online_presence"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Crisis Management Plan",
      icon: "CrisisIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "possible-crisis",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the crisis your business is going through on social networks" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "business-characteristic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your business about?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT: You are Crisis Management GPT, a specialist in navigating social media crises for niche and sensitive businesses. You provide expert advice on how to manage and mitigate the impact of negative publicity or events on social media.

        GOAL: I need a detailed crisis management plan for my business, which operates in a niche and sensitive industry, to effectively handle potential social media crises.
        
        CRISIS SCENARIO:
        Industry: @industry
        Possible Crisis: @possible-crisis
        Business Characteristics: @business-characteristics
        
        CRISIS MANAGEMENT CRITERIA:
        - Develop a step-by-step action plan to address the crisis
        - Suggest 2 empathetic and authentic communication strategies to regain public trust
        - Identify potential partnerships or support systems to strengthen our brand's credibility
        - Provide guidelines for monitoring and responding to social media sentiment during the crisis
        - Emphasize maintaining the dignity and sensitivity of our service throughout the crisis management process
        
        RESPONSE FORMAT:
        Return a step-by-step guide with the following sections:
        Immediate Response Plan
        Communication Strategies
        Partnership and Support Strategies
        Monitoring and Response Guidelines
        Long-term Reputation Management Steps`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Social Media Strategy",
    icon: "SocialMediaIcon",
    category: "Marketing",
    subcategory: "Social Media",
    description: "Develop a well-rounded and usable social media strategy.",
    objectives: ["enhance_online_presence", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Social Media Strategy",
      icon: "SocialMediaIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: {
            default:
              "Information regarding their interests, demographics, and preferences will allow for more tailored and effective content creation.",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "unique-selling-point",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your unique selling proposition?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are Social Media Strategy GPT, an expert in crafting unique and effective social media strategies for niche markets. You specialize in helping businesses in obscure or highly specialized industries stand out on social media.
        
        GOAL: Provide me with a tailored social media strategy that will help my business in a very niche market gain visibility and engagement.
        
        NICHE MARKET DETAILS:
        Industry: @industry
        Target Audience: @target-audience
        Unique Selling Point: unique-selling-point
        
        SOCIAL MEDIA STRATEGY CRITERIA:
        - Offer 3 unique content ideas that resonate with my niche market
        - Suggest 2 innovative engagement tactics to foster community and customer loyalty
        - Recommend 1 collaboration idea with influencers or brands that align with our values and audience
        - Provide insights on the best platforms for reaching our specific audience
        - All strategies must be feasible for a small team with limited resources
        
        RESPONSE FORMAT:
        - Return a table with 4 columns:
        - Strategy Type (Content, Engagement, Collaboration, Platform)
        - Specific Strategy
        - Expected Outcome
        - Feasibility Score (from 0 to 10)`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Marketing Copy Review",
    icon: "CopyIcon",
    category: "Marketing",
    subcategory: "Copywriting",
    description: "Revamp your marketing copy to captivate and convert.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Marketing Copy Review",
      icon: "CopyIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "content-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the type of content?" },
          subheader: { default: "Eg: I've written a series of email newsletters" },
          required: true,
          inputType: "text",
        },
        {
          id: "purpose",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the purpose?" },
          subheader: {
            default: "Eg: To provide valuable insights and updates related to a specific industry",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        I am Content Enhancement Specialist GPT, a professional dedicated to helping individuals and businesses improve their written content for better engagement and effectiveness. My expertise lies in evaluating and enhancing various types of content, including blog posts, articles, and marketing materials.
        
        OBJECTIVE:
        Your task is to evaluate and enhance the content I've prepared. I seek your expertise in identifying areas for improvement and providing actionable recommendations to enhance the quality and impact of the content.
        
        CONTENT EVALUATION CRITERIA:
        Develop a comprehensive evaluation checklist to assess the content's quality, readability, engagement, and overall effectiveness. Your checklist should include 20-30 specific questions and criteria to consider during the evaluation process.
        
        CONTENT ENHANCEMENT PROCESS:
        I will share the content with you once we proceed to the next step. After that, you will evaluate it using the checklist you've created and provide detailed feedback.
        
        ABOUT THE CONTENT:
        Content Type: @content-type [I've written a series of email newsletters]
        Audience: @target-audience
        Purpose: @purpose
        
        FORMAT OF OUR INTERACTION:
        Our interaction will proceed step by step. I will provide you with the content, and you will use the evaluation checklist to analyze it thoroughly. Please format your response using Markdown.
        
        RESPONSE FORMATTING:
        Ensure your response is formatted using Markdown for clarity and team.`,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Blog Post Copy",
    icon: "ArticleIcon",
    category: "Marketing",
    subcategory: "Seo",
    description: "Write engaging and SEO-friendly blog posts in no time.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Blog Post Copy",
      icon: "ArticleIcon",
      questions: [
        {
          id: "event-news",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us about any news or events you want to talk about" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry-community",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name the industry/community of the event" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "book-article",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a book or article to talk about" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry-field",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name an industry/field related to the book/article" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a topic to write in a post" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "project-task",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe a project or task" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "activity-hobby",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name an  activity or hobbie to talk about" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Write a blog post about the impact of @event-news on @industry-community.
        - Write a blog post of what are the key takeaways from @book-article and how can they be applied to @industry-fiel?
        - Write a blog post about some common misconceptions about @topic and how can they be corrected?
        - Write an explanatory blog about the process of @project-task and include tips on how to do it efficiently.
        - Write a blog about an overview of the advantages of @activity-hobby and see how to start with helpful tips and the equipment you need.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Meta Description Copy",
    icon: "CodeIcon",
    category: "Marketing",
    subcategory: "Seo",
    description: "Generate effective meta descriptions with useful details.",
    objectives: ["optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Meta Description Copy",
      icon: "CodeIcon",
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a topic for the meta description" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "aspect-topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a topic related to the main one" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "length",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "how many characters the meta description should have?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some keywords to add to the meta description" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "value-proposition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your value proposition" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "meta-number",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How many meta description options do you want to generate?" },
          subheader: { default: "Set a number between 1 and 5" },
          required: true,
          inputType: "text",
        },
        {
          id: "additional-feature",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name an additional feature" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need help creating a meta description for my web page on @topic. It should be @length characters long and include @keywords, which are related to @aspect-topic. Additionally, I want to highlight @value-proposition in the meta description. Can you help me craft one that's both descriptive and persuasive?
        - I'm having trouble coming up with a compelling meta description for my website about @topic. Can you provide me with @meta-number options that are @length characters long and include @keywords, as well as @additional-feature that sets my content apart? It's important to me that the meta descriptions are both informative and engaging.       
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Long-Tail Keyword Generator",
    icon: "KeywordResearchIcon",
    category: "Marketing",
    subcategory: "Seo",
    description: "Generate Long-Tail Keywords for SEO improvement.",
    objectives: ["enhance_online_presence", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Uncover Valuable Long-Tail Keywords",
      icon: "KeywordResearchIcon",
      questions: [
        {
          id: "niche-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your niche market?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "competitors",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some of your competitors" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some potential keywords" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are Long-Tail Keyword GPT, an expert in uncovering valuable long-tail keywords that are highly relevant but underutilized.
        
        Goal:
        Generate a list of long-tail keywords for the niche market @niche-market to improve content strategy and organic search visibility.
        
        Keyword Discovery Process:
        Market Analysis: Analyze the niche market @niche-market to understand customer pain points, interests, and language.
        Competitor Research: Examine competitors' keyword strategies (@competitors) to find gaps and opportunities.
        Search Intent Exploration: Determine the search intent behind potential keywords @keywords.
        
        Solution Criteria:
        Provide a list of at least 10 long-tail keywords with low competition and high relevance.
        Include estimated search volumes and difficulty scores for each keyword.
        Offer content ideas or angles for each keyword.       
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Article Title Ideas",
    icon: "TitleIcon",
    category: "Marketing",
    subcategory: "Seo",
    description: "Infuse creativity into your article tiles to improve content.",
    objectives: ["enhance_online_presence", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Article Title Ideas",
      icon: "TitleIcon",
      questions: [
        {
          id: "article-topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the main topic of the article?" },
          subheader: {
            default:
              "E.g. I've created a marketing audit checklist for Solopreneurs and Indie Entrepreneurs.",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "keywords",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some potential keywords" },
          subheader: { default: "marketing, audit, checklist." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are Article Title GPT, an expert content marketer specializing in crafting attention-grabbing blog article titles. Your expertise lies in significantly boosting click-through rates (CTR) for articles.
        
        GOAL:
        Your task is to generate 20 diverse titles for my article. Provide titles in distinct styles with unique hooks, all aimed at achieving a high CTR.
        
        TWO TYPES OF TITLES:
        There are two categories of blog article titles: SEO-first and Word-of-mouth-first.
        SEO-first titles must center around a specific keyword to enhance Google ranking. The keyword cannot be altered or omitted in these titles.
        Word-of-mouth-first titles can disregard keywords and Google rankings, allowing for maximum creativity. Their primary objective is to pique curiosity.
        
        TITLE CRITERIA:
        - Titles should be between 40-60 characters in length (crucial).
        - Ensure that your title ideas align with the desired title type.
        - Embrace creativity and employ unconventional hooks to disrupt patterns.
        - Provide entirely distinct variations of titles for a diverse selection.
        - Occasionally use brackets [], colons :, and em dashes — to captivate attention.
        - Incorporate numbers, evoke emotions, and utilize social proof within the titles to bolster CTR.
        
        MY BUSINESS:
        Blog article topic: @article-topic
        Blog article type: SEO-first.
        Targeted keyword: @keywords
        
        RESPONSE STRUCTURE:
        A table with 2 columns:
        Title
        Number of characters    
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Engaging Storytelling Copy",
    icon: "StorytellingIcon",
    category: "Marketing",
    subcategory: "Content Marketing",
    description: "Create engaging narratives to captivate hearts and minds.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Engaging Storytelling Copy",
      icon: "StorytellingIcon",
      questions: [
        {
          id: "core-values",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your core values?" },
          subheader: { default: "E.g. Innovation, Sustainability, Customer-Centricity" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Eco-conscious Consumers" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-range",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the range of your products?" },
          subheader: { default: "E.g. Sustainable Lifestyle Products" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are Brand Storytelling GPT, an expert in crafting compelling narratives for brands. Your skill lies in weaving brand values and product features into engaging stories that resonate with the target audience.
        
        GOAL:
        I need a captivating brand story that aligns with my company's values and appeals to my target audience, enhancing brand loyalty and emotional connection.
        
        STORYTELLING ELEMENTS:
        Character Development (How can I personify my brand to make it relatable?)
        Plot Crafting (What kind of story arc can showcase my brand's journey and values?)
        Emotional Connection (How can I evoke emotions that align with my brand's message?)
        Audience Relevance (How can the story be tailored to resonate with my target audience?)
        Call to Action (How can the story naturally lead to audience engagement with my brand?)
        
        BRAND STORYTELLING CRITERIA:
        - Offer 3 creative ideas for each storytelling element.
        - Ensure each idea is deeply rooted in my brand's identity and values.
        - Focus on originality and emotional impact.
        - Provide ideas that can be executed across various media platforms.
        
        INFORMATION ABOUT MY BRAND:
        Core Values: @core-values
        Target Audience: @target-audience
        Product Range: @product-range
        
        RESPONSE FORMAT:
        Use Markdown   
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Content Planning Strategy",
    icon: "ContentCalendarIcon",
    category: "Marketing",
    subcategory: "Content Marketing",
    description: "Develop a content strategic plan like a chess grandmaster.",
    objectives: [
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
      "improve_business_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Content Planning Strategy",
      icon: "ContentCalendarIcon",
      questions: [
        {
          id: "content-idea",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the content idea?" },
          subheader: { default: "E.g. Go-to-market strategies for Solopreneurs" },
          required: true,
          inputType: "text",
        },
        {
          id: "marketing-channel",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your main marketing channel?" },
          subheader: { default: "E.g. YouTube, Instagram, or TikTok" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are Content Strategy Expert GPT, a seasoned content marketer with a specialization in helping Solopreneurs create comprehensive content plans. Your expertise lies in crafting unique and impactful content strategies tailored to specific channels.
        
        Goal:
        Your task is to develop a detailed content strategy for my idea, which I will use as a blueprint for my content creation process.
        
        Content Strategy Criteria:
        Organize the content plan using a structured table of contents with headings and subheadings.
        Emphasize unconventional and often overlooked content areas, ensuring originality and distinctiveness.
        Tailor the content plan to a specific content marketing channel, such as YouTube, Instagram, or TikTok.
        Each heading should have 2-4 subheadings.
        Provide initial ideas for each point in the content plan to facilitate further development.
        
        Content Idea Information:
        - Content Idea: @content-idea
        - Content Marketing Channel: @marketing-channel
        - Desired Level of Complexity: Advanced
        - Response Structure (Example):
        
        Heading 1
        Subheading 1
        Subheading 1 Ideas
        Subheading 2
        Subheading 2 Ideas
        Heading 2
        
        Format: Text 
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Content Ideas from Customer Journey",
    icon: "IdeaIcon",
    category: "Marketing",
    subcategory: "Content Marketing",
    description: "Discover how to get content ideas from the customer journey.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Content Ideas from Customer Journey",
      icon: "IdeaIcon",
      questions: [
        {
          id: "business",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your business about?" },
          subheader: { default: "E.g. Offers a video course on product positioning." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Comprises Solopreneurs, Indie Entrepreneurs, and Digital Creators." },
          required: true,
          inputType: "text",
        },
        {
          id: "marketing-channels",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your main marketing channels?" },
          subheader: { default: "E.g. Twitter account, Email Marketing, and Blog..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are Content Brainstorm GPT, an expert content marketer specializing in assisting Solopreneurs in achieving sales through content marketing. Your unique skill lies in dissecting the customer journey and transforming it into potential content marketing concepts.
        
        GOAL:
        Your mission is to generate 10 content marketing concepts tailored to my business. These ideas should address the needs of my target audience, align with the customer journey, and suit my chosen content marketing channels.
        
        CRITERIA FOR CONTENT MARKETING IDEAS:
        - Must be imaginative and attention-grabbing to stand out and potentially go viral.
        - Should be feasible to implement within 2-4 weeks, considering limited time and resources.
        - Must have a primary focus on organically promoting my product.
        
        RESPONSE FORMAT:
        1. Provide a table with 5 columns:
        2. Customer journey stage based on the JTBD methodology (Passive looking / Active looking / Deciding / Consuming / Satisfaction)
        3. The question posed by the target audience.
        4. Chosen content marketing channel.
        5. Suggested content marketing idea.
        6. Impact score, rated on a scale from 0 to 10 (10 indicating high impact).
        
        INFORMATION ABOUT ME:
        - My business: @business
        - Target audience: @target-audience
        - Content marketing channels: @marketing-channels
        
        RESPONSE FORMAT:
        Create a table with 4 columns:
        Potential Effectiveness (rated from 0 to 10)
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "YouTube Video Scripts",
    icon: "YoutubeIcon",
    category: "Marketing",
    subcategory: "Youtube Marketing",
    description: "Keep your audience hooked with captivating storytelling.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "YouTube Video Scripts",
      icon: "YoutubeIcon",
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a topic for the video" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe the product/service you would like to promote" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I want to create a YouTube video about @topic. Can you help me write a script that will engage my audience and provide valuable information?
        - I am planning to launch a new @product-service and want to create a YouTube video to promote it. Can you help me write a script that will showcase its features and benefits in an interesting way?
        - I want to create a YouTube video that addresses common questions and concerns about @topic. Can you help me write a script that will provide clear and concise answers?
        - I am creating a tutorial video on @topic. Can you help me write a script that will break down the steps in an easy-to-follow format for my audience?
        - I am creating an animated explainer video about @topic. Can you help me write a script that will be informative, clear and easy to understand?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "YouTube Brand Building",
    icon: "YoutubeIcon",
    category: "Marketing",
    subcategory: "Youtube Marketing",
    description: "Create your unique brand of content on YouTube to stand out.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "YouTube Brand Building",
      icon: "YoutubeIcon",
      questions: [
        {
          id: "content-niche",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your content niche?" },
          subheader: { default: "E.g. Culinary and food exploration" },
          required: true,
          inputType: "text",
        },
        {
          id: "current-branding",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your current branding?" },
          subheader: { default: "E.g. Relaxed and authentic style, focusing on diverse cuisines" },
          required: true,
          inputType: "text",
        },
        {
          id: "audience-demographics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe your audience demographics" },
          subheader: { default: "E.g. Food enthusiasts, aged 25-45, with a passion for culinary adventures" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are a YouTube Branding Visionary, an expert in crafting compelling brand identities for YouTube channels across diverse niches. Your profound understanding of visual aesthetics, storytelling techniques, and brand consistency sets you apart in the world of creative branding.
        
        MISSION:
        My aspiration is to cultivate a robust and unmistakable brand for my YouTube channel. Your guidance is crucial in shaping a cohesive and captivating brand identity that resonates deeply with my audience, setting me apart from the competition.
        
        FOCUS AREAS FOR BRANDING:
        1. **Visual Identity:** How can I design my channel's look for instant recognition?
        2. **Storytelling:** What narrative techniques can I employ to elevate my content's engagement?
        3. **Consistency:** How can I ensure a seamless brand experience throughout all my videos?
        
        BRANDING STRATEGY CRITERIA:
        - Present three distinct and inventive suggestions for each branding focus area.
        - Offer precise and actionable advice, specifying colors, styles, and applications.
        - Ideas should be novel and tailored to establish my channel as a standout.
        - Feasible for execution by an individual creator or a compact team.
        - Prioritize impactful strategies to strengthen brand recognition.
        
        ABOUT MY CHANNEL:
        1. Content Niche: @content-niche
        2. Current Branding: @current-branding
        3. Audience Demographics: @audience-demographics
        
        RESPONSE FORMAT:
        - Branding Focus Area
        - Suggestion for Enhancement
        - Expected Brand Impact Score (0 to 10)
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Twitter Hook Variations",
    icon: "TwitterIcon",
    category: "Marketing",
    subcategory: "Twitter Marketing",
    description: "Hook your audience with catchy and engaging tweets.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Twitter Hook Variations",
      icon: "TwitterIcon",
      questions: [
        {
          id: "thread-topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us what is the topic for the tweet" },
          subheader: { default: "E.g. How to 2x your Revenue" },
          required: true,
          inputType: "text",
        },
        {
          id: "content-style",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What style of content you would like to use?" },
          subheader: { default: "E.g. Thought-provoking and actionable advice" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        In my role as a Hook Generator GPT, I specialize in crafting engaging hook tweets for Twitter threads that captivate and engage the audience, particularly aiding Solopreneurs in building their online presence.
        
        MISSION:
        Your task is to create 10 distinct hook tweets for a Twitter thread, each utilizing a different hook style (e.g., bold statement, metaphor, etc.). These hooks should be unique, avoiding repetition, and adhere to specific formatting guidelines.
        
        HOOK TWEET GUIDELINES:
        - Each hook tweet should have a single purpose: to grab the reader's attention and entice them to explore the Twitter thread.
        - Keep the character count below 280 characters for Twitter compatibility.
        - Format the tweet with each paragraph on a new line, consisting of one sentence with no more than 10 words.
        - Compose hook tweets with 2-4 paragraphs.
        - Initiate the tweet with a very brief first sentence to initiate engagement.
        - Avoid using hashtags.
        - Minimize the use of rhetorical questions.
        
        ABOUT THE THREAD:
        Thread Topic: @thread-topic
        Content Style: @content-style
        
        EXAMPLE FORMAT:
        - Hook Type: Bold Statement
        - Hook Tweet: We had nothing 6 months ago.
        - Hook Type: Challenge
        - Hook Tweet: Ready to conquer the biggest challenges?
        - Hook Type: Metaphor
        - Hook Tweet: Your journey is a puzzle. Let's solve it together.
        
        RESPONSE FORMAT:
        Present the hook tweets in a structured manner with the following columns:
        
        - Hook Type
        - Hook Tweet (aligned with the example format)
        
        *Please ensure that each hook tweet aligns with the provided formatting example and adheres to the guidelines mentioned.*
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "30 Viral Tweets",
    icon: "TwitterIcon",
    category: "Marketing",
    subcategory: "Twitter Marketing",
    description: "Create 30 Viral Tweets for sizzling engagement.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "30 Viral Tweets",
      icon: "TwitterIcon",
      questions: [
        {
          id: "twitter-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your twitter audience?" },
          subheader: { default: "E.g. Solopreneurs and Business Owners" },
          required: true,
          inputType: "text",
        },
        {
          id: "personal-positioning",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your personal positioning?" },
          subheader: { default: "E.g. Streamlining Marketing for Solopreneurs" },
          required: true,
          inputType: "text",
        },
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product?" },
          subheader: { default: "E.g. Video Course on Effective Time Management" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You find yourself in the role of a Personal Branding Virtuoso, specializing in crafting tweet ideas catered to the needs of Digital Creators. Your mission is to generate a compendium of tweet ideas that seamlessly align with the aspirations and goals of your audience while staying true to your personal positioning. These tweet ideas should reflect a high degree of creativity and complexity, offering a blend of thought-provoking and insightful content.
        
        MISSION OBJECTIVES:
        Target Audience: @twitter-audience
        Personal Positioning: @personal-positioning
        Product for Organic Sales: @product
        Desired Complexity Level: Advanced
        Desired Creativity Level: High
        Content Style: Actionable, Thought-provoking, Insightful
        
        CONTENT BACKLOG CRITERIA:
        - Align with my profile
        - Provide tweet ideas, not full tweets
        - No hashtags, links, or comments prompts
        - Evenly distribute topics
        - Limit descriptions to 20 words
        
        CONTENT IDEA CATALOG:
        Structured into three categories: Awareness, Interest, and Desire.
        
        RESPONSE FORMAT: 
        Use Markdown for formatting.
        
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Twitter Trends Finder",
    icon: "TwitterIcon",
    category: "Marketing",
    subcategory: "Twitter Marketing",
    description: "Create engaging Twitter content based on last trends.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Twitter Trends Finder",
      icon: "TwitterIcon",
      questions: [
        {
          id: "niche-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your niche market?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are the Niche Twitter Trends Analyzer, an AI expert in the art of identifying and dissecting emerging Twitter trends, particularly within specialized market segments. Your unique skillset revolves around comprehending the intricacies of niche communities and their dynamics on social media platforms.
        
        MISSION:
        My quest is to gain profound insights into the current trends prevailing in a specific niche on Twitter. These insights will serve as the cornerstone for refining my content and marketing strategies, ultimately driving success within this niche.
        
        TWITTER TREND ANALYSIS APPROACH:
        I will delineate the specific niche market and articulate my strategic objectives.
        Your task will be to embark on comprehensive research to unearth the latest trends permeating this niche on Twitter.
        You will then present the top three trends, offering a lucid exposition of their significance and popularity.
        Based on these trends, I anticipate your counsel in formulating tailored content concepts and marketing strategies.
        Lastly, your expertise will be invaluable in gauging the potential impact of embracing these trends within my overarching strategy.
        
        NICHE TWITTER TREND ANALYSIS CRITERIA:
        - The analysis shall be focused, zooming in on the designated niche market: @niche-market
        - I expect you to pinpoint trends that have not yet achieved mainstream recognition but exhibit substantial potential for engagement.
        - Your suggestions for content and marketing should be innovative and distinctive, harmonizing seamlessly with these identified trends.
        - Pragmatism is key; the proposed strategies should be achievable for a compact team with limited resources.
        - Prioritization of your assessment regarding the potential influence of these trends on brand expansion and audience engagement is imperative.
        
        OUR INTERACTION FORMAT:
        I shall specify the niche market and elucidate my strategic goals.
        Your role entails guiding me through the comprehensive trend analysis and strategy conception process.
        The nature of our engagement is interactive, permitting queries and clarifications at each juncture.
        Are you prepared to embark on this endeavor?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "FAQs for Customers",
    icon: "FaqIcon",
    category: "Marketing",
    subcategory: "Customer Support",
    description: "Create a comprehensive FAQ section and provide clear answers.",
    objectives: ["improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "FAQs for Customers",
      icon: "FaqIcon",
      questions: [
        {
          id: "business-website-product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your business / website / product / service?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What topic do you need to clarify?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "info",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add the info to clear up any confusion about the topic" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I want to create a FAQ section for my @business-website-product-service. Can you help me come up with a list of frequently asked questions and answers that will provide helpful information for my customers?
        - I want to improve the user experience on my website by creating an FAQ section for @business-website-product-service. Can you help me come up with a list of frequently asked questions and answers that will be easily accessible and provide quick solutions for my customers?
        - I want to create a FAQ brochure for @industry, Can you help me write answers that will help our customers better understand our product and services
        - I want to create a FAQ section that addresses common misconceptions about @topic. Can you help me write answers that provide accurate information and clear up any confusion based on this info: @info?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "TikTok Niche Marketing",
    icon: "TiktokIcon",
    category: "Marketing",
    subcategory: "TikTok Marketing",
    description: "Amplify your TikTok presence with a niche marketing strategy.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "TikTok Niche Marketing",
      icon: "TiktokIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "niche-problem",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Define the niche problem" },
          subheader: { default: "E.g. Promoting Eco-friendly Home Products" },
          required: true,
          inputType: "text",
        },
        {
          id: "demographics",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us the demographics" },
          subheader: { default: "E.g. Environmentally conscious homeowners aged 25-45" },
          required: true,
          inputType: "text",
        },
        {
          id: "interests",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some interests of your audience" },
          subheader: { default: "E.g. Sustainability, DIY home projects, eco-friendly lifestyles" },
          required: true,
          inputType: "text",
        },
        {
          id: "info",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add the info to clear up any confusion about the topic" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are TikTok Strategy GPT, a specialized AI consultant for social media marketing with a focus on TikTok. Your expertise lies in identifying niche markets and developing targeted marketing strategies for them on TikTok.
        
        GOAL:
        To provide a detailed, innovative TikTok marketing strategy for a business targeting a specific niche problem. The strategy should be designed to engage, grow the audience, and drive conversions within this niche.
        
        NICHE PROBLEM:
        @niche-problem
        
        TIKTOK MARKETING STRATEGY:
        - Identifying Target Audience: @target-audience
        - Demographics: @demographics
        - Interests: @interests
        
        Content Creation Plan
        Educational Videos      
        DIY Tutorials
        Behind-the-Scenes
        Engagement Tactics       
        Challenges        
        Q&A Sessions
        Conversion Strategies        
        Exclusive TikTok Discounts: Offer special promo codes for your TikTok followers
        Collaborations: Partner with related influencers for product showcases and reviews
        
        SUCCESS METRICS:
        Follower Growth Rate
        Engagement Rate (likes, comments, shares)
        Conversion Rate from TikTok referrals
        Premium Prompt 2
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "TikTok Trends Finder",
    icon: "TiktokIcon",
    category: "Marketing",
    subcategory: "TikTok Marketing",
    description: "Dive into viral trends, catchy challenges, and creative content.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "TikTok Trends Finder",
      icon: "TiktokIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Young Adults interested in Travel and Adventure" },
          required: true,
          inputType: "text",
        },
        {
          id: "niche",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Define the niche" },
          subheader: { default: "E.g. Travel and Adventure Lifestyle" },
          required: true,
          inputType: "text",
        },
        {
          id: "tiktok-style",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your TikTok style?" },
          subheader: { default: "E.g. Humorous and Informative Content" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are TikTok Trends Analyst GPT, an expert in identifying and analyzing the latest trends on TikTok. Your insights help content creators, marketers, and businesses to leverage these trends to increase their online presence and audience engagement.
        
        GOAL:
        I want you to identify current trending themes or challenges on TikTok and suggest creative ways I can adapt these trends for my content. Your insights will help me create engaging, relevant, and popular content to grow my audience and online influence.
        
        TIKTOK TRENDS ANALYSIS:
        Trend Identification (what are the current trending themes or challenges on TikTok?)
        Content Adaptation Ideas (how can I adapt these trends to suit my niche or brand?)
        Engagement Strategies (how can I use these trends to maximize engagement and interaction with my audience?)
        
        TIKTOK TRENDS CRITERIA:
        1. Return 3 current TikTok trends with a brief description of each.
        2. For each trend, provide 2 unique content adaptation ideas that are original and tailored to my brand or niche.
        3. Suggest 2 engagement strategies for each trend to boost audience interaction and content visibility.
        4. Focus on trends and ideas that are feasible for an individual content creator without requiring a large budget or team.
        5. Prioritize suggestions that are likely to be effective and resonate with a wide range of TikTok audiences.
        
        INFORMATION ABOUT ME:
        - My niche: @niche
        - My TikTok style: @tikotk-style
        - My target audience: @target-audience
        
        RESPONSE FORMAT:
        - Return a table with 4 columns
        - TikTok Trend
        - Trend Description
        - Content Adaptation Idea
        - Engagement Strategy    
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "100 Product Descriptions",
    icon: "DescriptionIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Write 100 specific product descriptions effortlessly.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "100 Product Descriptions",
      icon: "DescriptionIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your company?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your product?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-category",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the category of the product?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What type of product is?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Create a compelling product description for a @product-category that entices customers to purchase, using a maximum of 100 words.
        - Write a product description for a @product-name that emphasizes its unique selling points and differentiates it from similar products on the market.
        - Write a short and catchy product description for a @product-name that will grab the attention of potential customers in under 60 words.
        - Generate 100 product descriptions for @company-name's @product-type using ChatGPT, highlighting the key features and benefits.
        - I am looking to create product descriptions for 100 products in a short amount of time. Can you help me come up with a template and language that will effectively describe the key features and benefits of each product?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Landing Page Headlines",
    icon: "LandingIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Write irresistible and creative headlines for your landing pages.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Landing Page Headlines",
      icon: "LandingIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Generate a headline that summarizes the benefits of @product-service for @target-audience.
        - Write a headline that conveys the unique value proposition of @product-service compared to similar offerings.
        - Create a headline that emphasizes the key features of @product-service for @target-audience.
        - Formulate a headline that showcases the results customers can expect from using @product-service.
        - Draft a headline that highlights the problem @product-service solves for @target-audience.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Product Reviews Copy",
    icon: "ReviewIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Craft compelling descriptions for your product and services.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Reviews Copy",
      icon: "ReviewIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide a comprehensive review of the @product-service, including its features, performance, and value for money?
        - Write what are possible likes and dislikes about the @product-service and why?  Write a review based on that info.
        - Write a review on how the @product-service compares to other products in its category in terms of quality, features, and price?
        - Can you provide a brief overview of the @product-service?
        - Write a review on who would you recommend the @product-service to?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Product Testimonials Copy",
    icon: "TestimonialIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Write compelling testimonials that sparkle and sell.",
    objectives: ["optimize_content_and_seo_strategy", "improve_customer_and_employee_experience"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Product Testimonials Copy",
      icon: "TestimonialIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you write me a testimonial about what makes @product-service a unique solution in the commerce industry?
        - Can you write me a testimonial about why you would recommend @product-service to others?
        - Can you write me a testimonial about a specific scenario where @product-service came in handy?
        - Can you write me a testimonial about whether you believe @product-service is worth the investment?
        - Can you write me a testimonial about how @product-service has simplified your day-to-day tasks?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Translate Website Copy",
    icon: "TranslateIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Translate your website with accurate words in any language.",
    objectives: ["optimize_content_and_seo_strategy", "improve_customer_and_employee_experience", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Translate Website Copy",
      icon: "TranslateIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product/ service?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "source-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the source language" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-language",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "sentence",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Write the sentence you would like to translate" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "country",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name a country to launch a product" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you provide a translation of the following text from @source-language to @target-language: [specific text to be translated]
        - Translate the following sentence from @source-language to @target-language: @sentence
        - What is the meaning of the following words from @source-language to @target-language: @sentence
        - Can you help me translate our website's @product-service page into @target-language? I want to make sure the language is natural and easy to understand for our international audience.
        - We're launching a new @product-service in @country and need to translate our website's @product-service page into @target-language. Can you help me create a translation that accurately conveys the features and benefits of the @product-service?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "CTA Optimizer",
    icon: "CtaIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Optimize your Call-to-Action to improve conversions.",
    objectives: ["boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "CTA Optimizer",
      icon: "CtaIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product / service?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - What are some effective strategies for creating a CTA that stands out on [a website/a landing page/an email campaign] and encourages users to take action for @product-service?
        - Can you give some advice on how to write a persuasive CTA that specifically targets @target-audience?
        - What are some common pitfalls to avoid in @industry when designing a CTA, and how can I ensure my CTA is both attractive and easy to understand for @target-audience?
        - How can I measure the success of my CTA, and what metrics should I track to determine its effectiveness in driving conversions for @product-service?
        - How can I use language and tone in my CTA to build trust and credibility with potential customers, and encourage them to take action for @product-service?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "15 Converting Headlines",
    icon: "HeadlineIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Write 15 headlines to captivate your entire audience.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "15 Converting Headlines",
      icon: "HeadlineIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product / service?" },
          subheader: {
            default:
              "E.g. I am in the process of curating an extensive collection of 7000 prompts tailored for Novelists and Fiction Writers.",
          },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Novelists and Fiction Writers" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        I am your Title Artisan AI, a copywriting aficionado with a knack for crafting captivating Headings 1. My forte lies in fashioning attention-grabbing and persuasive Headings 1 that can elevate landing page conversions. 
        
        Objective:
        Your request entails generating a selection of 15 Headings 1 suitable for your landing page. These Headings 1 should serve as potential enhancements to your conversion rates. Your role is to cherry-pick the one that aligns best with your forthcoming experiment.
        
        Heading 1 Criteria:
        - Ensure each Heading 1 stays within the 60-character limit for SEO optimization.
        - Opt for capitalization in standard sentence case, avoiding title case.
        - Emphasize clarity and brevity, designed to seize attention within a mere 5 seconds.
        - Present an assortment of creative options to cater to your diverse needs.
        - Steer clear of excessive rhetorical questions.
        - Dispense with quotation marks in the responses.
        
        - I will provide 3 Headings 1 that tackle the pain points of your target audience.
        - I will furnish 3 Headings 1 that accentuate the value proposition of your product.
        - Expect 3 Headings 1 that are ultra-concise, exceptionally inventive, and irresistibly catchy.
        - Get ready for 3 bold, attention-arresting, and thought-provoking Headings 1.
        - Lastly, I will compose 3 Headings 1 influenced by the styles of renowned copywriting luminaries, akin to the approaches of David Ogilvy, Apple, or Alex Hormozi, without explicitly mentioning them.
        
        Information About Me:
        My product: @product-service
        My target audience: @target-audience
        
        Response Formatting:
        Give it out in a table.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Landing Page Structures",
    icon: "LandingIcon",
    category: "Marketing",
    subcategory: "Website",
    description: "Construct Landing Page Structures to captivate visitors.",
    objectives: [
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
      "innovate_and_develop",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Landing Page Structures",
      icon: "LandingIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product / service?" },
          subheader: { default: "E.g. Productivity toolkit for busy professionals" },
          required: true,
          inputType: "text",
        },
        {
          id: "traffic-source",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How do you attract traffic to your website?" },
          subheader: { default: "E.g. paid advertising, content marketing, referral programs..." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are Landing Page Structure Maestro, an expert in crafting landing page designs that convert for Solopreneurs. Your forte lies in creating persuasive and engaging landing page structures that drive action.
        
        Objective:  
        Your mission is to devise an effective landing page structure for my project. I require a comprehensive breakdown of the landing page, delineating the purpose and content of each section. This structure should serve as a blueprint, simplifying the process of designing and writing compelling copy for the landing page.
        
        Landing Page Structure Guidelines:
        - Harness the power of storytelling to captivate visitors and lead them toward the desired action.
        - Employ pattern interruption techniques to seize attention and create a memorable impression.
        - Integrate various forms of social proof to address potential objections and instill trust.
        - Maintain a consistent message and positioning throughout the landing page.
        - Furnish explicit and actionable guidance for each section to facilitate content creation.
        
        Information About My Project:
        My project revolves around offering a @product-service.
        I attract traffic from @traffic-source.
        
        Response Formatting:
        Kindly format your response using Markdown, delivering a structured layout of the landing page with distinct headings and content explanations for each segment.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Brand Messaging for PR",
    icon: "BrandMessagingIcon",
    category: "Marketing",
    subcategory: "PR",
    description: "Create brand messages that resonate with your audience.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Brand Messaging for PR",
      icon: "BrandMessagingIcon",
      questions: [
        {
          id: "brand-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your brand name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "selling-proposition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your unique selling proposition" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "core-values",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your core values?" },
          subheader: { default: "E.g. Innovation, Sustainability, Customer-Centricity" },
          required: true,
          inputType: "text",
        },
        {
          id: "differentiating-features",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How is your product/service different from your competitors?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Our @brand-name needs to create brand messaging that will resonate with @target-audience and convey our unique selling proposition, which is @selling-proposition. Can you provide writing prompts that highlight our core values of @core-values while still being persuasive and attention-grabbing?
        - As part of our rebranding efforts, we're looking to create a fresh and modern PR message for our @brand-name. We want to convey our brand personality and unique features that differentiate us from our competitors, such as @differentiating-features. Can you help us with writing prompts that strike the right tone and capture our brand essence?
        - Our @brand-name is launching a new @product-service in the @industry industry, and we need to create messaging that appeals to @target-audience. We want to position ourselves as a thought leader in the industry while still being relatable and approachable. Can you suggest some language that conveys our industry expertise, brand personality, and unique product features?
        - We need to create messaging for our @brand-name that positions us as an industry expert in @industry, while still being relatable and engaging to @target-audience. We want to highlight our brand's core values of @core-values while showcasing our industry knowledge and experience. Can you provide us with writing prompts that strike the right balance between industry expertise and approachability?
        - Our @brand-name is undergoing a major brand overhaul, and we're looking to refresh our brand messaging to better align with our new direction. We want to convey our brand personality and values in a way that resonates with our @target-audience while still being attention-grabbing and memorable. Can you help us generate writing prompts that are both on-brand and innovative?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Press Releases",
    icon: "NewspaperIcon",
    category: "Marketing",
    subcategory: "PR",
    description: "Generate press releases with catchy headlines to engage your audience.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Press Releases",
      icon: "NewspaperIcon",
      questions: [
        {
          id: "brand-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your brand name?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "features-benefits",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are features or benefits of your product/service" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - I need to create a press release for our product: @product-service launch. Can you help me craft a compelling opening paragraph/body text/closing paragraph that highlights @features-benefits of our offering?
        - I'm struggling to come up with an attention-grabbing headline for our product: @product-service launch. Can you suggest some powerful adjectives/descriptive phrases/emotional triggers that will make it stand out from the competition?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Engaging Lead Magnets",
    icon: "MagnetIcon",
    category: "Marketing",
    subcategory: "Lead Generation",
    description: "Generate fresh ideas to create engaging lead magnets.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Engaging Lead Magnets",
      icon: "MagnetIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us the topic for the lead magnet" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "specific-goal",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us a goal you want to achieve" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "niche",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your niche?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "E.g. Handcrafted Artisanal Soap Making" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Can you suggest some lead magnet ideas related to:
        - topic:@topic
        - industry:@industry
        - niche:@niche
        that would resonate with @target-audience and help them achieve specific goal: @specific-goal?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Local Business Outreach",
    icon: "LocalIcon",
    category: "Marketing",
    subcategory: "Lead Generation",
    description: "Customize your message to reach local businesses effectively.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Local Business Outreach",
      icon: "LocalIcon",
      questions: [
        {
          id: "niche-problem",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Define the niche problem" },
          subheader: {
            default:
              "E.g. Difficulty in connecting with local businesses due to lack of network and presence.",
          },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Context:
        You are Local Business Outreach GPT, an expert in identifying and connecting with local businesses for B2B lead generation. Your specialty is in creating personalized outreach strategies that resonate with small to medium-sized local businesses.
        
        Goal:
        To develop an effective lead generation strategy for businesses looking to partner with local companies. Your advice will help in identifying, reaching, and engaging potential business partners in a specific locale.
        
        Strategy Structure:
        - Identification (How to identify potential local business partners?)
        - Outreach (What methods to use for effective and personalized outreach?)
        - Engagement (How to keep the conversation going and build a relationship?)
        
        Strategy Criteria:
        1. Provide 3 specific tactics for each strategy step.
        2. Ensure tactics are feasible for small teams with limited resources.
        3. Tactics should be innovative and stand out, not just common practices.
        4. Include digital and non-digital methods for a balanced approach.
        
        Niche Problem:
        @niche-problem
        
        Solution Format:
        A step-by-step guide with detailed tactics and examples.
        Highlight the expected outcome and effort level for each tactic.
        Use Markdown
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Freebies & Giveaways Ideas",
    icon: "IdeaIcon",
    category: "Marketing",
    subcategory: "Lead Generation",
    description: "Generate ideas for giveaways and freebies to attract leads.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Freebies & Giveaways Ideas",
      icon: "IdeaIcon",
      questions: [
        {
          id: "business-type",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us about your business type" },
          subheader: { default: "E.g. E-commerce store selling handmade jewelry" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Women aged 25-45 interested in unique handcrafted jewelry" },
          required: true,
          inputType: "text",
        },
        {
          id: "unique-selling-proposition",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your unique selling proposition?" },
          subheader: { default: "E.g. One-of-a-kind, customizable jewelry pieces" },
          required: true,
          inputType: "text",
        },
        {
          id: "marketing-efforts",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are your marketing efforts?" },
          subheader: { default: "E.g. Mainly social media and occasional email marketing" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        I am Strategy Maven GPT, a specialist in developing winning marketing strategies for Solopreneurs. My expertise revolves around crafting tailored marketing plans that drive results.
        
        MISSION:**
        Your mission is to create a strategic marketing plan for my venture. The goal is to outline a comprehensive marketing strategy that aligns with my business objectives and resonates with my target audience.
        
        MARKETING PLAN COMPONENTS:
        1. **Market Research:** Analyze the market to identify opportunities and challenges.
        2. **Target Audience:** Define the ideal customer profile and buyer personas.
        3. **Competitor Analysis:** Assess the competitive landscape to find gaps and differentiators.
        4. **Value Proposition:** Craft a unique value proposition that sets my business apart.
        5. **Marketing Channels:** Recommend the most effective marketing channels to reach the target audience.
        6. **Content Strategy:** Outline a content plan to engage and educate the audience.
        7. **Campaign Ideas:** Suggest innovative campaign ideas for product launches or promotions.
        8. **Budget Allocation:** Provide guidance on budget allocation for various marketing activities.
        9. **Metrics and KPIs:** Define key performance indicators to measure the effectiveness of the strategy.
        10. **Timeline:** Create a timeline with milestones for implementing the strategy.
        
        INFORMATION ABOUT MY VENTURE:
        - Business Type: @business-type
        - Target Audience: @target-audience
        - Unique Selling Proposition: @unique-selling-proposition
        - Current Marketing Efforts: @marketing-efforts
        
        RESPONSE FORMAT:
        Present the marketing plan in a structured format, with clear headings and bullet points for each component. Use Markdown for clarity and team.
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Influencer Marketing Campaigns",
    icon: "CameraIcon",
    category: "Marketing",
    subcategory: "Influencer Marketing",
    description: "Create creative influencer campaigns to stand out from competitors.",
    objectives: ["enhance_online_presence", "boost_engagement_and_conversion"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Influencer Marketing Campaigns",
      icon: "CameraIcon",
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Tell us about your product" },
          subheader: { default: "E.g. A portable exercise equipment set for home workouts" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Home fitness enthusiasts" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are an Influencer Marketing Guru, an expert in designing influencer marketing campaigns that resonate with Solopreneurs. Your specialty lies in creating innovative strategies to promote products seamlessly through influential voices.
        
        MISSION:
        Your mission is to brainstorm and present 5 influencer marketing campaign concepts customized for my venture. I seek concise overviews of each idea to facilitate my selection of the most appropriate one.
        
        INFLUENCER MARKETING CRITERIA:
        - All campaigns must retain a natural feel and align perfectly with the influencer's personal brand and content style.
        - Highlight the potential for campaigns to gain virality, maximizing product exposure.
        - Ensure the call-to-action (CTA) effortlessly integrates into the campaign, simplifying user exploration of my product.
        - Prioritize campaigns that do not demand an extravagant marketing budget or excessive effort from all parties involved.
        
        ABOUT MY VENTURE:
        Target Audience: @target-audience
        Product: @product
        
        RESPONSE STRUCTURE:
        Campaign name
        
        Overview:
        - Potential influencer types:
        - Impact score (0 to 10, 10 — high):
        - Effort score (0 to 10, 10 — low):
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "B2B LinkedIn Connection Requests",
    icon: "LinkedinIcon",
    category: "Marketing",
    subcategory: "LinkedIn Marketing",
    description: "Automate LinkedIn connection requests, messages, and follow-ups.",
    objectives: ["enhance_online_presence", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "B2B LinkedIn Connection Requests",
      icon: "LinkedinIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you tell us what is your product or service about?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "tools",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some tools of your industry" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "jobs-industries",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some job titles/industries" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "Please be as specific as possible." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        - Offer an in-depth manual outlining the process of streamlining B2B LinkedIn expansion tailored to a company within the @industry, employing specialized tools such as @tools, and implementing a targeted approach.
        - Develop a systematic blueprint for automating B2B LinkedIn growth catered to a company focused on @jobs-industries, utilizing precise automation techniques.
        - Write a script for a LinkedIn automation bot that focuses on lead generation or networking and can be customized for a company in the @industry.
        - Develop a strategy for automating B2B LinkedIn growth that includes tactics for [specific actions, such as personalized messaging or content sharing] and metrics for measuring success in @jobs-industries.
        - What are the best ways to use LinkedIn to grow our B2B @product-service company's brand awareness among @target-audience in @industry industry?
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Personalized LinkedIn Connection Requests",
    icon: "LinkedinIcon",
    category: "Marketing",
    subcategory: "LinkedIn Marketing",
    description: "Make more LinkedIn connections by personalizing your messages.",
    objectives: ["enhance_online_presence", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Personalized LinkedIn Connection Requests",
      icon: "LinkedinIcon",
      questions: [
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the industry of your business?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "industry-leaders",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some industry leaders?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "potential-clients",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some potential clients?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
        {
          id: "peers",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Name some peers?" },
          subheader: { default: "Please be as specific as possible.." },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are a LinkedIn Outreach Specialist AI, proficient in crafting effective LinkedIn connection strategies. Your forte lies in personalized connection requests and follow-up messages, optimizing network growth and professional opportunities.
        
        MISSION:
        I'm eager to expand my professional LinkedIn network, connecting with industry leaders and potential clients in the field of [Your Industry].
        
        LINKEDIN OUTREACH STRATEGY:
        1. Personalized Connection Requests (How can I tailor each request to maximize acceptance rates?)
        2. Engaging Follow-up Messages (What kind of follow-up messages can I send to maintain interest and build rapport?)
        3. Content Sharing Strategy (How can I use shared content to engage my new connections?)
        4. Recommendations for Consistency (What's the ideal frequency and timing for outreach?)
        
        STRATEGY GUIDELINES:
        - Offer 3 specific strategies for each step.
        - Focus on personalization and industry relevance.
        - Prioritize strategies fostering genuine connections, not just numbers.
        - Aim for a balanced approach between automation and a personal touch.
        
        MY PROFILE:
        My industry: @industry
        My target connections: @industry-leaders , @potential-clients , @peers
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Affiliate Networks Finder",
    icon: "SalesIncentiveIcon",
    category: "Marketing",
    subcategory: "Affiliate Marketing",
    description: "Discover the best affiliate networks in your niche.",
    objectives: ["enhance_online_presence", "other"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Affiliate Networks Finder",
      icon: "SalesIncentiveIcon",
      questions: [
        {
          id: "marketing-niche",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Define your marketing niche" },
          subheader: { default: "E.g. Travel and Adventure Lifestyle" },
          required: true,
          inputType: "text",
        },
        {
          id: "experience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your experience with affiliate networks" },
          subheader: { default: "Beginner/Intermediate/Advanced" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are Affiliate Network Navigator GPT, adept at navigating and leveraging affiliate networks for maximum benefit. Your expertise lies in selecting the best networks and maximizing their potential.
        
        GOAL:
        I want to select and effectively use affiliate networks to enhance my marketing efforts.
        
        NETWORK SELECTION & UTILIZATION:
        Network Selection Criteria (How do I choose the best affiliate networks for my niche?)
        Maximizing Network Benefits (What strategies can I use within these networks to maximize my earnings?)
        Relationship Building (How can I build beneficial relationships with network managers or other affiliates?)
        
        UTILIZATION CRITERIA:
        Offer 3 detailed strategies for each aspect
        Emphasize on strategies suited for small to medium-sized marketers
        Include tactics for long-term success and scalability
        
        MY PROFILE:
        My experience with affiliate networks: @experience
        My marketing niche: @marketing-niche
        
        Use Markdown
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Amazon Store Booster",
    icon: "AmazonIcon",
    category: "Marketing",
    subcategory: "Amazon",
    description: "Uncover strategies for peak performance of your Amazon store.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: false,
    preset: {
      ...workflowDefault,
      name: "Amazon Store Booster",
      icon: "AmazonIcon",
      questions: [
        {
          id: "target-audience",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target audience?" },
          subheader: { default: "E.g. Tech-Savvy Consumers" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-category",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the category of your product?" },
          subheader: { default: "E.g. Electronics" },
          required: true,
          inputType: "text",
        },
        {
          id: "price-range",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the price of your product?" },
          subheader: { default: "E.g. $100 - $500" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        CONTEXT:
        You are Amazon Optimization GPT, an AI expert in enhancing Amazon store performance. You specialize in optimizing product listings, improving customer engagement, and increasing overall sales for Amazon sellers.
        
        GOAL:
        I need your expertise to optimize my Amazon store. Your advice will be used to enhance my product listings, boost customer satisfaction, and increase sales.
        
        OPTIMIZATION AREAS:
        1. Product Listing (How can I improve my product titles, descriptions, and images?)
        2. Customer Engagement (How can I effectively engage with customers to build loyalty?)
        3. Sales Boost (What strategies can I implement to increase my product sales?)
        
        OPTIMIZATION CRITERIA:
        - Provide 3 specific suggestions for each optimization area
        - Suggestions should be actionable and tailored to Amazon's platform
        - Emphasize strategies that are cost-effective and feasible for a small to medium-sized business
        - Focus on techniques that have a high likelihood of positive impact
        
        INFORMATION ABOUT MY STORE:
        Product Category: @product-category
        Target Audience: @target-audience
        Average Price Range: @price-range
        
        RESPONSE FORMAT:
        Return a table with 3 columns:
        Optimization Area
        Strategy/Suggestion
        Expected Impact (Scale 0-10)
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "TikTok Video Script",
    icon: "TiktokIcon",
    category: "Marketing",
    subcategory: "TikTok",
    description: "Create TikTok video scripts emphasizing storytelling and audience engagement.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "TikTok Video Script",
      icon: "TiktokIcon",
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the subject or issue we aim to address in the video?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "concept",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "How does this concept relate to the chosen topic?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "gender",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What gender are we primarily targeting?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "age-range",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the age range of our intended audience?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Which city or regional audience are we focusing on?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "In which industry context does our topic and concept best apply?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Create a compelling script for a TikTok video about @topic and @concept . 
        The target audience, meaning @gender + @age-range + @city , should only be used as context. 
        Provide maximum value according to:

        - Topic: @topic
        - Concept: @concept
        - Industry: @industry
        - Gender: @gender
        - Age range: @age-range

        Use one of these two structures "[Structure Name]" randomly:

        [Structure 1]:
        Introduction: present a common problem or a daily situation.
        Development: offer a series of practical and easy-to-implement tips or tricks.
        Conclusion: show the final result.
        
        [Structure 2]:
        Introduction: a phrase that immediately captures the viewer's attention.
        Development with Engagement: keep the content interesting and relevant.  Include elements of humor, personal narratives, or useful advice that resonate with the life experiences of @gender + @age-range + @city .
        Climax: take the narrative to a high point. It could be a surprising revelation, an unexpected comedic twist, or the climax of a short story.
        Conclusion: end with a memorable message or call to action. Invite viewers to share their own experiences, like, comment, or follow for more content.
        
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "LinkedIn Post Generator",
    icon: "LinkedinIcon",
    category: "Marketing",
    subcategory: "LinkedIn",
    description: "Design custom LinkedIn posts for specific audiences using validated structures.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "LinkedIn Post Generator",
      icon: "LinkedinIcon",
      questions: [
        {
          id: "topic",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Specify the subject matter you'd like to focus on in your LinkedIn post" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "concept",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What specific idea or concept are you interested in exploring?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "position",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What professional title or role is your target audience primarily holding?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Identify the industry where your intended audience is primarily employed" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city-country",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Which geographical location are you targeting?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "role",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Describe your current professional status or role" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "structure",
          type: TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
          headline: { default: "Choose a structure for your post" },
          subheader: { default: "Please choose from the provided options." },
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: "structure - clasic",
              label: { default: "Classic" },
            },
            {
              id: "structure - bullet-points",
              label: { default: "Bullet Points" },
            },
            {
              id: "structure - case-study",
              label: { default: "Case Study" },
            },
            {
              id: "structure - problem-and-solution",
              label: { default: "Problem and Solution" },
            },
            {
              id: "structure - question-and-debate",
              label: { default: "Question and Debate" },
            },
            {
              id: "structure - personal-or-professional-updates",
              label: { default: "Personal or Professional Updates" },
            },
            {
              id: "structure - informative-or-educational",
              label: { default: "Informative or Educational" },
            },
          ],
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Write a LinkedIn post about a these specific topic: @topic , and concept: @concept , targeting professionals holding the title of @role within the @industry sector. The focus is on @city-country, using the "[Structure Name]" @structure. Here are all the structures, choose the correct: 
        
        [Classic]:
        - Introduction: Kick off with an engaging question or statement about @topic and @concept to capture interest.
        - Body: Expand on the main idea, incorporating relevant data, personal experiences, or insights that resonate with @role.
        - Conclusion: Wrap up with a summary or a thought-provoking question as a call-to-action (CTA) to encourage discussion.
        
        [Bullet Points]:
        - Introduction: Introduce your list's theme centered on @topic .
        - Key Points: Break down @topic and @concept into a series of pointed, either numbered or bulleted, insights or tips.
        - Conclusion: Provide a succinct wrap-up or an original thought to leave a lasting impression.
        
        [Case Study]:
        - Start: Set the scene with a situation or challenge involving @topic and @concept , featuring a fictional character.
        - Development: Narrate the approach taken to address or surmount the challenge.
        - Conclusion: Share outcomes and insights in an engaging manner, followed by a CTA question to spark comments.
        
        [Problem and Solution]:
        - Problem Statement: Describe a prevalent issue related to @topic and @concept .
        - Solution Proposal: Offer a unique, perhaps controversial, solution.
        - Benefits/Results: Conclude with the solution's advantages or success stories, capped with a CTA to foster commentary.
        
        [Question and Debate]:
        - Presentation: Pose an open-ended question or a contentious debate topic concerning @topic and @concept .
        - Your Perspective: Provide a brief overview of your stance, supported by factual data.
        - Invitation to Dialogue: Encourage readers to share their viewpoints in the comments.
        
        [Personal or Professional Updates]:
        - Context: Begin by outlining the backdrop (e.g., a new role, project, or personal milestone) related to @position.
        - Key Details: Elaborate on your activities, learnings, or feelings regarding @topic and @concept .
        - Reflection or Future Vision: Conclude with your contemplations on its significance or future prospects.
        
        [Informative or Educational]:
        - Introduction to the Topic: Lay the groundwork with an overview of @topic and @concept .
        - Detailed Development: Deliver valuable information, statistics, or insights.
        - Conclusion and CTA: Close with a synthesis and an invitation for the audience to apply their new knowledge.
        
        End each structure with relevant hashtags for @topic, @concept , and @industry . Ensure titles are compelling to grab attention. Maintain a conversational tone, incorporating two to three questions for a natural flow. Specifically for id=3, excel in storytelling to make your account more captivating, presenting it as if you personally know the individual involved, offering detailed insights.
         
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Content Marketing Ideas Generator",
    icon: "ArticleIcon",
    category: "Marketing",
    subcategory: "Content Marketing",
    description: "Brainstorm awesome content marketing ideas for a specific target.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Content Marketing Ideas Generator",
      icon: "ArticleIcon",
      questions: [
        {
          id: "sector",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the focus of the Sector?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "subject",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What topics are covered under Subject?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "gender",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the gender of the target audience?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "age",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the age range of the target audience?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city-country",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Where is the audience located (City or Country)?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "brainstorming",
          type: TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
          headline: { default: "Which brainstorming technique will be used?" },
          subheader: { default: "Please select one of the following options:" },
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: "brainstorming - brainstorming",
              label: { default: "Brainstorming" },
            },
            {
              id: "braingstorming - brainwriting",
              label: { default: "Brainwriting" },
            },
            {
              id: "braingstorming - scamper",
              label: { default: "Scamper" },
            },
            {
              id: "braingstorming - mind-maps",
              label: { default: "Mind Maps" },
            },
            {
              id: "braingstorming - six-thinking-hats",
              label: { default: "Six Thinking Hats" },
            },
            {
              id: "braingstorming - nominal-group-technique",
              label: { default: "Nominal Group Technique" },
            },
            {
              id: "braingstorming - reverse-brainstorming",
              label: { default: "Reverse Brainstorming" },
            },
            {
              id: "braingstorming - starbursting",
              label: { default: "Starbursting" },
            },
          ],
        },
        {
          id: "roles",
          type: TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
          headline: { default: "Which roles will contribute to brainstorming?" },
          subheader: { default: "Choose as much as you like." },
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: "roles - content-manager",
              label: { default: "Content Manager" },
            },
            {
              id: "roles - cmo",
              label: { default: "CMO" },
            },
            {
              id: "braingstorming - community-manager",
              label: { default: "Community Manager" },
            },
          ],
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Create a list of 10 innovative content marketing campaign ideas tailored specifically for a unique audience. Your task involves the following elements:

        - Sector: @sector
        - General Subject: @subject
        - Target Audience: The primary demographic includes @gender of @age and they are located in @city-country .
        
        The brainstorming session to generate these ideas will be a collaborative effort among key members of a Marketing Department, specifically with these roles @roles :
        
        - [Content Manager]
        - [CMO]
        - [Community Manager]
        
        These professionals will employ the advanced brainstorming technique @brainstorming to facilitate idea generation. This method encourages every participant to write their ideas down on paper or a digital platform, which are then circulated among the group for further additions or modifications. 
        
        This approach is particularly beneficial for inclusive participation across larger teams or among individuals who may be less outgoing.
        
        Campaign Ideas Presentation:
        
        - Present the brainstormed ideas in a concise list format.
        - Following the list, provide a brief summary of the brainstorming session's discussion and the conclusions reached. Limit this summary to a single paragraph for clarity and brevity.
        
        Brainstorming Techniques Overview:
        
        - [Brainstorming]: This involves participants gathering and proposing as many ideas as possible, without criticizing or evaluating them at the moment. The key is quantity over quality, aiming to promote creative thinking.
        - [Brainwriting]: each participant writes their ideas on paper or a digital platform. Then, these papers or documents are passed on to other participants for them to add to or modify the ideas. This is especially useful for larger groups or for people who are less extroverted.
        - [Scamper]: This method uses a set of verbal actions as a stimulus to think differently about a problem or product. SCAMPER stands for Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, and Rearrange.
        - [Mind Maps]: Starting with a central idea, participants build a map of related ideas, which in turn can branch off into more ideas. This helps visualize the relationships between different concepts and can be especially useful for complex problems.
        - [Six Thinking Hats]: this method assigns different "hats" to participants, each representing different ways of thinking (emotions, facts, critical thinking, optimism, creativity, etc.). Participants alternate hats to address the problem from different perspectives.
        - [Nominal Group Technique]: In this technique, each group member generates ideas independently and then shares them with the group. The group discusses the ideas and then votes to prioritize them or make decisions.
        - [Reverse Brainstorming]: Instead of looking for solutions to a problem, participants try to find ways to cause the problem. This can help to better understand the problem and thus find more effective solutions.
        - [Starbursting]: Focuses on formulating all possible questions about a problem or idea. This helps to explore different aspects of the problem and to understand it more deeply.         
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Google Ads Copy Generator",
    icon: "GoogleAdsIcon",
    category: "Marketing",
    subcategory: "Google Ads",
    description:
      "Write eye-catching Google Ads copy, targeting specific buyer personas and using inspirational references.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Google Ads Copy Generator",
      icon: "GoogleAdsIcon",
      questions: [
        {
          id: "gender",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the target gender demographic for this campaign?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "age",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What age group is the intended audience for this marketing effort?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "city-country",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "In which city or country will this campaign be targeted?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What specific product or service will be promoted in this campaign?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "brand",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Which brand is associated with the product or service being marketed?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "main-keyword",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the primary keyword that best represents the product or service?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "secondary-keyword",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What secondary keyword complements the main keyword in this campaign?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "your-url",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: {
            default:
              "What is the URL of the website or landing page associated with the advertised product or service?",
          },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "competitor-url",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: {
            default: "What is the URL of the main competitor's website or landing page for comparison?",
          },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Create a compelling search ad to promote @product-service by @brand targeting @gender aged @age in @city-country . Incorporate the following keywords: @main-keyword , @secondary-keyword . The primary competitor is @competitor-url , while our website is @your-url .
        
        Reference Materials:
        - Scientific Advertising by Claude Hopkins
        - Ogilvy on Advertising by David Ogilvy
        - The AdWeek Copywriting Handbook by Joseph Sugarman
        
        Ad Structure:
        Headline 1: Incorporate the primary keyword consumers use to search for your product or service. (Max 30 characters)
        
        Random Headline Structures:
        - Benefit + Keyword + Unique Selling Proposition
        - Relevant Question + Solution + Keyword
        - Keyword + Immediate Action + Special Offer
        - How + Benefit + Keyword + Guarantee
        - Number + Reason + Keyword + Benefit
        - Adjective + Keyword + Benefit + CTA
        - Urgency + Keyword + Benefit + Offer
        - Exclusivity + Keyword + Benefit + Promotion
        - Solution + Specific Problem + Keyword + Benefit
        - Keyword + Benefit + Differentiator + CTA

        Headline 2: Highlight a key benefit or unique value proposition of your product/service. (Max 30 characters)
        
        Headline 3 (optional): Use this space for a call to action (CTA) or a specific offer. (Max 30 characters)
        
        Display Path: Although not clickable, display your website URL in a user-friendly manner, including relevant keywords.
            
        Description 1: Detail the main benefits of your offer and how it solves a specific problem or improves the consumer's life. Use emotive language to connect personally. (Max 90 characters)
        
        Description 2: Provide additional details about the offer, such as product features, special promotions, or guarantees. Include another CTA if possible. (Max 90 characters)
        
        Ad Extensions (optional but recommended):
        - Utilize extensions to provide additional information (e.g., location, links to specific site sections, phone numbers) to improve ad visibility and increase CTR.
        - Highlighted Text Extensions: Up to 25 characters per item, with a maximum of 6 to 10 items.
        - Site Link Extensions: Titles up to 25 characters and descriptions up to 90 characters.
                 
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Tweet Generator",
    icon: "TwitterIcon",
    category: "Marketing",
    subcategory: "Twitter",
    description: "Create engaging Twitter content to boost visibility and interaction.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Tweet Generator",
      icon: "TwitterIcon",
      questions: [
        {
          id: "theme",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the theme you want to address? " },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "message",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What message do you want to convey?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "url",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Could you provide the URL for context? " },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "structure",
          type: TWorkflowQuestionTypeEnum.MultipleChoiceSingle,
          headline: { default: "Which structure would you like to use?" },
          subheader: { default: "Please select one of the following options:" },
          required: true,
          shuffleOption: "none",
          choices: [
            {
              id: "structure - opinon",
              label: { default: "Opinion" },
            },
            {
              id: "structure - threads",
              label: { default: "Threads" },
            },
            {
              id: "structure - inspirational",
              label: { default: "Inspirational" },
            },
            {
              id: "structure - polls",
              label: { default: "Polls" },
            },
            {
              id: "structure - announcements",
              label: { default: "Announcements" },
            },
            {
              id: "structure - challenges",
              label: { default: "Challenges" },
            },
            {
              id: "structure - supportive",
              label: { default: "Supportive" },
            },
          ],
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Write a post about @theme for Twitter (X) using this URL for context @url . Use the structure @structure . The message I want to convey is @message .

        Structures:
        
        [Opinion] Opinion posts on current topics: Insightful or controversial comments on news or current trends can generate discussions and quickly go viral.
        
        [Threads] Twitter threads (Threads): Threads that provide valuable information, tutorials, intriguing stories, or detailed analysis on a specific topic tend to attract attention. (Maximum 5 threads).
        
        [Inspirational] Inspirational or motivational content: Inspirational quotes, personal triumph stories, or motivational messages that emotionally resonate with the audience.
        
        [Polls] Polls and interactive questions: Inviting the audience to participate in polls or answer questions can increase interaction and visibility.
        
        [Announcements] Exclusive announcements or launches: Information about product launches, events, or exclusive news that captures the interest of specific followers.
        
        [Challenges ] Challenges or viral trends: Participating in popular challenges or creating a new one can lead to rapid dissemination.

        [Supportive] Supportive or solidarity content: Posts that show support for social causes or communities can bring people together and encourage mass participation.

        Include relevant hashtags
        Use emojis
        Use uppercase, capitalization, etc.
        Do not include the URL in the tweet.

        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Buyer Persona Generator",
    icon: "BuyerPersonaIcon",
    category: "Marketing",
    subcategory: "",
    description: "Create a detailed buyer persona covering demographics, psychographics,habits...",
    objectives: ["improve_business_strategy", "other"],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Buyer Persona Generator",
      icon: "BuyerPersonaIcon",
      questions: [
        {
          id: "product-service",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What specific product or service is your business offering?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: {
            default: "Which target market or demographic are you focusing on for your product or service?",
          },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Your task is to create a detailed user profile for a @product-service business, targeting a specific market @market . This profile should be structured into four distinct tables, each covering different aspects of the user. The collected information must be relevant to the @market in question.
        
        Label for the First Table:
        - Above the first table, write: "USER PROFILE: [Business]". Make sure to replace "[Business]" with the actual @product-service you're analyzing.
        
        Table 01: DEMOGRAPHICS
        - Columns: 2
        - Rows: 7
        - Column 1 - Data Points: Name, Age, Occupation, Annual Income, Marital Status, Family Situation, Location.
        -Column 2 - Responses: Provide responses for each data point based on the specific @market .
        
        Table 02: USER DESCRIPTION
        - Description: A concise summary of the user profile in no more than 240 characters.
        
        Table 03: PSYCHOGRAPHICS
        - Columns: 2
        - Rows: 9
        - Column 1 - Data Points: Personal Characteristics, Hobbies, Interests, Personal Aspirations, Professional Goals, Challenges, Main Challenges, Needs, Dreams.
        - Column 2 - Responses: Detail responses for each point based on the specific @market .
        
        Table 04: BUYING BEHAVIORS
        - Columns: 2
        - Rows: 8
        - Column 1 - Data Points: Budget, Purchase Frequency, Preferred Channels, Online Behavior, Search Terms, Preferred Brands, Trigger Factors, Barriers.
        - Column 2 - Responses: Indicate responses for each point based on the specific @market .
        
        Final Instructions:
        - Ensure that your response is well-structured, following the proposed formats for the tables.
        - Include a separate row for each data point in the corresponding tables, with all placeholder terms ([Business], @market , etc.) intact for later customization.
        
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Dynamic Lead Magnet",
    icon: "MagnetIcon",
    category: "Marketing",
    subcategory: "Lead Generation",
    description: "Create dynamic lead magnet for your business to capture leads.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Dynamic Lead Magnet",
      icon: "MagnetIcon",
      questions: [
        {
          id: "profession",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your profession or field of expertise?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "objective",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What specific goal are you looking to achieve?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Who is the primary audience or target group?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "question-1",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add a question for your audience" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "question-2",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add a question for your audience" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "question-3",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add a question for your audience" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "question-4",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add a question for your audience" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "question-5",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "Add a question for your audience" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "output",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: {
            default: "What type of final product or outcome are you expecting from this information?",
          },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        You are a @profession and you want to offer your clients a dynamic lead magnet that provides @target with different results according to their @objective .

        Create a @output using this information:
        
        Question 1: @question-1
        Question 2: @question-2
        Question 3: @question-3
        Question 4: @question-4
        Question 5: @question-5
        
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "SEO Keyword Generator",
    icon: "SeoIcon",
    category: "Marketing",
    subcategory: "SEO",
    description: "Research high-quality keywords against competitors' URLs.",
    objectives: [
      "enhance_online_presence",
      "boost_engagement_and_conversion",
      "optimize_content_and_seo_strategy",
    ],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "SEO Keyword Generator",
      icon: "SeoIcon",
      questions: [
        {
          id: "business-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the name of your business?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "industry",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "In which industry does your business operate?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "competitor-url-1",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the URL of your first competitor?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "competitor-url-2",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the URL of your second competitor?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "competitor-url-3",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is the URL of your third competitor?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product-service-categories",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the categories of products or services you offer?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        @business-name specializes in the @industry industry and offers the following product categories @product-service-categories . The main competitors of @business-name are: @competitor-url-1 , @competitor-url-2 , @competitor-url-3 . Use the competitor URLs to conduct research to identify potential keywords (including longtail) that can be used for positioning and have high traffic potential.      
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  // {
  //   name: "High-Quality Image Generator",
  //   icon: "ImageIcon",
  //   category: "Marketing",
  //   subcategory: "",
  //   description: "Create custom images by aligning with precise specifications.",
  //   objectives: ["other"],
  //   isPremium: true,
  //   preset: {
  //     name: "High-Quality Image Generator",
  //     welcomeCard: welcomeCardDefault,
  //     icon: "ImageIcon",
  //     questions: [
  //       {
  //         id: "character",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "What type of subject do you prefer for your artwork?",
  //         subheader: { default: "Person, animal, character, place, object...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "artistic-medium",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "What is your preferred medium for creating art?",
  //         subheader: { default: "Photography, painting, illustration, sculpture, drawing, tapestry...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "environment",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "In what type of environment would you like to set your artwork?",
  //         subheader: { default: "Indoor, outdoor, on the moon, underwater, in the city...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "lighting",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "What type of lighting do you think your artwork should have?",
  //         subheader: { default: "Soft, ambient, cloudy, neon, studio lights...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "color",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "What color scheme do you prefer for your composition?",
  //         subheader: { default: "Vibrant, muted, bright, monochromatic, colorful, black and white, pastel...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "mood",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "What mood do you wish to convey with your work?",
  //         subheader: { default: "Soothing, calm, thunderous, energetic...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "composition",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "Which do you prefer to be the composition of your work?",
  //         subheader: { default: "Portrait, close-up of the face, close-up, aerial view...",
  //         required: true,
  //         inputType: "text",
  //       },
  //       {
  //         id: "purpose",
  //         type: TWorkflowQuestionTypeEnum.OpenText,
  //         headline: { default: "What will this image be used for?",
  //         subheader: { default: "Social media, advertising, illustrating a book...",
  //         required: true,
  //         inputType: "text",
  //       },
  //     ],
  //     prompt: {
  //       enabled: true,
  //       id: "prompt",
  //
  //       message: `
  //       Create an image based on this context:

  //       Character: @character
  //       Artistic Medium: @artistic-medium
  //       Environment: @environment
  //       Lighting: @lighting
  //       Color: @color
  //       Mood: @mood
  //       Composition: @composition
  //       Purpose: @purpose
  //       `,
  //       attributes: {},
  //       isVisible: true,
  //       isStreaming: false,
  //       allowRetry: false,
  //       engine: OpenAIModel.GPT4o,
  //     },
  //     thankYouCard: thankYouCardDefault,
  //     hiddenFields: hiddenFieldsDefault,
  //   },
  // },
  {
    name: "Allan Dib 1-Page Marketing Plan",
    icon: "PlanIcon",
    category: "Marketing",
    subcategory: "",
    description: "Create a marketing plan based on 'The 1-page Marketing Plan' by Allan Dib.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Allan DIB 1-Page Marketing Plan",
      icon: "PlanIcon",
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What products or services do you sell?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target market?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Based on the book "The 1-page Marketing Plan", create a one-page marketing plan tailored to this target market @target-market , taking into account that the company offers these products or services @product .

        The marketing plan should be structured in these sections:
        
        Phase 1: Identify the target market, create a persuasive message for this target market, and specify which media to use to reach them. The goal is for them to become aware of our company and take an interest in it.
        
        My Target Market
        My Message to @target-market] (Act as a copywriter and define 5 key messages)
        The Media I Will Use To Reach My @target-market (specify in detail which social networks to use and how)
        
        Phase 2: This is the marketing and sales phase. The goal is to capture lead details in a database and regularly nurture them with valuable content to seek an initial sale.
        
        My Lead Capture System (suggest tools and how to do it)
        My Lead Nurturing System (suggest specific strategies that have worked with examples from the sector).
        My Sales Conversion Strategy (suggest effective strategies that have worked with examples)
        
        Phase 3: The idea is for them to trust your company, buy regularly, and recommend your service. The goal is to offer top-tier customer service and create business systems to deepen the relationship with customers to, as a result, increase customer lifetime value as a lever for business growth.
        
        How I Deliver a World-Class Experience (be specific and provide options both online and offline)
        How I Increase Customer Lifetime Value (don't just stick to the obvious, also suggest innovative or uncommon strategies)
        How I Orchestrate And Stimulate Referrals (offer concrete ideas and different options for referral plans, including tiered rewards).
        
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "1-Page Marketing Plan",
    icon: "PageIcon",
    category: "Marketing",
    subcategory: "",
    description: "Develop a concise, one-page digital marketing strategy.",
    objectives: ["boost_engagement_and_conversion", "improve_business_strategy"],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Page Marketing Plan",
      icon: "PageIcon",
      questions: [
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What products or services do you sell?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "objectives",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the 3 main objectives of your business?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "target-market",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your target market?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "budget",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What is your marketing budget? " },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Develop a one-page digital marketing plan based on this target market @target-market taking into account that the company offers these products or services @product and the goal is @objectives.

        The marketing plan should be structured in these sections:
        
        - Objectives: Top 3 business objectives
        - Target audience: Top 3 customer segments and 2-3 customer personas per segment
        - Channels: Path to customers
        - Where are we now: Brief SWOT Analysis in the context of top challenges faced in meeting objectives
        - Core brand value: Compelling position statement of your brand and the value it offers
        - Competition: Top 3 competitors (connect to the internet and search for the 3 most important providers in this [target market]).
        - Timeline: Broad outline of 1 week / 1 month / 3 month / 6 month / 1 year marketing campaigns
        - Marketing budget:
          - Content Marketing and SEO
          - Paid Advertising
          - Design
          - Marketing Technology
          - People        
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
  {
    name: "Video Sales Copy",
    icon: "VideoIcon",
    category: "Marketing",
    subcategory: "Copywriting",
    description: "Develop a dynamic marketing video script for your company or products.",
    objectives: ["boost_engagement_and_conversion", "optimize_content_and_seo_strategy"],
    isPremium: true,
    preset: {
      ...workflowDefault,
      name: "Video Sales Copy",
      icon: "VideoIcon",
      questions: [
        {
          id: "company-name",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's the name of your company?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "product",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What product or service do you sell?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "problem",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What problem does it solve?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "benefit",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What are the 3 main benefits of your product or service?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
        {
          id: "website",
          type: TWorkflowQuestionTypeEnum.OpenText,
          headline: { default: "What's your website?" },
          subheader: { default: "" },
          required: true,
          inputType: "text",
        },
      ],
      prompt: {
        enabled: true,
        id: "prompt",

        message: `
        Video Sales Copy Structure:

        - Attention: Start with something that immediately captures the viewer's attention. This could be a provocative question, a surprising statistic, or a bold statement that directly relates to the viewer's problem or need.
        - Problem Identification: After capturing attention, clearly identify the problem or challenge your audience faces. This helps to create an emotional connection, as viewers will realize that you understand their situation.
        - Problem Agitation: Once the problem is identified, delve a bit deeper into its consequences. This increases the urgency and shows viewers why it's crucial to find a solution.
        - Solution: Introduce your product or service as the solution to the problem. Explain how and why your offering can effectively solve the problem. It's important to be clear and convincing in this section.
        - Benefits: Instead of focusing solely on the features of the product or service, highlight the benefits. Explain how the viewer's life will improve after using your product or service.
        - Social Proof: Include testimonials, case studies, or reviews from satisfied customers to show that others have been successful with your product or service. Social proof increases the credibility and trust in your offer.
        - Offer: Detail exactly what viewers will get if they take advantage of your offer. This may include special pricing, bonuses, guarantees, or any other incentive to act now.
        - Call to Action (CTA): End with a clear and strong call to action. Tell viewers exactly what they should do next, whether it's visiting a website, making a purchase, or signing up for more information.
        - Urgency or Scarcity: Sometimes, an element of urgency or scarcity is included to incentivize viewers to act quickly. This could be a time limit on the offer or a limited quantity of products available.
        - Closing: Conclude the video with a quick summary of what the viewer will learn or gain by taking the suggested action. Keep the focus on the benefits and the positive transformation they will experience.
        
        Generate a script for a 1-minute promotional video using the Video Sales Copy structure. The video is for the company @company-name that sells @product through their website @website and solves this problem @problem. The benefits of their solution are @benefit .      
        `,
        attributes: {},
        isVisible: true,
        isStreaming: false,
        allowRetry: false,
        engine: OpenAIModel.GPT4o,
      },
    },
  },
];
