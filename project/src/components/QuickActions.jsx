import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Bot, 
  Settings, 
  TrendingUp,
  PieChart,
  Search
} from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Add Expense',
      description: 'Record a new expense with AI categorization',
      icon: Plus,
      link: '/add-expense',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'AI Assistant',
      description: 'Chat with AI for financial advice',
      icon: Bot,
      link: '/ai-chat',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Budget Setup',
      description: 'Manage your spending limits',
      icon: Settings,
      link: '/budget',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'View Expenses',
      description: 'Browse and search your expense history',
      icon: Search,
      link: '/expenses',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Link key={action.title} to={action.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${action.color} ${action.hoverColor} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon className="h-8 w-8" />
                  <h4 className="font-semibold">{action.title}</h4>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};