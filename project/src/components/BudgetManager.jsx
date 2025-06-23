import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, AlertTriangle, CheckCircle,
  Edit, Save, X
} from 'lucide-react';
import { setBudget, setCategoryBudget } from '../store/budgetSlice';

export const BudgetManager = () => {
  const dispatch = useDispatch();
  const { totalBudget, budgetCategories } = useSelector(state => state.budget);
  const { expenses } = useSelector(state => state.expenses);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTotal, setEditingTotal] = useState(false);
  const [tempValues, setTempValues] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch budget from MongoDB on mount
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/budget');
        dispatch(setBudget({
          totalBudget: data.totalBudget,
          budgetCategories: Object.fromEntries(data.budgetCategories),
        }));
      } catch (error) {
        console.error('Error loading budget:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, [dispatch]);

  // ✅ Save total budget to DB
  const handleSaveTotal = async () => {
    const newTotal = parseFloat(tempValues.total);
    if (newTotal >= 0) {
      try {
        const updated = {
          totalBudget: newTotal,
          budgetCategories,
        };
        const { data } = await axios.put('http://localhost:5000/api/budget', updated);
        dispatch(setBudget({
          totalBudget: data.totalBudget,
          budgetCategories: Object.fromEntries(data.budgetCategories),
        }));
      } catch (err) {
        console.error('Error updating total budget:', err.message);
      }
    }
    setEditingTotal(false);
    setTempValues({});
  };

  // ✅ Save category budget to DB
  const handleSaveCategory = async (category) => {
    const newAmount = parseFloat(tempValues[category]);
    if (newAmount >= 0) {
      try {
        const { data } = await axios.put('http://localhost:5000/api/budget/category', {
          category,
          allocated: newAmount,
        });
        dispatch(setBudget({
          totalBudget: data.totalBudget,
          budgetCategories: Object.fromEntries(data.budgetCategories),
        }));
      } catch (err) {
        console.error('Error updating category:', err.message);
      }
    }
    setEditingCategory(null);
    setTempValues({});
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setTempValues({ [category]: budgetCategories[category].allocated });
  };

  const handleEditTotal = () => {
    setEditingTotal(true);
    setTempValues({ total: totalBudget });
  };

  // 💰 Calculate spending
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

  const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
  const totalBudgetUsed = (totalSpent / totalBudget) * 100;

  if (loading) return <p className="text-center text-gray-500">Loading budget...</p>;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Budget Management</h1>
        <p className="text-gray-600">Track and manage your spending limits</p>
      </div>

      {/* Total Budget Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Target className="h-6 w-6 mr-2 text-blue-500" />
            Total Budget
          </h3>
          {!editingTotal && (
            <button onClick={handleEditTotal} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg">
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              {editingTotal ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-500">$</span>
                  <input
                    type="number"
                    value={tempValues.total || ''}
                    onChange={(e) => setTempValues({ ...tempValues, total: e.target.value })}
                    className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none w-32"
                    autoFocus
                  />
                  <button onClick={handleSaveTotal} className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <Save className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingTotal(false)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-800">
                  ${totalBudget.toLocaleString()}
                </span>
              )}
              <p className="text-gray-600">Monthly Budget</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">
                ${totalSpent.toFixed(2)}
              </span>
              <p className="text-gray-600">Spent ({totalBudgetUsed.toFixed(1)}%)</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(totalBudgetUsed)}`}
              style={{ width: `${Math.min(totalBudgetUsed, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Remaining: ${(totalBudget - totalSpent).toFixed(2)}</span>
            <span>{(100 - totalBudgetUsed).toFixed(1)}% left</span>
          </div>
        </div>
      </motion.div>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(budgetCategories).map(([category, data], index) => {
          const spent = categorySpending[category] || 0;
          const percentage = (spent / data.allocated) * 100;
          const StatusIcon = getStatusIcon(percentage);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`h-5 w-5 ${
                    percentage >= 90 ? 'text-red-500' :
                    percentage >= 75 ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <h4 className="font-semibold text-gray-800 capitalize">{category}</h4>
                </div>
                {editingCategory !== category && (
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budget:</span>
                  {editingCategory === category ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        value={tempValues[category] || ''}
                        onChange={(e) => setTempValues({ ...tempValues, [category]: e.target.value })}
                        className="text-lg font-semibold text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none w-20 text-right"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveCategory(category)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Save className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-gray-800">
                      ${data.allocated.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spent:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${spent.toFixed(2)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Remaining: ${Math.max(data.allocated - spent, 0).toFixed(2)}</span>
                  <span>{percentage.toFixed(1)}% used</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
