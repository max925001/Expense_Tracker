import mongoose from 'mongoose';
import Expense from '../models/expenseModel.js';

// Add new transaction (income or expense)
export const addTransaction = async (req, res) => {
  try {
    const { type, description, category, date, amount } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!type || !['Income', 'Expense'].includes(type)) {
      return res.status(400).json({ success:false,message: 'Type is required and must be "Income" or "Expense"' });
    }
    if (!description) {
      return res.status(400).json({ success:false,message: 'Description is required' });
    }
    if (!category) {
      return res.status(400).json({ success:false,message: 'Category is required' });
    }
    if (!date) {
      return res.status(400).json({ success:false,message: 'Date is required' });
    }
    if (amount === undefined || amount < 0) {
      return res.status(400).json({ success:false,message: 'Amount is required and must be at least 0' });
    }

    const expense = new Expense({ userId, type, description, category, date, amount });
    await expense.save();
    res.status(201).json({ success:true,message: 'Transaction added successfully', expense });
  } catch (error) {
    console.error('Add transaction error:', error.message);
    return res.status(500).json({ success:false,message: 'Server error while adding transaction' });
  }
};

// Get all transactions for the user
export const getAllTransactions = async (req, res) => {
  try {
    
    const userId = req.user.id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    // console.log(expenses)
    return res.status(200).json({success:true,message: 'Transactions fetched successfully', expenses });
  } catch (error) {
    console.error('Get all transactions error:', error.message);
    return res.status(500).json({ success:false, message: 'Server error while fetching transactions' });
  }
};

// Filter transactions by category, amount, and date range
export const filterTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, minAmount, maxAmount, startDate, endDate } = req.query;

    const filter = { userId };
    if (category) filter.category = category;
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    return res.status(200).json({ success:true,message: 'Filtered transactions fetched successfully', expenses });
  } catch (error) {
    console.error('Filter transactions error:', error.message);
    return res.status(500).json({success:false, message: 'Server error while filtering transactions' });
  }
};

// Get totals: total expenses, total income, remaining balance
export const getTotals = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);
   

    let totalIncome = 0;
    let totalExpenses = 0;
    expenses.forEach((item) => {
      if (item._id === 'Income') totalIncome = item.total;
      if (item._id === 'Expense') totalExpenses = item.total;
    });

    const remaining = totalIncome - totalExpenses;

    // Disable caching
    res.set('Cache-Control', 'no-store');
    return res.json({ success: true, totalIncome, totalExpenses, remaining });
  } catch (error) {
    console.error('Get totals error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error while calculating totals' });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    console.log('Deleting transaction with ID:', req.params.id);
    const userId = req.user.id;
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId });
    if (!expense) {
      return res.status(404).json({ success:false,message: 'Transaction not found or not authorized' });
    }
    return res.json({ success:true,message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error.message);
    return res.status(500).json({success:false, message: 'Server error while deleting transaction' });
  }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  try {
   console.log("hello")
    const userId = req.user.id;
    const expense = await Expense.findOne({ _id: req.params.id, userId });
    if (!expense) {
      return res.status(404).json({ success:false,message: 'Transaction not found or not authorized' });
    }
    return res.json({ success:true,message: 'Transaction fetched successfully', expense });
  } catch (error) {
    console.error('Get transaction by ID error:', error.message);
    return res.status(500).json({ success:false,message: 'Server error while fetching transaction' });
  }
};

// Edit transaction
export const editTransaction = async (req, res) => {
  console.log("hello",req.body)
  try {
    console.log('Editing transaction with ID:', req.params.id);
    const userId = req.user.id;
    const { id } = req.params;
    const { type, description, category, date, amount } = req.body;

    const expense = await Expense.findOne({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({ success:false,message: 'Transaction not found or not authorized' });
    }

    if (type) expense.type = type;
    if (description) expense.description = description;
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (amount !== undefined) expense.amount = amount;

    await expense.save();
    return res.json({ success:true,message: 'Transaction updated successfully', expense });
  } catch (error) {
    console.error('Edit transaction error:', error.message);
    return res.status(500).json({ success:false,message: 'Server error while editing transaction' });
  }
};