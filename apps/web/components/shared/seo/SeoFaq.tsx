import Script from "next/script";
import React, { useState } from "react";
import { FAQPage, WithContext } from "schema-dts";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@typeflowai/ui/Accordion";

interface Answer {
  "@type": "Answer";
  text: string;
}

interface Question {
  "@type": "Question";
  name: string;
  acceptedAnswer: Answer;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQ[];
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}

const SeoFaq: React.FC<FAQSchemaProps> = ({ faqs, headline, description, datePublished, dateModified }) => {
  const FAQMainEntity: Question[] = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  const FAQjsonld: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `Frequently Asked Questions around ${headline}`,
    mainEntity: FAQMainEntity,
    headline,
    description,
    author: {
      "@type": "Person",
      name: "Yaye Caceres",
      url: "https://typeflowai.com",
    },
    image: "",
    datePublished,
    dateModified,
  };

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const handleValueChange = (value: string) => {
    setOpenItem(value === openItem ? undefined : value);
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(FAQjsonld),
        }}
      />
      <div className="grid grid-cols-1 justify-start gap-10 md:grid-cols-2 ">
        {Array.from({ length: 2 }, (_, columnIndex) => (
          <Accordion
            key={columnIndex}
            type="single"
            value={openItem}
            onValueChange={handleValueChange}
            className="px-4 sm:px-0">
            {faqs
              .slice(columnIndex * Math.ceil(faqs.length / 2), (columnIndex + 1) * Math.ceil(faqs.length / 2))
              .map((faq, index) => {
                const itemValue = `faq-${columnIndex}-${index}`;
                return (
                  <AccordionItem key={itemValue} value={itemValue}>
                    <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-slate-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default SeoFaq;
