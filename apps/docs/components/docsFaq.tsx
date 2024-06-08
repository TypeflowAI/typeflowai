import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@typeflowai/ui/Accordion";

import FaqJsonLdComponent from "./faQJsonLD";

const FAQ_DATA = [
  {
    question: "What is an environment ID?",
    answer: () => (
      <>
        The environment ID is a unique identifier associated with each Environment in TypeflowAI,
        distinguishing between different setups like production, development, etc.
      </>
    ),
  },
  {
    question: "How can I implement authentication for the TypeflowAI API?",
    answer: () => (
      <>
        TypeflowAI provides 2 types of API keys for each environment ie development and production. You can
        generate, view, and manage these keys in the Settings section on the Admin dashboard. Include the API
        key in your requests to authenticate and gain access to TypeflowAI functionalities.
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
        <a href="/self-hosting/self-hosting-guide" className="text-brand-dark">
          here
        </a>
        .
      </>
    ),
  },
  {
    question: "How can I change Button texts in my workflow?",
    answer: () => (
      <>
        For the question that you want to change the button text, click on the <b>Show Advanced Settings</b>{" "}
        toggle and change the button label in the <b>Button Text</b> field.
      </>
    ),
  },
];

export const faqJsonLdData = FAQ_DATA.map((faq) => ({
  questionName: faq.question,
  acceptedAnswerText: faq.answer(),
}));

export default function FAQ() {
  return (
    <>
      <FaqJsonLdComponent data={faqJsonLdData} />
      <Accordion type="single" collapsible>
        {FAQ_DATA.map((faq, index) => (
          <AccordionItem key={`item-${index}`} value={`item-${index + 1}`} className="not-prose mb-0 mt-0">
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer()}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
