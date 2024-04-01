import { FAQPageJsonLd } from "next-seo";
import React, { useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@typeflowai/ui/Accordion";

const FAQ_DATA = [
  {
    question: "What is TypeflowAI?",
    answer: () => (
      <>
        TypeflowAI is the next generation of form builders, enabling businesses to create dynamic, AI-powered
        forms that integrate the best of form builder features with the power of AI. TypeflowAI forms are
        designed to be more conversational, interactive, and intelligent, providing a more engaging and
        efficient form-filling experience for users.
      </>
    ),
  },
  {
    question: "Is TypeflowAI free?",
    answer: () => (
      <>
        TypeflowAI offers a free tier with basic features, like a simple forms, suitable for individuals or
        small projects. For advanced features, like AI Workflow responses and higher usage limits, our paid
        subscriptions provide additional flexibility and capabilities.
      </>
    ),
  },

  {
    question: "Templates are included?",
    answer: () => (
      <>
        Yes templates are included in all our plans. Take into account that the result will depend on the GPT
        engine used (GTP-4, GPT-3.5,…).
      </>
    ),
  },
  {
    question: "How do I integrate TypeflowAI into my application?",
    answer: () => (
      <>
        Integrating TypeflowAI is easy. Simply copy a script tag to your HTML head, or use NPM to install
        TypeflowAI for platforms like React, Vue, Svelte, etc. Once installed, initialize TypeflowAI with your
        environment details. Learn more with our framework guides{" "}
        <a href="/docs/getting-started/framework-guides" className="text-brand-dark">
          here
        </a>
        .
      </>
    ),
  },
  {
    question: "Is TypeflowAI GDPR compliant?",
    answer: () => (
      <>
        Yes, TypeflowAI is fully GDPR compliant. Whether you use our cloud solution or decide to self-host, we
        ensure compliance with all data privacy regulations.
      </>
    ),
  },
  {
    question: "Can I self-host TypeflowAI?",
    answer: () => (
      <>
        Absolutely! We provide an option for users to host TypeflowAI on their own server, ensuring even more
        control over data and compliance. And the best part? Self-hosting is available for free, always. For
        documentation on self hosting, click{" "}
        <a href="/docs/self-hosting/deployment" className="text-brand-dark">
          here
        </a>
        .
      </>
    ),
  },
  {
    question: "How does TypeflowAI pricing work",
    answer: () => (
      <>
        TypeflowAI offers tiered pricing: Basic at $29/month, Pro at $99/month, and an annual Enterprise plan.
        Each tier provides more AI responses and advanced features, suitable for different business scales.
      </>
    ),
  },
  {
    question: "Is payment secure?",
    answer: () => (
      <>
        Yes, payment security is our priority. We use Stripe, a trusted payment gateway, ensuring your details
        remain secure and private. We do not store any of your credit card information.
      </>
    ),
  },
  {
    question: "Do I need a ChatGPT/OpenAI paid account?",
    answer: () => (
      <>
        A ChatGPT/OpenAI account is not needed for Basic or Pro plans. An OpenAI API account is required only
        for the Enterprise plan and if you opt for unlimited AI responses.
      </>
    ),
  },
  {
    question: "What's the difference between traditional form builders and next-gen AI forms?",
    answer: () => (
      <>
        Next-gen AI forms, like those powered by TypeflowAI, use artificial intelligence to predict and
        auto-complete answers, provide dynamic responses based on user input, and offer a more conversational
        and interactive form-filling experience.
      </>
    ),
  },
  {
    question: "What's the difference between ChatGPT and TypeFlowAI?",
    answer: () => (
      <>
        ChatGPT excels in text generation, while TypeFlowAI focuses on enhancing forms with AI, offering
        advanced interactivity and integration capabilities for businesses.
      </>
    ),
  },
];

const faqJsonLdData = FAQ_DATA.map((faq) => ({
  questionName: faq.question,
  acceptedAnswerText: faq.answer(),
}));

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const handleValueChange = (value: string) => {
    setOpenItem(value === openItem ? undefined : value);
  };
  return (
    <section className="lg:py-15 relative px-4 py-10">
      <div className="mx-auto max-w-7xl pb-4 pt-8" id="faq">
        <div className="max-w-4x mx-auto pb-4 pr-16 text-center md:pb-12">
          <p className="text-md text-brand-dark mx-auto mb-3 max-w-2xl font-semibold uppercase sm:mt-4">
            DO YOU NEED ANY HELP?
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-800 sm:text-4xl md:text-6xl">
            FAQs
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-xl text-slate-600 sm:mt-4">
            Find the answer to a series of questions that might be circulating in your mind.
          </p>
        </div>
        <FAQPageJsonLd mainEntity={faqJsonLdData} />
        <div className="grid grid-cols-1 justify-start gap-10 md:grid-cols-2 ">
          {Array.from({ length: 2 }, (_, columnIndex) => (
            <Accordion
              key={columnIndex}
              type="single"
              value={openItem}
              onValueChange={handleValueChange}
              className="px-4 sm:px-0">
              {FAQ_DATA.slice(
                columnIndex * Math.ceil(FAQ_DATA.length / 2),
                (columnIndex + 1) * Math.ceil(FAQ_DATA.length / 2)
              ).map((faq, index) => {
                const itemValue = `faq-${columnIndex}-${index}`;
                return (
                  <AccordionItem key={itemValue} value={itemValue}>
                    <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-slate-600">{faq.answer()}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
