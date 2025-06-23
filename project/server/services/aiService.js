export class AIService {
  static async categorizeExpense(description) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const keywords = {
      food: ['lunch', 'dinner', 'restaurant', 'coffee', 'grocery', 'pizza', 'burger', 'meal', 'breakfast', 'snack', 'food', 'cafe', 'mcdonalds', 'starbucks', 'whole foods'],
      transportation: ['gas', 'fuel', 'uber', 'taxi', 'bus', 'train', 'parking', 'metro', 'flight', 'car', 'bike', 'ride', 'transport'],
      entertainment: ['movie', 'cinema', 'game', 'concert', 'theater', 'streaming', 'netflix', 'spotify', 'youtube', 'entertainment', 'show'],
      shopping: ['store', 'mall', 'amazon', 'clothes', 'shoes', 'book', 'shopping', 'target', 'walmart', 'clothing', 'electronics'],
      utilities: ['electricity', 'water', 'internet', 'phone', 'utility', 'bill', 'wifi', 'cellular', 'power', 'heating'],
      healthcare: ['doctor', 'medicine', 'pharmacy', 'hospital', 'clinic', 'medical', 'health', 'prescription', 'dentist'],
    };
    
    const lowerDesc = description.toLowerCase();
    let bestMatch = { category: 'other', confidence: 0.3 };
    
    for (const [category, words] of Object.entries(keywords)) {
      const matches = words.filter(word => lowerDesc.includes(word));
      if (matches.length > 0) {
        const confidence = Math.min(0.95, 0.7 + (matches.length * 0.1));
        if (confidence > bestMatch.confidence) {
          bestMatch = { category, confidence };
        }
      }
    }
    
    return bestMatch;
  }
  
  static async generateInsights(expenses, budgetData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const insights = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter current month expenses
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categorySpending = {};
    
    monthlyExpenses.forEach(exp => {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });
    
    if (Object.keys(categorySpending).length > 0) {
      // Top spending category
      const topCategory = Object.entries(categorySpending).reduce((a, b) => 
        categorySpending[a[0]] > categorySpending[b[0]] ? a : b
      );
      
      const percentage = ((topCategory[1] / totalSpent) * 100).toFixed(0);
      insights.push(`Your highest spending category this month is ${topCategory[0]} at $${topCategory[1].toFixed(2)} (${percentage}% of total spending).`);
      
      // Budget comparison
      if (budgetData?.budgetCategories?.[topCategory[0]]) {
        const budget = budgetData.budgetCategories[topCategory[0]].allocated;
        const budgetPercentage = ((topCategory[1] / budget) * 100).toFixed(0);
        if (budgetPercentage > 75) {
          insights.push(`⚠️ You've used ${budgetPercentage}% of your ${topCategory[0]} budget. Consider monitoring your spending in this category.`);
        } else {
          insights.push(`✅ You're doing well with your ${topCategory[0]} budget, using only ${budgetPercentage}% so far.`);
        }
      }
      
      // Spending trends
      const categories = Object.keys(categorySpending).sort((a, b) => categorySpending[b] - categorySpending[a]);
      if (categories.length > 1) {
        insights.push(`Your top 3 spending categories are: ${categories.slice(0, 3).join(', ')}.`);
      }
      
      // Daily average
      const daysInMonth = new Date().getDate();
      const dailyAverage = (totalSpent / daysInMonth).toFixed(2);
      insights.push(`Your daily average spending this month is $${dailyAverage}.`);
    } else {
      insights.push("No expenses recorded for this month yet. Start tracking your spending to get personalized insights!");
    }
    
    return insights;
  }
  
  static async chatWithAI(message, context) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const lowerMessage = message.toLowerCase();
    const { expenses = [], budget = {} } = context || {};
    
    // Calculate some basic stats
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categorySpending = {};
    expenses.forEach(exp => {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });
    
    // Response patterns
    if (lowerMessage.includes('highest') || lowerMessage.includes('most')) {
      const topCategory = Object.entries(categorySpending).reduce((a, b) => 
        categorySpending[a[0]] > categorySpending[b[0]] ? a : b, ['other', 0]
      );
      return `Your highest spending category is ${topCategory[0]} with $${topCategory[1].toFixed(2)} spent.`;
    }
    
    if (lowerMessage.includes('reduce') || lowerMessage.includes('save')) {
      const tips = [
        "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
        "Consider meal planning to reduce food expenses.",
        "Look for subscription services you're not using regularly.",
        "Set up automatic transfers to your savings account.",
        "Use the 24-hour rule before making non-essential purchases."
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (lowerMessage.includes('budget left') || lowerMessage.includes('remaining')) {
      const totalBudget = budget.totalBudget || 0;
      const remaining = totalBudget - totalSpent;
      return `You have $${remaining.toFixed(2)} remaining in your total budget this month.`;
    }
    
    if (lowerMessage.includes('food') && lowerMessage.includes('budget')) {
      const foodSpent = categorySpending.food || 0;
      const foodBudget = budget.budgetCategories?.food?.allocated || 0;
      const remaining = foodBudget - foodSpent;
      return `You have $${remaining.toFixed(2)} remaining in your food budget.`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your AI financial assistant. I can help you understand your spending patterns, suggest ways to save money, and answer questions about your budget. What would you like to know?";
    }
    
    if (lowerMessage.includes('total') || lowerMessage.includes('spent')) {
      return `You've spent $${totalSpent.toFixed(2)} in total across all categories.`;
    }
    
    // Default responses
    const defaultResponses = [
      "I'm here to help you manage your finances better. You can ask me about your spending patterns, budget remaining, or tips to save money.",
      "Let me analyze your spending data to provide better insights. Try asking about your highest spending category or remaining budget.",
      "I can help you understand where your money goes and suggest ways to optimize your spending. What specific area would you like to focus on?",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  static async processVoiceInput(transcript) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const amountMatch = transcript.match(/(\d+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    
    // Clean up description
    let description = transcript
      .replace(/i spent|i paid|i bought|spent|paid|dollars?|bucks?|\$/gi, '')
      .replace(/\d+(?:\.\d{2})?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // If description is too short, use a default
    if (description.length < 3) {
      description = 'Voice expense';
    }
    
    // Try to categorize
    const { category } = await this.categorizeExpense(description);
    
    return {
      amount,
      description,
      category,
      success: amount > 0 && description.length > 0
    };
  }
  
  static async searchExpenses(query, expenses) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const lowerQuery = query.toLowerCase();
    let filteredExpenses = [...expenses];
    
    // Date filtering
    if (lowerQuery.includes('last week')) {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= lastWeek);
    } else if (lowerQuery.includes('last month')) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= lastMonth);
    } else if (lowerQuery.includes('today')) {
      const today = new Date().toISOString().split('T')[0];
      filteredExpenses = filteredExpenses.filter(exp => exp.date === today);
    }
    
    // Amount filtering
    const amountMatch = lowerQuery.match(/above|over\s+\$?(\d+)/);
    if (amountMatch) {
      const threshold = parseFloat(amountMatch[1]);
      filteredExpenses = filteredExpenses.filter(exp => exp.amount > threshold);
    }
    
    const belowMatch = lowerQuery.match(/below|under\s+\$?(\d+)/);
    if (belowMatch) {
      const threshold = parseFloat(belowMatch[1]);
      filteredExpenses = filteredExpenses.filter(exp => exp.amount < threshold);
    }
    
    // Category filtering
    const categories = ['food', 'transportation', 'entertainment', 'shopping', 'utilities', 'healthcare'];
    const mentionedCategory = categories.find(cat => lowerQuery.includes(cat));
    if (mentionedCategory) {
      filteredExpenses = filteredExpenses.filter(exp => exp.category === mentionedCategory);
    }
    
    // Text search in description
    const searchTerms = lowerQuery.split(' ').filter(term => 
      !['show', 'me', 'all', 'expenses', 'last', 'week', 'month', 'above', 'below', 'over', 'under'].includes(term)
    );
    
    if (searchTerms.length > 0) {
      filteredExpenses = filteredExpenses.filter(exp =>
        searchTerms.some(term => 
          exp.description.toLowerCase().includes(term) ||
          exp.category.toLowerCase().includes(term)
        )
      );
    }
    
    return filteredExpenses;
  }
  
  static async predictExpenses(expenses, timeframe = 'month') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (expenses.length === 0) {
      return { total: 0, byCategory: {}, confidence: 0 };
    }
    
    // Calculate monthly averages
    const monthlyData = {};
    expenses.forEach(exp => {
      const monthKey = exp.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, categories: {} };
      }
      monthlyData[monthKey].total += exp.amount;
      monthlyData[monthKey].categories[exp.category] = 
        (monthlyData[monthKey].categories[exp.category] || 0) + exp.amount;
    });
    
    const months = Object.keys(monthlyData);
    if (months.length === 0) return { total: 0, byCategory: {}, confidence: 0 };
    
    // Calculate averages
    const avgTotal = months.reduce((sum, month) => sum + monthlyData[month].total, 0) / months.length;
    
    const categoryAverages = {};
    const allCategories = [...new Set(expenses.map(exp => exp.category))];
    
    allCategories.forEach(category => {
      const categoryTotals = months.map(month => monthlyData[month].categories[category] || 0);
      categoryAverages[category] = categoryTotals.reduce((sum, val) => sum + val, 0) / months.length;
    });
    
    // Add some randomness to make it more realistic
    const variance = 0.1; // 10% variance
    const multiplier = 1 + (Math.random() - 0.5) * variance;
    
    return {
      total: avgTotal * multiplier,
      byCategory: Object.fromEntries(
        Object.entries(categoryAverages).map(([cat, avg]) => [cat, avg * multiplier])
      ),
      confidence: Math.min(0.9, months.length / 3) // Higher confidence with more data
    };
  }
}