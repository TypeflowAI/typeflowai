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
import { SiLinkedin } from "@icons-pack/react-simple-icons";
import {
  CalculatorIcon,
  FileBarChartIcon,
  FlagIcon,
  Grid2X2Icon,
  LightbulbIcon,
  TagIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

const brandingFeatures = [
  {
    id: "brand-identity-developer",
    name: "Brand Identity Developer",
    description: "Develop a brand identity aligned with your values and target audience.",
    icon: SiLinkedin,
  },
  {
    id: "naming-tool",
    name: "Naming Tool",
    description: "Create creative and unique brand names for products or companies",
    icon: TagIcon,
  },
  {
    id: "elevator-pitch",
    name: "Elevator Pitch",
    description: "Create an elevator pitch that highlights your business' key features.",
    icon: UsersIcon,
  },
];
const strategyFeatures = [
  {
    id: "business-model-ideas-generator",
    name: "Business Model Ideas Generator",
    description: "Generate low-investment, digital business ideas with a business model canvas.",
    icon: LightbulbIcon,
  },
  {
    id: "unique-sales-proposal-generator",
    name: "Unique Sales Proposal Generator ",
    description: "Generate a unique value proposition for businesses based on expert methods.",
    icon: FileBarChartIcon,
  },
  {
    id: "swot-analysis",
    name: "SWOT Analysis",
    description: "Conduct a SWOT analysis of a business based on its products, services and market. ",
    icon: Grid2X2Icon,
  },
];

const goalsFeatures = [
  {
    id: "set-goals-and-objectives",
    name: "Set Goals and Objectives",
    description: "Create a set of Objectives and Key Results (OKRs) effortlessly.",
    icon: FlagIcon,
  },
  {
    id: "business-intelligence-assessments",
    name: "Business intelligence Assessments",
    description: "Identify KPIs to determine business objectives.",
    icon: TrendingUpIcon,
  },
  {
    id: "roi-calculator",
    name: "ROI Calculator",
    description: "Calculate ROI, estimate revenue and forecast expenses.",
    icon: CalculatorIcon,
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
    name: "Embed anywhere ",
    description: "Embed your forms in websites, send them using a link or use internally only",
  },
  {
    name: "Privacy protected",
    description: "We don't collect data. Your questions, answers and prompts remains always private.",
  },
  {
    name: "User friendly & No code",
    description: "Building AI tools, workflows and automations have never been this easy!",
  },
];

const BusinessPage = () => (
  <Layout
    title="AI forms for Business | TypeflowAI"
    description="Get business ideas, investigate multiple markets, conduct competitor analysis and create buyer personas in seconds. Get the best templates and prompts for your business."
    inverted>
    <Hero
      title="AI forms for"
      highlight="Business"
      subtitle="Get business ideas, investigate multiple markets, conduct competitor analysis and create buyer personas in seconds."
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Business branding"
      subtitle="Make your brand stand out and set itself apart from competitors by having and unique voice and value prop."
      features={brandingFeatures}
      cta="See use cases"
      isMark
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Business strategy"
      subtitle="Deliver a strategy and process everything: from customer onboarding to streamlining the hiring process."
      features={strategyFeatures}
      cta="See use cases"
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Goal setting"
      subtitle="Facilitate OKRs compliance by setting goals and objectives based on your business vision."
      features={goalsFeatures}
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

export default BusinessPage;
