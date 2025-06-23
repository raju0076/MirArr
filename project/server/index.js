import express from 'express';
import cors from 'cors';
import { aiRoutes } from './routes/ai.js';
import { expenseRoutes } from './routes/expenses.js';
import { budgetRoutes } from './routes/budget.js';
import connectDB from './configs/mongo.config.js';
import dotenv from "dotenv";
import userRouter from './routes/user.routes.js';
dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
connectDB()
// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/budget', budgetRoutes);
app.use("/api/users",userRouter)
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});