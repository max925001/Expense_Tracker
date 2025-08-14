import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTransaction } from '../redux/slices/expenseSlice';
import Footer from '../components/Footer';

const categories = [
  'Food', 'Transportation', 'Bills', 'Shopping', 'Health', 'Entertainment',
  'Salary', 'Business', 'Gifts', 'Investment', 'Other expense', 'Other income'
];

const AddTransaction = () => {
  const [type, setType] = useState('Expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.expense);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!type || !description || !category || !date || !amount) return;
    dispatch(addTransaction({ type, description, category, date, amount }))
      .unwrap()
      .then(() => {
        setType('Expense');
        setDescription('');
        setCategory('');
        setDate('');
        setAmount('');
        navigate('/all-transaction-detail');
      })
      .catch(() => {});
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 ">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-700 text-center flex-1">Add New Transaction</h2>
            <button
              onClick={() => navigate("/all-transaction-detail")}
              className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Back
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
            >
              <option>Expense</option>
              <option>Income</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
              required
              min="0"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddTransaction;