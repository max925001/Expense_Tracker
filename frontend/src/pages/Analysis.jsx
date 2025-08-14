import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAllTransactions } from '../redux/slices/expenseSlice';
import Footer from '../components/Footer';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analysis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expenses } = useSelector((state) => state.expense);

  useEffect(() => {
    dispatch(getAllTransactions());
  }, [dispatch]);

  // Prepare data for pie charts
  const incomeExpenses = expenses.reduce((acc, exp) => {
    if (exp.type === 'Income') {
      acc.income[exp.category] = (acc.income[exp.category] || 0) + exp.amount;
    } else if (exp.type === 'Expense') {
      acc.expenses[exp.category] = (acc.expenses[exp.category] || 0) + exp.amount;
    }
    return acc;
  }, { income: {}, expenses: {} });

  const incomePieData = {
    labels: Object.keys(incomeExpenses.income),
    datasets: [
      {
        data: Object.values(incomeExpenses.income),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#E7E9ED', '#B2BEB5', '#8FBC8F', '#2F4F4F', '#808080'],
      },
    ],
  };

  const expensePieData = {
    labels: Object.keys(incomeExpenses.expenses),
    datasets: [
      {
        data: Object.values(incomeExpenses.expenses),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#E7E9ED', '#B2BEB5', '#8FBC8F', '#2F4F4F', '#808080'],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50 p-4 md:p-8">
      <div className="flex-grow">
        <button
          onClick={() => navigate(-1)}
          className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer mb-6"
          aria-label="Go back to previous page"
        >
          Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-700 text-center">Transaction Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-700 text-center mb-4">Income by Category</h3>
            <Pie data={incomePieData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-700 text-center mb-4">Expenses by Category</h3>
            <Pie data={expensePieData} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Analysis;