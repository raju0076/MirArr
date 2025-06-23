import express from 'express';
import Budget from '../models/Budget.model.js';

const router = express.Router();

/**
 * @route   POST /api/budget
 * @desc    Create a new budget document
 */
router.post('/', async (req, res) => {
  try {
    const existing = await Budget.findOne();
    if (existing) {
      return res.status(400).json({ message: 'Budget already exists' });
    }

    const { totalBudget, budgetCategories } = req.body;
    const newBudget = new Budget({ totalBudget, budgetCategories });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/budget
 * @desc    Get the existing budget
 */
router.get('/', async (req, res) => {
  try {
    const budget = await Budget.findOne();
    if (!budget) return res.status(404).json({ message: 'No budget found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/budget
 * @desc    Update entire budget document (totalBudget + all categories)
 */
router.put('/', async (req, res) => {
  const { totalBudget, budgetCategories } = req.body;
  try {
    let budget = await Budget.findOne();
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.totalBudget = totalBudget;
    budget.budgetCategories = budgetCategories;
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/budget/category
 * @desc    Update one category's allocated budget
 */
router.put('/category', async (req, res) => {
  const { category, allocated } = req.body;
  try {
    let budget = await Budget.findOne();
    if (!budget) return res.status(404).json({ message: 'No budget found' });

    const current = budget.budgetCategories.get(category) || { spent: 0 };
    budget.budgetCategories.set(category, {
      allocated,
      spent: current.spent,
    });

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export { router as budgetRoutes };
