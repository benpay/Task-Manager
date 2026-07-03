/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function generateTaskDescription(title: string): Promise<string> {
  try {
    if (!genAI) {
      console.warn("AI no configurada (Falta API Key).");
      return "No se pudo generar la descripción en este momento.";
    }

    const prompt = `Como experto en productividad y bricolaje, escribe una descripción breve (máximo 2 frases) para una tarea llamada "${title}". La descripción debe ser motivadora y clara. Escribe solo el texto de la descripción.`;

    const result = await genAI.models.generateContent({
      model: config.ai.textModel,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return result.text || "Sin descripción generada.";
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    return "No se pudo generar la descripción en este momento.";
  }
}

export async function getAIImageKeywords(title: string): Promise<string> {
  try {
    if (!genAI) return title;

    const prompt = `Dame exactamente 3 palabras clave en inglés separadas por comas que describan visualmente una imagen profesional para la tarea: "${title}". No añadas nada más.`;

    const result = await genAI.models.generateContent({
      model: config.ai.textModel,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = result.text || title;
    return text.trim();
  } catch (error) {
    console.error("Error generating keywords with Gemini:", error);
    return title; // Fallback to title
  }
}

export async function generateImageBase64(prompt: string): Promise<string | null> {
  try {
    if (!genAI) return null;

    const result = await genAI.models.generateImages({
      model: config.ai.imageModel,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        // Optional: you can set aspect ratio if supported, e.g. aspectRatio: "16:9"
      }
    });
    
    // We get base64 encoded image string
    const base64Image = result.generatedImages?.[0]?.image?.imageBytes;
    if (base64Image) {
      return `data:image/jpeg;base64,${base64Image}`;
    }
  } catch (error) {
    console.error("Error generating image with Imagen:", error);
  }
  return null;
}
