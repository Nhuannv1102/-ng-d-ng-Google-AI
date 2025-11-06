
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { PosterData } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GeneratedContent {
  title: string;
  details: string;
  contact: string;
}

export async function generateContentFromTopic(topic: string): Promise<GeneratedContent> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert copywriter for marketing posters. Based on the topic "${topic}", generate a concise and catchy main title, a detailed description (including potential event time, location, or key selling points), and contact information. Return the response as a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The main, catchy title for the poster.",
            },
            details: {
              type: Type.STRING,
              description: "Detailed information for the poster, use newline characters (\\n) for line breaks.",
            },
            contact: {
              type: Type.STRING,
              description: "Contact information like phone, social media, or a call to action. Use newline characters (\\n) for line breaks.",
            },
          },
          required: ["title", "details", "contact"],
        },
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    return parsed as GeneratedContent;

  } catch (error) {
    console.error("Error generating content from topic:", error);
    throw new Error("Failed to generate content from AI.");
  }
}


export async function generatePosterImage(data: PosterData): Promise<string> {
    try {
        const textPrompt = `
        Create a professional and visually appealing poster based on the following elements. The style should be modern, elegant, and impactful.
        **Crucially, all text on the poster must use the 'Be Vietnam Pro' font.** This is essential for proper Vietnamese language display and design consistency.

        - **Main Title:** "${data.title}" (Render this in a large, bold weight of 'Be Vietnam Pro'. It should be the main focal point).
        - **Detailed Content:** "${data.details}" (Use a standard, readable size and weight of 'Be Vietnam Pro'. Place this information clearly).
        - **Contact/Brand Information:** "${data.contact}" (Use a smaller size of 'Be Vietnam Pro'. Place this near the bottom).
        - **Main Visual:** If a main image is provided, use it as the central visual element. Integrate it beautifully into the design. If not, create a compelling abstract or thematic background that fits the topic.
        - **QR Code:** If a QR code image is provided, include it in a suitable location, like a bottom corner.
        - **Color Palette:** Use a professional color scheme. Dark backgrounds (like dark gray, deep blue) with contrasting text (white, light gray, gold) are good options.
        - **Overall Layout:** The poster must be clean, well-balanced, and not cluttered. Ensure all text is legible. The final output should look like a high-end advertisement.
        `;

        const parts: any[] = [{ text: textPrompt }];
        
        if (data.mainImage) {
            parts.push({
                inlineData: {
                    data: data.mainImage.base64,
                    mimeType: data.mainImage.mimeType,
                }
            });
        }
        
        if (data.qrCode) {
            parts.push({
                inlineData: {
                    data: data.qrCode.base64,
                    mimeType: data.qrCode.mimeType,
                }
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            const base64ImageBytes: string = firstPart.inlineData.data;
            const mimeType = firstPart.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image data returned from API.");
        }

    } catch (error) {
        console.error("Error generating poster image:", error);
        throw new Error("Failed to generate poster image from AI.");
    }
}