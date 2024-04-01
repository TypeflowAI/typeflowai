import { TResponseData } from "@typeflowai/types/responses";
import { TWorkflowQuestionType } from "@typeflowai/types/workflows";
import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";

export function getPrefillResponseData(
  currentQuestion: TWorkflowQuestion,
  workflow: TWorkflow,
  firstQuestionPrefill: string
): TResponseData | undefined {
  try {
    if (firstQuestionPrefill) {
      if (!currentQuestion) return;
      const firstQuestionId = workflow?.questions[0].id;
      if (currentQuestion.id !== firstQuestionId) return;
      const question = workflow?.questions.find((q: any) => q.id === firstQuestionId);
      if (!question) throw new Error("Question not found");

      const answer = transformAnswer(question, firstQuestionPrefill || "");
      const answerObj = { [firstQuestionId]: answer };

      if (
        question.type === TWorkflowQuestionType.CTA &&
        question.buttonExternal &&
        question.buttonUrl &&
        answer === "clicked"
      ) {
        window?.open(question.buttonUrl, "blank");
      }

      return answerObj;
    }
  } catch (error) {
    console.log(error);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

export const checkValidity = (question: TWorkflowQuestion, answer: any): boolean => {
  if (question.required && (!answer || answer === "")) return false;
  try {
    switch (question.type) {
      case TWorkflowQuestionType.OpenText: {
        return true;
      }
      case TWorkflowQuestionType.MultipleChoiceSingle: {
        const hasOther = question.choices[question.choices.length - 1].id === "other";
        if (!hasOther) {
          if (!question.choices.find((choice) => choice.label === answer)) return false;
          return true;
        }
        return true;
      }
      case TWorkflowQuestionType.MultipleChoiceMulti: {
        answer = answer.split(",");
        const hasOther = question.choices[question.choices.length - 1].id === "other";
        if (!hasOther) {
          if (!answer.every((ans: string) => question.choices.find((choice) => choice.label === ans)))
            return false;
          return true;
        }
        return true;
      }
      case TWorkflowQuestionType.NPS: {
        answer = answer.replace(/&/g, ";");
        const answerNumber = Number(JSON.parse(answer));

        if (isNaN(answerNumber)) return false;
        if (answerNumber < 0 || answerNumber > 10) return false;
        return true;
      }
      case TWorkflowQuestionType.CTA: {
        if (question.required && answer === "dismissed") return false;
        if (answer !== "clicked" && answer !== "dismissed") return false;
        return true;
      }
      case TWorkflowQuestionType.Consent: {
        if (question.required && answer === "dismissed") return false;
        if (answer !== "accepted" && answer !== "dismissed") return false;
        return true;
      }
      case TWorkflowQuestionType.Rating: {
        answer = answer.replace(/&/g, ";");
        const answerNumber = Number(JSON.parse(answer));
        if (answerNumber < 1 || answerNumber > question.range) return false;
        return true;
      }
      case TWorkflowQuestionType.PictureSelection: {
        answer = answer.split(",");
        if (!answer.every((ans: string) => question.choices.find((choice) => choice.id === ans)))
          return false;
        return true;
      }
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

export const transformAnswer = (question: TWorkflowQuestion, answer: string): string | number | string[] => {
  switch (question.type) {
    case TWorkflowQuestionType.OpenText:
    case TWorkflowQuestionType.MultipleChoiceSingle:
    case TWorkflowQuestionType.Consent:
    case TWorkflowQuestionType.CTA: {
      return answer;
    }

    case TWorkflowQuestionType.Rating:
    case TWorkflowQuestionType.NPS: {
      answer = answer.replace(/&/g, ";");
      return Number(JSON.parse(answer));
    }

    case TWorkflowQuestionType.PictureSelection: {
      return answer.split(",");
    }

    case TWorkflowQuestionType.MultipleChoiceMulti: {
      let ansArr = answer.split(",");
      const hasOthers = question.choices[question.choices.length - 1].id === "other";
      if (!hasOthers) return ansArr;

      // answer can be "a,b,c,d" and options can be a,c,others so we are filtering out the options that are not in the options list and sending these non-existing values as a single string(representing others) like "a", "c", "b,d"
      const options = question.choices.map((o) => o.label);
      const others = ansArr.filter((a: string) => !options.includes(a));
      if (others.length > 0) ansArr = ansArr.filter((a: string) => options.includes(a));
      if (others.length > 0) ansArr.push(others.join(","));
      return ansArr;
    }

    default:
      return "dismissed";
  }
};
