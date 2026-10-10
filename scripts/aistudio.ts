"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export default async function getGenerativeAIResponse(prompt: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Sign in to generate content.");
  const input = z.string().trim().min(1).max(10000).parse(prompt);
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey || !model || !/^[\w.-]+$/.test(model)) throw new Error("AI generation is not configured. Set GEMINI_API_KEY and GEMINI_MODEL on the server.");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ parts: [{ text: input }] }], generationConfig: { maxOutputTokens: 2048, temperature: 0.7 } }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("The AI provider could not complete the request. Try again later.");
  const data = await response.json();
  const result = data.candidates?.[0]?.content?.parts?.map((part: {text?: string}) => part.text || "").join("").trim();
  if (!result) throw new Error("The AI provider returned no text.");
  return result;
}
