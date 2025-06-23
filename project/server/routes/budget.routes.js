import express from 'express';
import Budget from '../models/Budget.model.js';

const router = express.Router();

// ✅ GET /api/budget/:userId - Fetch budget for specific user
router.get('/:userId', async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId });
    if (!budget) return res.status(404).json({ message: 'No budget found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/budget - Create new budget for a user
router.post('/', async (req, res) => {
  const { userId, totalBudget, budgetCategories } = req.body;
  try {
    const exists = await Budget.findOne({ userId });
    if (exists) return res.status(400).json({ message: 'Budget already exists for this user' });
    const budget = new Budget({ userId, totalBudget, budgetCategories });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT /api/budget/:userId - Update totalBudget and all categories for a user
router.put('/:userId', async (req, res) => {
  const { totalBudget, budgetCategories } = req.body;
  try {
    let budget = await Budget.findOne({ userId: req.params.userId });
    if (!budget) return res.status(404).json({ message: 'No budget found' });
    budget.totalBudget = totalBudget;
    budget.budgetCategories = budgetCategories;
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT /api/budget/category/:userId - Update one category's budget/expense
router.put('/category/:userId', async (req, res) => {
  const { category, allocated, spent } = req.body;
  try {
    let budget = await Budget.findOne({ userId: req.params.userId });
    if (!budget) return res.status(404).json({ message: 'No budget found' });

    const current = budget.budgetCategories.get(category) || { spent: 0 };
    budget.budgetCategories.set(category, {
      allocated: allocated !== undefined ? allocated : current.allocated,
      spent: spent !== undefined ? spent : current.spent,
    });

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE /api/budget/category/:userId/:category - Delete a specific category
router.delete('/category/:userId/:category', async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.params.userId });
    if (!budget) return res.status(404).json({ message: 'No budget found' });

    budget.budgetCategories.delete(req.params.category);
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE /api/budget/:userId - Delete the entire budget document
router.delete('/:userId', async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({ userId: req.params.userId });
    if (!deleted) return res.status(404).json({ message: 'No budget to delete' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { router as budgetRoutes };