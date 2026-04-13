import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import { findMatchingPrompt, getPromptTitles } from "../config/prompts.js";
dotenv.config();

const router = express.Router();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    console.log("Full Gemini response:", JSON.stringify(response, null, 2));
    
    const candidate = response.candidates?.[0];
    if (!candidate) {
      console.log("No candidates in response");
      return "No response available";
    }
    
    const content = candidate.content;
    if (!content) {
      console.log("No content in candidate");
      return "No response available";
    }
    
    const parts = content.parts;
    console.log("Gemini parts:", parts);
    
    if (!Array.isArray(parts) || parts.length === 0) {
      console.log("No parts in content");
      return "No response available";
    }
    
    // Extract all text from parts
    const textParts = parts
      .filter(part => part && typeof part.text === 'string')
      .map(part => part.text);
    
    console.log("Text parts:", textParts);
    
    const fullText = textParts.join('');
    console.log("Final full text:", fullText);
    
    return fullText || "No response available";
  } catch (error) {
    console.error("Error in main function:", error);
    return "Error generating response";
  }
}

router.post("/", verifyToken, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    // Check if there's a matching predefined prompt
    const matchingPrompt = findMatchingPrompt(prompt);
    
    let result;
    if (matchingPrompt && matchingPrompt.useCustomResponse) {
      // Use custom response
      result = matchingPrompt.customResponse;
      console.log("Using custom response for:", prompt);
    } else {
      // Use AI response
      result = await main(prompt);
    }
    
    // Clean and validate the result
    if (typeof result !== 'string') {
      result = "No response available";
    }
    
    // Remove any undefined values and clean the text
    result = result
      .replace(/undefined/g, '')
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    console.log("Final result being sent:", result);
    
    res.json({ result });
  } catch (err) {
    console.error("Error in POST /:", err);
    res.status(500).json({ error: err.message });
  }
});

// New endpoint to get available prompt titles
router.get("/prompts", verifyToken, async (req, res) => {
  try {
    const promptTitles = getPromptTitles();
    res.json({ prompts: promptTitles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;