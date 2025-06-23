import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  allocated: { type: Number, required: true },
  spent: { type: Number, default: 0 },
});

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalBudget: { type: Number, required: true },
  budgetCategories: {
    type: Map,
    of: categorySchema,
    default: {},
  },
}, {
  timestamps: true,
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;