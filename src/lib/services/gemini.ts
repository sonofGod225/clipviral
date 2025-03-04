import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/config/env";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

interface SceneData {
  text: string;
  duration: string;
  description: string;
  imagePrompt: string;
}

interface ScriptResponse {
  script: string;
  scenes: SceneData[];
}

export async function generateVideoScript(prompt: string): Promise<ScriptResponse> {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Nettoyer la réponse des caractères ```
      const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!parsedResponse.script || !Array.isArray(parsedResponse.scenes)) {
        throw new Error("Invalid response structure from Gemini");
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new Error("Failed to parse Gemini response");
    }
  } catch (error) {
    console.error("Error generating script with Gemini:", error);
    throw error;
  }
} 