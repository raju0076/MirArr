import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mic,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { deleteExpense, setSearchQuery } from '../store/expenseSlice';
import { aiAPI } from '../services/api';

export const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, searchQuery, filteredExpenses } = useSelector(state => state.expenses);
  
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);

  const displayExpenses = searchQuery ? filteredExpenses : expenses;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  const handleVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsVoiceSearching(true);

    recognition.onresult = async (event) => {
      const query = event.results[0][0].transcript;
      
      try {
        const response = await aiAPI.searchExpenses(query, expenses);
        dispatch(setSearchQuery(query));
        // Update filtered expenses in the component or store
      } catch (error) {
        console.error('Voice search failed:', error);
      }
    };

    recognition.onerror = () => setIsVoiceSearching(false);
    recognition.onend = () => setIsVoiceSearching(false);
    recognition.start();
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-green-100 text-green-800',
      transportation: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-purple-100 text-purple-800',
      shopping: 'bg-pink-100 text-pink-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      healthcare: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const sortedExpenses = [...displayExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Expense History</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search expenses or try voice search..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
            />
            <button
              onClick={handleVoiceSearch}
              disabled={isVoiceSearching}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                isVoiceSearching 
                  ? 'text-red-500 animate-pulse' 
                  : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Expense Cards */}
      <div className="grid gap-4">
        <AnimatePresence>
          {sortedExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-gray-800">
                        ${expense.amount.toFixed(2)}
                      </span>
                      {expense.aiGenerated && (
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium">{expense.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedExpenses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <DollarSign className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {searchQuery ? 'No expenses found' : 'No expenses yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search terms or use voice search' 
              : 'Start by adding your first expense'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};