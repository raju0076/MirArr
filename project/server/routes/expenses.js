import express from 'express';

const router = express.Router();

// In-memory storage (in production, use a database)
let expenses = [
  {
    id: 1,
    amount: 45.50,
    description: 'Lunch at Italian restaurant',
    category: 'food',
    date: '2024-01-15',
    aiGenerated: true,
  },
  {
    id: 2,
    amount: 120.00,
    description: 'Grocery shopping at Whole Foods',
    category: 'food',
    date: '2024-01-14',
    aiGenerated: false,
  },
  {
    id: 3,
    amount: 25.00,
    description: 'Gas station fill-up',
    category: 'transportation',
    date: '2024-01-14',
    aiGenerated: true,
  },
];

// Get all expenses
router.get('/', (req, res) => {
  res.json(expenses);
});

// Add new expense
router.post('/', (req, res) => {
  const newExpense = {
    ...req.body,
    id: Date.now(),
    date: req.body.date || new Date().toISOString().split('T')[0],
  };
  expenses.unshift(newExpense);
  res.json(newExpense);
});

// Update expense
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = expenses.findIndex(exp => exp.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...req.body };
    res.json(expenses[index]);
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
});

// Delete expense
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  expenses = expenses.filter(exp => exp.id !== id);
  res.json({ success: true });
});

export { router as expenseRoutes };