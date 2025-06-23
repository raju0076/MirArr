import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Save,
  Mic,
  MicOff,
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle,
  UploadCloud, // New icon for upload
  Loader2 // New icon for loading state
} from 'lucide-react';
import { addExpense } from '../store/expenseSlice';
import { aiAPI } from '../services/api'; // Ensure this service can handle file uploads

export const ExpenseForm = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.expenses);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false); // New state for receipt upload loading
  const [receiptUploadError, setReceiptUploadError] = useState(''); // New state for receipt upload errors
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null); // Ref for the hidden file input

  // AI categorization when description changes (existing logic)
  useEffect(() => {
    if (formData.description.length > 3 && !formData.category) {
      setIsAnalyzing(true);
      const timer = setTimeout(async () => {
        try {
          const response = await aiAPI.categorizeExpense(formData.description);
          setAiSuggestion(response.data);
        } catch (error) {
          console.error('AI categorization failed:', error);
          // Optionally, set an error message for AI categorization
        } finally {
          setIsAnalyzing(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formData.description, formData.category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const acceptAISuggestion = () => {
    if (aiSuggestion) {
      setFormData(prev => ({ ...prev, category: aiSuggestion.category }));
      setAiSuggestion(null);
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      try {
        const response = await aiAPI.processVoiceInput(transcript);
        const { amount, description, category } = response.data;

        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            amount: amount.toString(),
            description,
            category
          }));
        }
      } catch (error) {
        console.error('Voice processing failed:', error);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- New Receipt Upload Functionality ---

  const handleReceiptUploadClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setReceiptUploadError(''); // Clear previous errors
    setIsUploadingReceipt(true);

    const formData = new FormData();
    formData.append('receipt', file); // 'receipt' should match the field name your backend expects

    try {
      // Assuming aiAPI has a new method like 'uploadReceiptAndExtract'
      const response = await aiAPI.uploadReceiptAndExtract(formData);
      const { amount, description, category, date } = response.data;

      setFormData(prev => ({
        ...prev,
        amount: amount ? amount.toString() : '', // Ensure amount is string for input
        description: description || '',
        category: category || '',
        date: date || new Date().toISOString().split('T')[0] // Use extracted date or current date
      }));
      setAiSuggestion(null); // Clear any existing AI suggestions after receipt upload
    } catch (error) {
      console.error('Receipt upload and extraction failed:', error);
      setReceiptUploadError('Failed to process receipt. Please try again.');
      // You might want to display a more specific error based on the API response
    } finally {
      setIsUploadingReceipt(false);
      e.target.value = null; // Clear the file input so the same file can be selected again
    }
  };

  // --- End New Receipt Upload Functionality ---

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const expense = {
      ...formData,
      amount: parseFloat(formData.amount),
      // Consider if you want to track if data came from AI (voice/receipt)
      // aiGenerated: !!aiSuggestion || (isVoiceInputTriggered || isReceiptUploadTriggered)
      // For simplicity, let's just use aiSuggestion for now as per original code
      aiGenerated: !!aiSuggestion
    };

    dispatch(addExpense(expense));

    // Reset form
    setFormData({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setAiSuggestion(null);
    setErrors({}); // Clear errors on successful submission

    // Show success message
    alert('Expense added successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
          <div className="flex space-x-2">
            {/* Voice Input Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceInput}
              disabled={isListening || isUploadingReceipt} // Disable if listening or uploading
              className={`p-3 rounded-lg transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </motion.button>

            {/* Receipt Upload Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReceiptUploadClick}
              disabled={isUploadingReceipt || isListening} // Disable if uploading or listening
              className={`p-3 rounded-lg transition-all duration-200 ${
                isUploadingReceipt
                  ? 'bg-purple-500 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600'
              }`}
            >
              {isUploadingReceipt ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            </motion.button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf" // Accept image files and PDFs
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {receiptUploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center text-red-700"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{receiptUploadError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="What did you spend on?"
              />
              {isAnalyzing && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && !formData.category && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-blue-700">
                    AI suggests: <strong>{aiSuggestion.category}</strong>
                    <span className="text-xs ml-2">
                      ({Math.round(aiSuggestion.confidence * 100)}% confidence)
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={acceptAISuggestion}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Accept
                </button>
              </div>
            </motion.div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
            disabled={isUploadingReceipt || isListening} // Disable submit while busy
          >
            <Save className="h-5 w-5 mr-2" />
            Add Expense
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};