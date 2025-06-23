import { configureStore } from '@reduxjs/toolkit';
import budgetSlice from './budgetSlice';
import expenseSlice from './expenseSlice';
import aiSlice from './aiSlice';

export const store = configureStore({
  reducer: {
    budget: budgetSlice,
    expenses: expenseSlice,
    ai: aiSlice,
  },
});

export default store;