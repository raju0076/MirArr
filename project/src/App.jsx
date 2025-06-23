import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { BudgetManager } from './components/BudgetManager';
import { AIChat } from './components/AIChat';
import { ExpenseList } from './components/ExpenseList';
import { loadInitialData } from './store/thunks';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadInitialData());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<ExpenseList />} />
              <Route path="/add-expense" element={<ExpenseForm />} />
              <Route path="/budget" element={<BudgetManager />} />
              <Route path="/ai-chat" element={<AIChat />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </Router>
  );
}

export default App;