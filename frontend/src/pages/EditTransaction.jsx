import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { editTransaction, getTransactionById } from '../redux/slices/expenseSlice';
import Footer from '../components/Footer';

const categories = [
  'Food', 'Transportation', 'Bills', 'Shopping', 'Health', 'Entertainment',
  'Salary', 'Business', 'Gifts', 'Investment', 'Other expense', 'Other income'
];

const EditTransaction = () => {
  const { id } = useParams();
  console.log('Editing transaction with ID:', id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleTransaction, loading } = useSelector((state) => state.expense);

  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    dispatch(getTransactionById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleTransaction) {
      setType(singleTransaction.type);
      setDescription(singleTransaction.description);
      setCategory(singleTransaction.category);
      setDate(new Date(singleTransaction.date).toISOString().slice(0, 10));
      setAmount(singleTransaction.amount);
    }
  }, [singleTransaction]);

  const handleEdit = (e) => {
    e.preventDefault();
    if (!type || !description || !category || !date || !amount) return;
    const data = { type, description, category, date, amount };
    dispatch(editTransaction({ id, data }))
      .unwrap()
      .then(() => navigate('/all-transaction-detail'))
      .catch(() => {});
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 p-4 md:p-8">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-700 text-center flex-1">Edit Transaction</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Back
            </button>
          </div>
          <form onSubmit={handleEdit} className="space-y-4">
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
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50 transition"
            >
              {loading ? 'Updating...' : 'Update Transaction'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditTransaction;