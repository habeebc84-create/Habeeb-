
import { GoogleGenAI } from "@google/genai";
import { LocationState, DealResult, GroundingChunk } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const searchDeals = async (
  query: string, 
  location: LocationState | null
): Promise<DealResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-2.5-flash";
  
  // Construct a prompt that encourages the model to find places and invent/find plausible deals
  const prompt = `
    User Query: "${query}"
    
    Task: Find relevant local businesses or places matching the query. 
    For each place found via Google Maps, suggest a plausible deal, discount, or booking availability that they might offer (e.g., "Happy Hour 5-7PM", "20% off first booking", "Last minute slot available").
    
    Provide a helpful summary of the options.
  `;

  const tools: any[] = [{ googleMaps: {} }];
  let toolConfig: any = undefined;

  if (location) {
    toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng,
        },
      },
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools,
        toolConfig,
        // vital: do not set responseMimeType to JSON when using googleMaps tool
      },
    });

    const text = response.text || "No details found.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const places = (groundingMetadata?.groundingChunks || []) as unknown as GroundingChunk[];

    return {
      text,
      places,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
