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
  FlagIcon,
  MessageSquareMoreIcon,
  MessagesSquareIcon,
  MousePointerClickIcon,
  RefreshCcwIcon,
  RocketIcon,
  TextIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";

const recruitingFeatures = [
  {
    id: "hr-selection-criteria",
    name: "HR Selection Criteria",
    description: "Identify key features and suggest evaluation criteria.",
    icon: MousePointerClickIcon,
  },
  {
    id: "hr-automation",
    name: "HR Automation",
    description: "Enhance HR automation: job description, onboard and programs.",
    icon: RefreshCcwIcon,
  },
  {
    id: "job-description-copy",
    name: "Job Description Copy",
    description: "Transform job descriptions into narratives for recruiting.",
    icon: TextIcon,
  },
];
const trainingAndDevelopmentFeatures = [
  {
    id: "employee-trainer",
    name: "Employee Trainer",
    description: "Develop effective employee training based on your industry trends and methodologies.",
    icon: TrendingUpIcon,
  },
  {
    id: "employee-career-booster",
    name: "Employee Career Booster",
    description: "Elevate your workplace boosting career prospects.",
    icon: RocketIcon,
  },
  {
    id: "employee-goal-setting",
    name: "Employee Goal-Setting",
    description: "Optimize employee goal-setting to enhance performance and motivation.",
    icon: FlagIcon,
  },
];

const employeeRelationsFeatures = [
  {
    id: "employee-feedback-responder",
    name: "Employee Feedback Responder",
    description: "Manage employee feedback to turn issues into improvements.",
    icon: MessageSquareMoreIcon,
  },
  {
    id: "employee-engagement-surveys",
    name: "Employee Engagement Surveys",
    description: "Enhance employee engagement by creating structured survey questions.",
    icon: MessagesSquareIcon,
  },
  {
    id: "employee-benefits",
    name: "Employee Benefits",
    description: "Optimize employee benefits by offering tailored packages and personalized advice.",
    icon: TrophyIcon,
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

const HrPage = () => (
  <Layout
    title="AI forms for Human Resources | TypeflowAI"
    description="Simplify HR processes, efficiently analyze candidate data, make informed hiring decisions, and enhance workforce effectiveness.  Get the best templates and prompts for your hr team."
    inverted>
    <Hero
      title="AI forms for"
      highlight="Human Resources"
      subtitle="Simplify HR processes, efficiently analyze candidate data, make informed hiring decisions, and enhance workforce effectiveness."
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Recruiting"
      subtitle="Make your recruiting smooth by automatically generating job descriptions, onboarding plans or interview scripts..."
      features={recruitingFeatures}
      cta="See use cases"
      isMark
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Training and delevopment"
      subtitle="Make your employee productive and engaged from day 1 by designing 1-click trainings and development plans."
      features={trainingAndDevelopmentFeatures}
      cta="See use cases"
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Employee relations"
      subtitle="Automate employee touchpoints from hire, providing essential documentation for effective job performance."
      features={employeeRelationsFeatures}
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

export default HrPage;
