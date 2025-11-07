import { GoogleGenAI } from "@google/genai";
import type { Content } from "@google/genai";
import { Message } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY is missing in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This function continues a chat session with the Gemini API
export const continueChat = async (history: Message[], newMessage: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';

    const conversationHistory: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // The Gemini API requires an alternating user/model conversation.
    // If the first message is from the model, we need to strip it from the history.
    let finalHistory: Content[] = conversationHistory;
    if (finalHistory.length > 0 && finalHistory[0].role === 'model') {
        finalHistory = finalHistory.slice(1);
    }
    
    // We construct the final list of contents to send to the API
    const contents: Content[] = [
        ...finalHistory,
        { role: 'user', parts: [{ text: newMessage }] }
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });
    
    const responseText = response.text;
    
    if (!responseText) {
        throw new Error("Received an empty response from the API.");
    }
    
    return responseText;
  } catch (error) {
    console.error("Error in API call:", error);
    if (error instanceof Error) {
        // Re-throw the error so the UI layer can catch it and display a message
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
};
