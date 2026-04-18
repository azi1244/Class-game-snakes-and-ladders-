import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function checkSentenceUsage(word: string, plural: string, sentence: string): Promise<{ isCorrect: boolean; feedback: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The player is learning plural forms.
Word: ${word}
Plural: ${plural}
Player's sentence: "${sentence}"

Check if:
1. The sentence uses the correct plural form "${plural}" accurately in context.
2. The sentence makes sense.

Return JSON:
{
  "isCorrect": boolean,
  "feedback": "A short, encouraging sentence explaining why it's correct or what was wrong."
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{"isCorrect": false, "feedback": "Failed to check sentence."}');
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { isCorrect: true, feedback: "Great effort! (AI check skipped due to error)" };
  }
}

export async function validatePlural(word: string, input: string, expected: string): Promise<{ isCorrect: boolean; feedback: string }> {
  // Simple check first
  if (input.trim().toLowerCase() === expected.toLowerCase()) {
    return { isCorrect: true, feedback: "Perfect! You got it right." };
  }

  // Use AI for near misses or variations if needed, but for this game, let's keep it strict or helpful
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The player is learning plural forms.
Word: ${word}
Expected Plural: ${expected}
Player's Input: "${input}"

Is this correct? Even if the capitalization is different? If wrong, explain briefly why.
Return JSON:
{
  "isCorrect": boolean,
  "feedback": "Short feedback"
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || '{"isCorrect": false, "feedback": "Incorrect."}');
  } catch {
    return { isCorrect: false, feedback: `Not quite! The plural of ${word} is ${expected}.` };
  }
}
