import express from 'express';
import { AIService } from '../services/aiService.js';

const router = express.Router();

// Categorize expense description
router.post('/categorize', async (req, res) => {
  try {
    const { description } = req.body;
    const result = await AIService.categorizeExpense(description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to categorize expense' });
  }
});

// Generate spending insights
router.post('/insights', async (req, res) => {
  try {
    const { expenses, budget } = req.body;
    const insights = await AIService.generateInsights(expenses, budget);
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await AIService.chatWithAI(message, context);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Process voice input
router.post('/voice', async (req, res) => {
  try {
    const { transcript } = req.body;
    const result = await AIService.processVoiceInput(transcript);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process voice input' });
  }
});

// Search expenses with natural language
router.post('/search', async (req, res) => {
  try {
    const { query, expenses } = req.body;
    const results = await AIService.searchExpenses(query, expenses);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search expenses' });
  }
});

// Predict future expenses
router.post('/predict', async (req, res) => {
  try {
    const { expenses, timeframe } = req.body;
    const predictions = await AIService.predictExpenses(expenses, timeframe);
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to predict expenses' });
  }
});

export { router as aiRoutes };