"use client";

import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import { TProductStyling } from "@typeflowai/types/product";
import { TCardArrangementOptions } from "@typeflowai/types/styling";
import { TWorkflow, TWorkflowStyling } from "@typeflowai/types/workflows";

interface StackedCardsContainerProps {
  cardArrangement: TCardArrangementOptions;
  currentQuestionId: string;
  workflow: TWorkflow;
  getCardContent: (questionIdx: number, offset: number) => JSX.Element | undefined;
  styling: TProductStyling | TWorkflowStyling;
  setQuestionId: (questionId: string) => void;
}

export const StackedCardsContainer = ({
  cardArrangement,
  currentQuestionId,
  workflow,
  getCardContent,
  styling,
  setQuestionId,
}: StackedCardsContainerProps) => {
  const [hovered, setHovered] = useState(false);
  const highlightBorderColor =
    workflow.styling?.highlightBorderColor?.light || styling.highlightBorderColor?.light;
  const cardBorderColor = workflow.styling?.cardBorderColor?.light || styling.cardBorderColor?.light;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const [cardHeight, setCardHeight] = useState("auto");

  const cardIndexes = useMemo(() => {
    let cardIndexTemp = workflow.questions.map((_, index) => index);
    if (workflow.welcomeCard.enabled) {
      cardIndexTemp.unshift(-1);
    }
    if (workflow.prompt.enabled) {
      cardIndexTemp.push(workflow.questions.length);
    }
    if (workflow.thankYouCard.enabled) {
      cardIndexTemp.push(workflow.questions.length + 1);
    }
    return cardIndexTemp;
  }, [workflow]);

  const questionIdx = useMemo(() => {
    if (currentQuestionId === "start") return workflow.welcomeCard.enabled ? -1 : 0;
    if (currentQuestionId === "end") return workflow.thankYouCard.enabled ? workflow.questions.length : 0;
    if (currentQuestionId === "prompt") return workflow.questions.length;
    return workflow.questions.findIndex((question) => question.id === currentQuestionId);
  }, [currentQuestionId, workflow.welcomeCard.enabled, workflow.thankYouCard.enabled, workflow.questions]);

  const borderStyles = useMemo(() => {
    const baseStyle = {
      border: "1px solid",
      borderRadius: "var(--fb-border-radius)",
    };
    // Determine borderColor based on the workflow type and availability of highlightBorderColor
    const borderColor =
      workflow.type === "link" || !highlightBorderColor ? cardBorderColor : highlightBorderColor;
    return {
      ...baseStyle,
      borderColor: borderColor,
    };
  }, [workflow.type, cardBorderColor, highlightBorderColor]);

  const calculateCardTransform = useMemo(() => {
    return (offset: number) => {
      switch (cardArrangement) {
        case "casual":
          return offset < 0 ? `translateX(33%)` : `translateX(0) rotate(-${(hovered ? 3.5 : 3) * offset}deg)`;
        case "straight":
          return offset < 0 ? `translateY(25%)` : `translateY(-${(hovered ? 12 : 10) * offset}px)`;
        default:
          return offset < 0 ? `translateX(0)` : `translateX(0)`;
      }
    };
  }, [cardArrangement, hovered]);

  const straightCardArrangementStyles = (offset: number) => {
    if (cardArrangement === "straight") {
      // styles to set the descending width of stacked question cards when card arrangement is set to straight
      return {
        width: `${100 - 5 * offset >= 100 ? 100 : 100 - 5 * offset}%`,
        margin: "auto",
      };
    }
  };

  // UseEffect to handle the resize of current question card and set cardHeight accordingly
  useEffect(() => {
    const currentElement = cardRefs.current[questionIdx];
    if (currentElement) {
      if (resizeObserver.current) resizeObserver.current.disconnect();
      resizeObserver.current = new ResizeObserver((entries) => {
        for (const entry of entries) setCardHeight(entry.contentRect.height + "px");
      });
      resizeObserver.current.observe(currentElement);
    }
    return () => resizeObserver.current?.disconnect();
  }, [questionIdx, cardArrangement]);

  // Reset question progress, when card arrangement changes
  useEffect(() => {
    setQuestionId(workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardArrangement]);

  const getCardHeight = (offset: number): string => {
    // Take default height depending upon card content
    if (offset === 0) return "auto";
    // Preserve original height
    else if (offset < 0) return "initial";
    // Assign the height of the foremost card to all cards behind it
    else return cardHeight;
  };

  const getBottomStyles = () => {
    if (workflow.type !== "link")
      return {
        bottom: 0,
      };
  };

  return (
    <div
      className="relative flex items-end justify-center md:items-center"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}>
      <div style={{ height: cardHeight }}></div>
      {cardArrangement === "simple"
        ? getCardContent(questionIdx, 0)
        : questionIdx !== undefined &&
          cardIndexes.map((_, idx) => {
            const index = workflow.welcomeCard.enabled ? idx - 1 : idx;
            const offset = index - questionIdx;
            const isHidden = offset < 0;
            return (
              <div
                ref={(el) => (cardRefs.current[index] = el)}
                id={`questionCard-${index}`}
                key={index}
                style={{
                  zIndex: 1000 - index,
                  transform: `${calculateCardTransform(offset)}`,
                  opacity: isHidden ? 0 : (100 - 30 * offset) / 100,
                  height: getCardHeight(offset),
                  transitionDuration: "600ms",
                  pointerEvents: offset === 0 ? "auto" : "none",
                  ...borderStyles,
                  ...straightCardArrangementStyles(offset),
                  ...getBottomStyles(),
                }}
                className="pointer rounded-custom bg-workflow-bg absolute inset-x-0 backdrop-blur-md transition-all ease-in-out">
                {getCardContent(index, offset)}
              </div>
            );
          })}
    </div>
  );
};

// offset = 0 -> Current question card
// offset < 0 -> Question cards that are already answered
// offset > 0 -> Question that aren't answered yet
