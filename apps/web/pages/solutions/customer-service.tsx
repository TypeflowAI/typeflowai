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
  CreditCardIcon,
  FileCheckIcon,
  FileTextIcon,
  IterationCcwIcon,
  LaptopIcon,
  MessageSquareTextIcon,
  PocketKnifeIcon,
  UserPlusIcon,
  VideoIcon,
} from "lucide-react";

const emailSupportFeatures = [
  {
    id: "onboarding-emails-writer",
    name: "Onboarding Emails Writer",
    description: "Optimize user onboarding by generating engaging and informative emails.",
    icon: UserPlusIcon,
  },
  {
    id: "return-requests",
    name: "Return Requests",
    description: "Manage return requests efficiently, offering accurate responses and guidance.",
    icon: IterationCcwIcon,
  },
  {
    id: "order-confirmations",
    name: "Order confirmations",
    description: "Generate personalized order confirmations swiftly and efficiently.",
    icon: FileCheckIcon,
  },
];
const chatSupportFeatures = [
  {
    id: "chatbot-billing-support",
    name: "Chatbot Billing Support",
    description: "Manage billing inquiries enhancing customer satisfaction and reducing staff workload.",
    icon: CreditCardIcon,
  },
  {
    id: "technical-support-chatbot",
    name: "Technical Support Chatbot",
    description:
      "Generate technical responses efficiently, enhancing customer service and reducing response times.",
    icon: PocketKnifeIcon,
  },
  {
    id: "faq-chatbot",
    name: "FAQ Chatbot",
    description: "Design a chatbot for FAQ support, enhancing customer assistance and engagement.",
    icon: MessageSquareTextIcon,
  },
];

const productInformationFeatures = [
  {
    id: "product-usage-instructions",
    name: "Product Usage Instructions",
    description: "Create your detailed product usage instructions easily.",
    icon: FileTextIcon,
  },
  {
    id: "product-faqs-generator",
    name: "Product Faqs Generator",
    description: "Generate user-centric product FAQs to answer customer's queries.",
    icon: LaptopIcon,
  },
  {
    id: "product-tutorial-videos",
    name: "Product Tutorial Videos",
    description: "Generate structured product tutorial videos with clear instructions.",
    icon: VideoIcon,
  },
];

const highlights = [
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

const CustomerServicePage = () => (
  <Layout
    title="AI forms for Customer Service | TypeflowAI"
    description="Simplify customer service by generating automated responses tailored to each specific question they ask.  Get the best templates and prompts for your customer service team."
    inverted>
    <Hero
      title="AI forms for"
      highlight="Customer Service"
      subtitle="Simplify customer service by generating automated responses tailored to each specific question they ask."
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Email support"
      subtitle="Provide accurate support in every customer interaction, from onboarding queries to end-product feedback."
      features={emailSupportFeatures}
      cta="See use cases"
      isMark
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Chat support"
      subtitle="Turn chat from headache to automated response machine, providing support or even driving more sales."
      features={chatSupportFeatures}
      cta="See use cases"
    />
    <ThreeColumnFeatures
      title="AI forms for"
      highlight="Product information"
      subtitle="Quickly generate product documentation to prevent unnecessary emails and phone calls for assistance."
      features={productInformationFeatures}
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

export default CustomerServicePage;
