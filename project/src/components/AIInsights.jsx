import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const AIInsights = ({ insights }) => {
  const getInsightIcon = (insight) => {
    if (insight.includes('⚠️') || insight.includes('warning')) return AlertTriangle;
    if (insight.includes('✅') || insight.includes('well')) return CheckCircle;
    return TrendingUp;
  };

  const getInsightColor = (insight) => {
    if (insight.includes('⚠️') || insight.includes('warning')) return 'text-orange-600 bg-orange-50';
    if (insight.includes('✅') || insight.includes('well')) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => {
        const Icon = getInsightIcon(insight);
        const colorClass = getInsightColor(insight);
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg ${colorClass} border border-opacity-20`}
          >
            <div className="flex items-start space-x-2">
              <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{insight}</p>
            </div>
          </motion.div>
        );
      })}
      
      {insights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Add some expenses to get AI-powered insights!</p>
        </div>
      )}
    </div>
  );
};