import React from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const SpendingChart = () => {
  const { expenses } = useSelector(state => state.expenses);

  // Prepare data for charts
  const categoryData = {};
  expenses.forEach(expense => {
    categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
  });

  const barData = Object.entries(categoryData).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount
  }));

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Spending by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar 
              dataKey="amount" 
              fill="url(#gradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Spending Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};