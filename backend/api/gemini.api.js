import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const router = express.Router();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  const parts = response.candidates?.[0]?.content?.parts;
  console.log("Gemini parts:", parts);
  if (Array.isArray(parts)) {
    return (parts.map(p => (typeof p.text === "string" ? p.text : "")).join('') || "No response");
  }
  return "No response";
}

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    const result = await main(prompt);
    res.send({ result: typeof result === "string" ? result.replace(/undefined/g, "") : "No response" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;