import ScrollToTopButton from "@/components/home/ScrollToTop";
import Faq from "@/components/shared/Faq";
import Highlights from "@/components/shared/Highlights";
import Layout from "@/components/shared/Layout";
import PricingTable from "@/components/shared/PricingTable";
import TryItCTA from "@/components/shared/TryItCTA";
import DynamicAILeadMagnet from "@/components/solutions/DynamicAILeadMagnet";
import Hero from "@/components/solutions/Hero";
import ThreeColumnFeatures from "@/components/solutions/ThreeColumnFeatures";
import CTA from "@/images/ctas/cta2.svg";
import {
  DollarSignIcon,
  LineChartIcon,
  MailIcon,
  MailsIcon,
  RefreshCcwIcon,
  StarIcon,
  TextIcon,
  UserCircleIcon,
  WorkflowIcon,
} from "lucide-react";

const leadGenerationFeatures = [
  {
    id: "dynamic-lead-magnet",
    name: "Dynamic Lead Magnet",
    description: "Create dynamic lead magnets for your business to capture leads",
    icon: UserCircleIcon,
  },
  {
    id: "lead-scoring-criteria",
    name: "Lead Scoring Criteria",
    description: "Symplify lead scoring criteria development.",
    icon: StarIcon,
  },
  {
    id: "lead-nurturing-workflows",
    name: "Lead Nurturing Workflows",
    description: "Personalize lead nurturing workflows to engage and convert.",
    icon: WorkflowIcon,
  },
];
const salesEmailsFeatures = [
  {
    id: "cold-email-generator",
    name: "Cold Email Generator",
    description: "Create custom cold emails in seconds to boost sales opportunities.",
    icon: MailIcon,
  },
  {
    id: "email-subject-generator",
    name: "Email Subject Generator",
    description: "Generate email subjects to achieve a goal, focusing on a company's benefits and solutions.",
    icon: TextIcon,
  },
  {
    id: "drip-email-campaign",
    name: "Drip Email Campaign",
    description: "Streamline drip email campaign creation with AI's personalized content generation.",
    icon: MailsIcon,
  },
];

const closeDealsFeatures = [
  {
    id: "custom-price-quotes",
    name: "Custom Price Quotes",
    description: "Create a budget with services, prices, and a timeline for a client project.",
    icon: DollarSignIcon,
  },
  {
    id: "sales-presentation-creator",
    name: "Sales Presentation Creator",
    description: "Create sales presentations featuring new ideas and outlining content.",
    icon: LineChartIcon,
  },
  {
    id: "email-follow-up-sequences",
    name: "Email Follow-up Sequences",
    description: "Create contextually tailored email follow-up sequences. ",
    icon: RefreshCcwIcon,
  },
];

const highlights = [
  {
    name: "GPT 4.0 response level*",
    description: "In-depth insights and a comprehensive understanding of your questions' context.",
  },
  {
    name: "Eye-Opening AI Tools ",
    description: "Deliver astonishing content: from dynamic lead magnets to AI quizzes or calculators.",
  },
  {
    name: "+350 templates",
    description: "Start from scratch or use any one of the pre-built templates and advanced prompts.",
  },
  {
    name: "Merge Tags",
    description: "Introduce variables by using @ and generate premium prompts",
  },
  {
    name: "Professional formatting",
    description: "Get your response using code markup, tables, bullet points and much more",
  },
  {
    name: "Unique voice",
    description: "Act as a qualified professional in any field adding your unique brand voice",
  },
];

const SalesgPage = () => (
  <Layout
    title="AI forms for Sales | TypeflowAI"
    description="Smooth out the sales process by providing smart responses to the lead at each touch point. Get the best templates and prompts for your sales team."
    inverted>
    <Hero
      title="AI forms for"
      highlight="Sales"
      subtitle="Smooth out the sales process by providing smart responses to the lead at each touch point."
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Lead Generation"
      subtitle="Generate freebies marketing ideas, create engaging lead magnets or conduct surveys to capture emails."
      features={leadGenerationFeatures}
      cta="See use cases"
      isMark
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Crafting sales emails"
      subtitle="Warm up the conversation: match specific leads needs from the first cold email."
      features={salesEmailsFeatures}
      cta="See use cases"
    />
    <ThreeColumnFeatures
      title="AI forms to"
      highlight="Close deals"
      subtitle="Qualify before a phone call, create the best sales scripts by knowing the precise objections in advance..."
      features={closeDealsFeatures}
      cta="See use cases"
    />
    <ScrollToTopButton />
    <DynamicAILeadMagnet />
    <PricingTable />
    <Highlights
      title="Start using TypeFlowAI today "
      subtitle="Simplify everything: from business strategy to marketing and sales efforts"
      highlights={highlights}
      inverted
    />
    <TryItCTA
      teaser="Try it now"
      headline="Create your first AI form"
      subheadline="Try a new way of making forms that use all the latest features AI has to offer"
      cta="Build AI form"
      href="https://dashboard.typeflowai.com/auth/signup"
      image={CTA}
    />
    <Faq />
  </Layout>
);

export default SalesgPage;
