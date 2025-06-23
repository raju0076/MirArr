import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  insights: [
    "You've spent 55% of your budget on food this month. Consider meal planning to reduce costs.",
    "Transportation costs are 20% below budget - great job using public transport!",
    "Entertainment spending has increased by 30% compared to last month.",
  ],
  chatMessages: [
    { id: 1, type: 'ai', message: 'Hi! I\'m your AI financial assistant. How can I help you manage your budget today?', timestamp: new Date().toISOString() }
  ],
  isTyping: false,
  suggestedCategories: {},
  voiceRecording: false,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addChatMessage: (state, action) => {
      state.chatMessages.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    setSuggestedCategory: (state, action) => {
      const { description, category } = action.payload;
      state.suggestedCategories[description] = category;
    },
    setVoiceRecording: (state, action) => {
      state.voiceRecording = action.payload;
    },
    updateInsights: (state, action) => {
      state.insights = action.payload;
    },
  },
});

export const { addChatMessage, setTyping, setSuggestedCategory, setVoiceRecording, updateInsights } = aiSlice.actions;
export default aiSlice.reducer;