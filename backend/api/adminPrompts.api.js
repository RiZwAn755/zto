import express from "express";
import { verifyToken } from "../middlewares/jwt.middleware.js";
import { predefinedPrompts, findMatchingPrompt, getPromptTitles } from "../config/prompts.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to save prompts to file
const savePromptsToFile = (prompts) => {
  const promptsPath = path.join(__dirname, '../config/prompts.js');
  const promptsContent = `// Predefined prompts and custom responses
export const predefinedPrompts = ${JSON.stringify(prompts, null, 2)};

// Function to check if a user question matches any predefined prompt
export function findMatchingPrompt(userQuestion) {
  const normalizedUserQuestion = userQuestion.toLowerCase().trim();
  
  for (const prompt of predefinedPrompts) {
    const normalizedPrompt = prompt.prompt.toLowerCase().trim();
    
    // Check for exact match or if user question contains the prompt keywords
    if (normalizedUserQuestion === normalizedPrompt || 
        normalizedUserQuestion.includes(normalizedPrompt) ||
        normalizedPrompt.includes(normalizedUserQuestion)) {
      return prompt;
    }
  }
  
  return null;
}

// Function to get all available prompt titles for the frontend
export function getPromptTitles() {
  return predefinedPrompts.map(prompt => ({
    id: prompt.id,
    title: prompt.title,
    prompt: prompt.prompt
  }));
}
`;
  
  fs.writeFileSync(promptsPath, promptsContent, 'utf8');
};

// Get all prompts (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    // Check if user is admin (you can add admin role check here)
    res.json({ prompts: predefinedPrompts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new prompt (admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, prompt, customResponse, useCustomResponse } = req.body;
    
    if (!title || !prompt) {
      return res.status(400).json({ error: "Title and prompt are required" });
    }
    
    const newPrompt = {
      id: Date.now(), // Simple ID generation
      title,
      prompt,
      customResponse: customResponse || null,
      useCustomResponse: useCustomResponse !== undefined ? useCustomResponse : true
    };
    
    // Add to prompts array
    predefinedPrompts.push(newPrompt);
    
    // Save to file
    savePromptsToFile(predefinedPrompts);
    
    res.json({ message: "Prompt added successfully", prompt: newPrompt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update prompt (admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, prompt, customResponse, useCustomResponse } = req.body;
    
    const promptIndex = predefinedPrompts.findIndex(p => p.id == id);
    if (promptIndex === -1) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    
    predefinedPrompts[promptIndex] = {
      ...predefinedPrompts[promptIndex],
      title: title || predefinedPrompts[promptIndex].title,
      prompt: prompt || predefinedPrompts[promptIndex].prompt,
      customResponse: customResponse !== undefined ? customResponse : predefinedPrompts[promptIndex].customResponse,
      useCustomResponse: useCustomResponse !== undefined ? useCustomResponse : predefinedPrompts[promptIndex].useCustomResponse
    };
    
    // Save to file
    savePromptsToFile(predefinedPrompts);
    
    res.json({ message: "Prompt updated successfully", prompt: predefinedPrompts[promptIndex] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete prompt (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const promptIndex = predefinedPrompts.findIndex(p => p.id == id);
    if (promptIndex === -1) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    
    const deletedPrompt = predefinedPrompts.splice(promptIndex, 1)[0];
    
    // Save to file
    savePromptsToFile(predefinedPrompts);
    
    res.json({ message: "Prompt deleted successfully", prompt: deletedPrompt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 