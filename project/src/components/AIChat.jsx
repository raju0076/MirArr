import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Mic,
  MicOff,
  Brain,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { aiAPI } from '../services/api';

export const AIChat = () => {
  const { expenses } = useSelector(state => state.expenses);
  const { budgetCategories, totalBudget } = useSelector(state => state.budget);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: "Hi! I'm your AI financial assistant. I can help you understand your spending patterns, suggest ways to save money, and answer questions about your budget. What would you like to know?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const context = {
        expenses,
        budget: { budgetCategories, totalBudget }
      };
      
      const response = await aiAPI.chatWithAI(inputMessage, context);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const quickQuestions = [
    "What's my highest spending category?",
    "How can I reduce my expenses?",
    "Do I have budget left for shopping?",
    "Show me my spending trends",
    "How am I doing with my budget?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-t-xl px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI Financial Assistant</h2>
            <p className="text-sm text-gray-600">Ask me anything about your finances</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white/60 backdrop-blur-sm px-6 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickQuestion(question)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full transition-colors"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-sm p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500 ml-2' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 mr-2'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Brain className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white shadow-md text-gray-800'
                }`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-8 w-8 rounded-full flex items-center justify-center mr-2">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white shadow-md rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm rounded-b-xl px-6 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about your finances..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`p-3 rounded-lg transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600'
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};