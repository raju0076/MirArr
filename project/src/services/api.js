import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// AI Services
export const aiAPI = {
  categorizeExpense: (description) => 
    api.post('/ai/categorize', { description }),
  
  generateInsights: (expenses, budget) => 
    api.post('/ai/insights', { expenses, budget }),
  
  chatWithAI: (message, context) => 
    api.post('/ai/chat', { message, context }),
  
  processVoiceInput: (transcript) => 
    api.post('/ai/voice', { transcript }),
  
  searchExpenses: (query, expenses) => 
    api.post('/ai/search', { query, expenses }),
  
  predictExpenses: (expenses, timeframe) => 
    api.post('/ai/predict', { expenses, timeframe }),
};

// Expense Services
export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  create: (expense) => api.post('/expenses', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Budget Services
export const budgetAPI = {
  get: () => api.get('/budget'),
  update: (budget) => api.put('/budget', budget),
  updateCategory: (category, allocated) => 
    api.put('/budget/category', { category, allocated }),
};

export default api;