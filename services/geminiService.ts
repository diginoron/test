import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY is missing in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates and returns a new chat session with the Gemini model.
 */
export function createChat(): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
  });
}
