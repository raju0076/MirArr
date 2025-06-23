import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { SpendingChart } from './SpendingChart';
import { BudgetProgress } from './BudgetProgress';
import { AIInsights } from './AIInsights';
import { QuickActions } from './QuickActions';
import { generateAIInsights } from '../store/thunks';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { expenses } = useSelector(state => state.expenses);
  const { budgetCategories, totalBudget } = useSelector(state => state.budget);
  const { insights } = useSelector(state => state.ai);
  
  const [stats, setStats] = useState({
    totalSpent: 0,
    monthlySpent: 0,
    budgetUsed: 0,
    savingsRate: 0
  });

  useEffect(() => {
    // Calculate dashboard stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlySpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetUsed = (monthlySpent / totalBudget) * 100;
    const savingsRate = ((totalBudget - monthlySpent) / totalBudget) * 100;
    
    setStats({ totalSpent, monthlySpent, budgetUsed, savingsRate });
    
    // Generate AI insights
    dispatch(generateAIInsights());
  }, [expenses, totalBudget, dispatch]);

  const statCards = [
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      title: 'This Month',
      value: `$${stats.monthlySpent.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'Budget Used',
      value: `${stats.budgetUsed.toFixed(1)}%`,
      icon: Target,
      color: stats.budgetUsed > 80 ? 'from-red-500 to-red-600' : 'from-purple-500 to-purple-600',
      trend: stats.budgetUsed > 80 ? 'up' : 'down'
    },
    {
      title: 'Savings Rate',
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: stats.savingsRate > 20 ? CheckCircle : AlertTriangle,
      color: stats.savingsRate > 20 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600',
      trend: stats.savingsRate > 20 ? 'up' : 'down'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Financial Dashboard
        </h1>
        <p className="text-gray-600">AI-powered insights for smarter spending</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <TrendIcon className={`h-4 w-4 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Spending Overview
            </h3>
            <SpendingChart />
          </motion.div>
        </div>

        {/* Budget Progress */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Budget Progress
            </h3>
            <BudgetProgress />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-green-500" />
              AI Insights
            </h3>
            <AIInsights insights={insights} />
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <QuickActions />
      </motion.div>
    </div>
  );
};