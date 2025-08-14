import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaChartBar, FaPlus } from 'react-icons/fa';
import { getAllTransactions, filterTransactions, getTotals, deleteTransaction, clearFilter } from '../redux/slices/expenseSlice';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

const categories = [
  'Food', 'Transportation', 'Bills', 'Shopping', 'Health', 'Entertainment',
  'Salary', 'Business', 'Gifts', 'Investment', 'Other expense', 'Other income'
];

const AllTransactionDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expenses, filteredExpenses, totals, loading, error } = useSelector((state) => state.expense);

  // Sort transactions by updatedAt in descending order (latest updated first) as a fallback
  const displayExpenses = Array.isArray(filteredExpenses) 
    ? [...filteredExpenses].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    : Array.isArray(expenses) 
      ? [...expenses].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      : [];

  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(getAllTransactions());
    dispatch(getTotals());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Debug: Log transaction updatedAt to verify sorting
  useEffect(() => {
    console.log('Expenses:', expenses?.map(exp => ({ id: exp._id, updatedAt: exp.updatedAt })));
    console.log('Filtered Expenses:', filteredExpenses?.map(exp => ({ id: exp._id, updatedAt: exp.updatedAt })));
    console.log('Display Expenses:', displayExpenses?.map(exp => ({ id: exp._id, updatedAt: exp.updatedAt })));
  }, [expenses, filteredExpenses, displayExpenses]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = {};
    if (category) params.category = category;
    if (minAmount) params.minAmount = minAmount;
    if (maxAmount) params.maxAmount = maxAmount;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    dispatch(filterTransactions(params));
  };

  const handleClearFilter = () => {
    dispatch(clearFilter());
    setCategory('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    dispatch(deleteTransaction(id))
      .unwrap()
      .then(() => {
        dispatch(getTotals());
        setDeletingId(null);
      })
      .catch(() => setDeletingId(null));
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 p-4 md:p-8">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
            aria-label="Go back to previous page"
          >
            Back To Profile
          </button>
          <button
            onClick={() => navigate('/add-transaction')}
            className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer flex items-center"
            aria-label="Add new transaction"
          >
            <FaPlus className="inline mr-2" /> Add Transaction
          </button>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-700 text-center">All Transactions</h2>

        {/* Totals */}
        <div className="mb-6 text-center">
          <p className="text-lg md:text-2xl font-bold text-green-700">
            Total Balance: <span className={totals.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>${totals.remaining.toFixed(2)}</span>
          </p>
          {displayExpenses.length === 0 && !loading && !error && (
            <p className="text-sm md:text-base text-gray-600 mt-2">No transactions available. Add some to see your balance.</p>
          )}
        </div>

        {/* Filter Form */}
        <form onSubmit={handleFilter} className="mb-6 space-y-4 md:space-y-0 md:flex md:space-x-4 items-end">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-auto p-3 border border-green-300 rounded focus:outline-none focus:border-green-500 text-sm md:text-base"
            aria-label="Select category"
          >
            <option value="">Any Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full md:w-auto p-3 border border-green-300 rounded focus:outline-none focus:border-green-500 text-sm md:text-base"
            aria-label="Minimum amount"
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full md:w-auto p-3 border border-green-300 rounded focus:outline-none focus:border-green-500 text-sm md:text-base"
            aria-label="Maximum amount"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-auto p-3 border border-green-300 rounded focus:outline-none focus:border-green-500 text-sm md:text-base cursor-pointer"
            aria-label="Start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-auto p-3 border border-green-300 rounded focus:outline-none focus:border-green-500 text-sm md:text-base cursor-pointer"
            aria-label="End date"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50 transition text-sm md:text-base cursor-pointer"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleClearFilter}
            className="w-full md:w-auto bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition text-sm md:text-base cursor-pointer"
          >
            Clear
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mb-6 text-center text-red-600 text-sm md:text-base">
            Error: {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mb-6 text-center">
            <svg className="animate-spin h-8 w-8 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Analysis Button */}
        <div className="mb-6 text-center">
          <button
            onClick={() => navigate('/analysis')}
            className="w-full md:w-auto bg-green-500 text-white p-3 rounded hover:bg-green-600 transition text-sm md:text-lg font-semibold cursor-pointer"
          >
            <FaChartBar className="inline mr-2" /> Analysis
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-green-300 rounded-lg shadow-md">
            <thead className="bg-green-100">
              <tr>
                <th className="p-2 md:p-3 text-left text-green-700 text-sm md:text-base">Type</th>
                <th className="p-2 md:p-3 text-left text-green-700 text-sm md:text-base">Description</th>
                <th className="p-2 md:p-3 text-left text-green-700 text-sm md:text-base">Category</th>
                <th className="p-2 md:p-3 text-left text-green-700 text-sm md:text-base">Date</th>
                <th className="p-2 md:p-3 text-left text-green-700 text-sm md:text-base">Amount</th>
                <th className="p-2 md:p-3 text-left text-green-700 text-sm md:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayExpenses.length > 0 ? (
                displayExpenses.map((exp, index) => (
                  <tr
                    key={exp._id}
                    className={`border-b ${exp.type === 'Expense' ? 'text-red-600' : 'text-green-600'} ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="p-2 md:p-3 text-sm md:text-base">{exp.type}</td>
                    <td className="p-2 md:p-3 text-sm md:text-base">{exp.description}</td>
                    <td className="p-2 md:p-3 text-sm md:text-base">{exp.category}</td>
                    <td className="p-2 md:p-3 text-sm md:text-base">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="p-2 md:p-3 text-sm md:text-base">${exp.amount.toFixed(2)}</td>
                    <td className="p-2 md:p-3 flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit-transaction/${exp._id}`)}
                        className="text-blue-500 hover:text-blue-700 text-sm md:text-base cursor-pointer"
                        aria-label={`Edit transaction ${exp.description}`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        disabled={deletingId === exp._id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 text-sm md:text-base cursor-pointer"
                        aria-label={`Delete transaction ${exp.description}`}
                      >
                        {deletingId === exp._id ? 'Deleting...' : <FaTrash />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-600 text-sm md:text-base">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllTransactionDetail;