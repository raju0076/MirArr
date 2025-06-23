import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export const BudgetProgress = () => {
  const { budgetCategories } = useSelector(state => state.budget);
  const { expenses } = useSelector(state => state.expenses);

  // Calculate spent amounts
  const categorySpending = {};
  expenses.forEach(expense => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 90) return AlertTriangle;
    if (percentage >= 75) return TrendingUp;
    return CheckCircle;
  };

  return (
    <div className="space-y-4">
      {Object.entries(budgetCategories).map(([category, data], index) => {
        const spent = categorySpending[category] || 0;
        const percentage = (spent / data.allocated) * 100;
        const StatusIcon = getStatusIcon(percentage);

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`h-4 w-4 ${
                  percentage >= 90 ? 'text-red-500' : 
                  percentage >= 75 ? 'text-yellow-500' : 'text-green-500'
                }`} />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {category}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                ${spent.toFixed(2)} / ${data.allocated.toFixed(2)}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{percentage.toFixed(1)}% used</span>
              <span>${(data.allocated - spent).toFixed(2)} remaining</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};