import kanaShifts from "../data/kanaShifts.json" with { type: "json" };
import { wordData } from "./data/dict/index.js";

export function evaluateAnswer(validAnswers, userInput) {
  if (!userInput || typeof userInput !== "string") return false;
  
  const normalizedInput = userInput.trim();
  return validAnswers.some((ans) => {
    const cleanAnswer = ans.replace(/<[^>]*>/g, "").trim();
    return cleanAnswer === normalizedInput;
  });
}

export function shiftKana(stem, targetRow) {
  const lastChar = stem.slice(-1);
  const shifted = kanaShifts[targetRow]?.[lastChar] || lastChar;
  return stem.slice(0, -1) + shifted;
}

