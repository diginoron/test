import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please ensure the API_KEY environment variable is set.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

/**
 * Creates and returns a new chat session with the Gemini model.
 * @throws {Error} if the API key is not configured.
 */
export function createChat(): Chat {
  const genAI = getAiInstance();
  return genAI.chats.create({
    model: 'gemini-2.5-flash',
  });
}