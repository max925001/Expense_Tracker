import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  addTransaction,
  getAllTransactions,
  filterTransactions,
  getTotals,
  deleteTransaction,
  getTransactionById,
  editTransaction,
} from '../controllers/expenseController.js';


const router = express.Router();

router.use(authMiddleware); // Protect all expense routes

router.post('/', addTransaction);
router.get('/', getAllTransactions);
router.get('/filter', filterTransactions);
router.get('/totals', getTotals);
router.get('/:id', getTransactionById);
router.put('/:id', editTransaction);
router.delete('/:id', deleteTransaction);

export default router;