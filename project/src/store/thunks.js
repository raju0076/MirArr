import { createAsyncThunk } from '@reduxjs/toolkit';
import { expenseAPI, budgetAPI, aiAPI } from '../services/api';
import { setExpenses } from './expenseSlice';
import { setBudgetData } from './budgetSlice';
import { updateInsights } from './aiSlice';

// Load initial data from API
export const loadInitialData = createAsyncThunk(
  'app/loadInitialData',
  async (_, { dispatch }) => {
    try {
      // Load expenses
      const expensesResponse = await expenseAPI.getAll();
      dispatch(setExpenses(expensesResponse.data));

      // Load budget data
      const budgetResponse = await budgetAPI.get();
      dispatch(setBudgetData(budgetResponse.data));

      return { success: true };
    } catch (error) {
      console.error('Failed to load initial data:', error);
      return { success: false, error: error.message };
    }
  }
);

// Generate AI insights
export const generateAIInsights = createAsyncThunk(
  'ai/generateInsights',
  async (_, { getState, dispatch }) => {
    try {
      const { expenses } = getState().expenses;
      const { budgetCategories, totalBudget } = getState().budget;
      
      const response = await aiAPI.generateInsights(expenses, { budgetCategories, totalBudget });
      dispatch(updateInsights(response.data.insights));
      
      return response.data.insights;
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return [];
    }
  }
);