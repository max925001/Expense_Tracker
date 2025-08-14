import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Food', 'Transportation', 'Bills', 'Shopping', 'Health', 'Entertainment',
      'Salary', 'Business', 'Gifts', 'Investment', 'Other expense', 'Other income'
    ],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;