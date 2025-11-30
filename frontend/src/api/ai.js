import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as appConfig } from "../constants/config";

/**
 * Generate content using Groq API with streaming support
 * @param {string} prompt - The user's input prompt
 * @param {AbortSignal} signal - Abort signal for cancelling the request
 * @param {Function} onChunk - Callback function called with each chunk of text
 * @returns {Promise<string>} - The full generated text
 */
export const generateContentGroq = async (prompt, signal, onChunk) => {
  if (!prompt || prompt.trim().length === 0) {
    return "";
  }

  const apiKey = import.meta.env.VITE_GROQ_AI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GROQ_AI_API_KEY is not set");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: "Please complete the following message along with the user's input naturally as if it were sent by the user. Ensure the response feels like a continuation of the user's input and match the language used. Only provide the completed message without any additional text. Here's the message: " + prompt
        }
      ],
      model: "openai/gpt-oss-20b",
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: true,
      reasoning_effort: "medium",
      stop: null
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || "";
          if (content) {
            fullText += content;
            if (onChunk) {
              onChunk(fullText);
            }
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }

  return fullText;
};

/**
 * Generate content using Google Gemini API
 * @param {string} prompt - The user's input prompt
 * @returns {Promise<string>} - The generated text
 */
export const generateContentGemini = async (prompt) => {
  if (!prompt || prompt.trim().length === 0) {
    return "";
  }

  if (!appConfig.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(appConfig.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const result = await model.generateContent(
    "Please complete the following message along with the user's input naturally as if it were sent by the user. Ensure the response feels like a continuation of the user's input and match the language used. Only provide the completed message without any additional text. Here's the message: " +
      prompt
  );
  
  return result.response.text();
};

/**
 * Generate content using the available AI service (Groq preferred, falls back to Gemini)
 * @param {string} prompt - The user's input prompt
 * @param {AbortSignal} signal - Abort signal for cancelling the request (only for Groq)
 * @param {Function} onChunk - Callback function called with each chunk of text (only for Groq)
 * @returns {Promise<string>} - The generated text
 */
export const generateContent = async (prompt, signal = null, onChunk = null) => {
  const groqKey = import.meta.env.VITE_GROQ_AI_API_KEY;
  if (groqKey) {
    return generateContentGroq(prompt, signal, onChunk);
  } else {
    return generateContentGemini(prompt);
  }
};

