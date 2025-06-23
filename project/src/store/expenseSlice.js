// store/expenseSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadExpensesFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('expenses');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading expenses from localStorage:', error);
    return [];
  }
};

const saveExpensesToLocalStorage = (expenses) => {
  try {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses to localStorage:', error);
  }
};

const initialState = {
  expenses: loadExpensesFromLocalStorage(),
  categories: ['food', 'transportation', 'entertainment', 'shopping', 'utilities', 'healthcare', 'other'],
  searchQuery: '',
  filteredExpenses: [],
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      saveExpensesToLocalStorage(state.expenses);
    },
    addExpense: (state, action) => {
      const newExpense = {
        ...action.payload,
        id: Date.now(),
        date: action.payload.date || new Date().toISOString().split('T')[0],
      };
      state.expenses.unshift(newExpense);
      saveExpensesToLocalStorage(state.expenses);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = { ...state.expenses[index], ...action.payload };
        saveExpensesToLocalStorage(state.expenses);
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
      saveExpensesToLocalStorage(state.expenses);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (action.payload.trim() === '') {
        state.filteredExpenses = [];
      } else {
        state.filteredExpenses = state.expenses.filter(expense =>
          expense.description.toLowerCase().includes(action.payload.toLowerCase()) ||
          expense.category.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    addCategory: (state, action) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setSearchQuery,
  addCategory,
  setLoading,
  setError,
} = expenseSlice.actions;

export default expenseSlice.reducer;
