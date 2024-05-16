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
import { SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import {
  FileLineChartIcon,
  FileTextIcon,
  LaptopIcon,
  MousePointerIcon,
  SearchIcon,
  ShareIcon,
  UserCircleIcon,
} from "lucide-react";

const socialMediaFeatures = [
  {
    id: "social-media-strategy",
    name: "Social Media Strategy",
    description: "Develop a well-rounded and usable social media strategy.",
    icon: ShareIcon,
  },
  {
    id: "twitter",
    name: "Twitter",
    description: "Create engaging Twitter content to boost visibility and interaction.",
    icon: SiX,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Develop a content strategic plan like a chess grandmaster.",
    icon: SiInstagram,
  },
];
const copywrittingFeatures = [
  {
    id: "blog-post-ideas",
    name: "Blog Post Ideas",
    description: "Write engaging and SEO-friendly blog posts in no time.",
    icon: FileTextIcon,
  },
  {
    id: "lead-magnets",
    name: "Lead Magnets",
    description: "Design lead magnets that convert and captivate your potential customers.",
    icon: UserCircleIcon,
  },
  {
    id: "website-landing-pages",
    name: "Website / Landing Pag.",
    description: "Construct Landing Page Structures to captivate visitors.",
    icon: LaptopIcon,
  },
];

const seoSemFeatures = [
  {
    id: "keyword-ideas",
    name: "Keyword Ideas",
    description: "Leverage AI to discover and analyze top-performing keywords for SEO.",
    icon: SearchIcon,
  },
  {
    id: "outreach-strategy",
    name: "Outreach Strategy",
    description: "Write cold emails that get responses and start meaningful business conversations.",
    icon: FileLineChartIcon,
  },
  {
    id: "google-ads-copy",
    name: "Google Ads Copy",
    description: "Create effective ad copy that resonates with your Google Ads audience.",
    icon: MousePointerIcon,
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

const MaketingPage = () => (
  <Layout
    title="AI forms for Marketing | TypeflowAI"
    description="Experience human-like strategy and content creation except it's 20X more productive and
    relevant. Get the best templates and prompts for your marketing team."
    inverted>
    <Hero
      title="AI forms for"
      highlight="Marketing"
      subtitle="Experience human-like strategy and content creation except it's 20X more productive and
  relevant."
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Social Media"
      subtitle="Craft a targeted strategy, develop tailored content for your audience, and organize it all in a content calendar."
      features={socialMediaFeatures}
      cta="See use cases"
      isMark
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Copywritting"
      subtitle="Generate customized content for your buyer persona by simply answering a few questions."
      features={copywrittingFeatures}
      cta="See use cases"
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="SEO / SEM"
      subtitle="Enhance your SEO with fresh keyword ideas and build highly targeted SEM campaigns for optimal impact."
      features={seoSemFeatures}
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

export default MaketingPage;
