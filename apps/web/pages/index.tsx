import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Integrations from "@/components/home/Integrations";
import ScrollToTopButton from "@/components/home/ScrollToTop";
import BestTemplates from "@/components/shared/BestTemplates";
import Faq from "@/components/shared/Faq";
import Highlights from "@/components/shared/Highlights";
import Layout from "@/components/shared/Layout";
import PricingTable from "@/components/shared/PricingTable";
import TryItCTA from "@/components/shared/TryItCTA";
import CTA from "@/images/ctas/cta1.svg";

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

const IndexPage = () => (
  <Layout
    title="Next-Gen AI Forms with GPT superpowers | TypeflowAI"
    description="TypeflowAI redefines user engagement with next-gen AI forms. Outshine with dynamic, conversational experiences and smart data collection. Seamless integration meets cutting-edge GPT technology for results that resonate.">
    <Hero />
    <Features />
    <HowItWorks />
    <ScrollToTopButton />
    <BestTemplates />
    <Integrations />
    <PricingTable />
    <Highlights
      title="Start using TypeFlowAI today "
      subtitle="Simplify everything: from business strategy to marketing and sales efforts"
      highlights={highlights}
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

export default IndexPage;
