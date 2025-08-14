import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { logout } from '../redux/slices/authSlice';
import Footer from '../components/Footer';
import exp2 from '../assets/exp2.jpg';
import exp3 from '../assets/exp3.png';
import tracker from '../assets/traker (1).png';
import aboutus from '../assets/aboutus.png';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const typewriterTexts = [
    'Track your daily expenses effortlessly.',
    2000, // Pause after text
    'Manage your budget with ease.',
    2000,
    'Analyze your spending patterns.',
    2000,
    'Stay on top of your finances.',
    2000
  ];

  return (
    <div className="flex flex-col min-h-screen bg-green-50 text-gray-800 pt-16">
      <div className="flex-grow">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
          <h1 className="text-2xl font-bold text-green-700">Expense Tracker</h1>
          <div className="flex items-center space-x-4">
            <div onClick={() => navigate('/profile')} className="cursor-pointer">
              {user?.user?.profileImage ? (
                <img src={user?.user?.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-green-300" />
              ) : (
                <FaUserCircle className="w-10 h-10 text-green-500" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between bg-green-100">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4 text-green-700">Welcome to Expense Tracker</h2>
            <p className="text-xl mb-6">
              <TypeAnimation
                sequence={typewriterTexts}
                wrapper="span"
                speed={50}
                deletionSpeed={50}
                repeat={Infinity}
                cursor={true}
                style={{ color: '#047857' }} // Tailwind green-700
              />
            </p>
            <button
              onClick={() => navigate('/add-transaction')}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition text-lg font-semibold cursor-pointer"
            >
              Click here to track your expenses
            </button>
          </div>
          <img
            src={exp2}
            alt="Expense Tracker Illustration"
            className="md:w-1/2 h-auto max-h-96 object-contain rounded-2xl"
          />
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-green-700">Discover Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src="https://raw.githubusercontent.com/cuuupid/undraw-illustrations/master/svg/time_management_30iu.svg"
                alt="Tracking Illustration"
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="text-2xl font-bold mb-2 text-green-700">Easy Expense Tracking</h3>
              <p className="text-gray-600">Add new income or expenses with simple forms, categorize them, and keep track of your financial flow.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={exp3}
                alt="Filter Illustration"
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="text-2xl font-bold mb-2 text-green-700">Advanced Filtering</h3>
              <p className="text-gray-600">Filter your transactions by category, amount, or date range to get precise insights into your spending.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={tracker}
                alt="Graph Illustration"
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="text-2xl font-bold mb-2 text-green-700">Graph Analysis</h3>
              <p className="text-gray-600">Visualize your income, expenses, and remaining balance with interactive graphs and charts for better decision-making.</p>
            </div>
          </div>
        </section>

        {/* Additional Description Section */}
        <section className="py-16 px-4 md:px-8 bg-green-50">
          <h2 className="text-3xl font-bold mb-12 text-center text-green-700">Why Choose Expense Tracker?</h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
            <p className="md:w-1/2 text-lg text-gray-700">
              Our app provides a seamless way to manage your finances. With features like real-time totals, deletion of transactions, and secure cookie-based authentication, you can focus on what matters. Stay organized and gain insights into your financial habits with our intuitive interface.
            </p>
            <img
              src={aboutus}
              alt="App Overview Illustration"
              className="md:w-1/2 h-auto max-h-96 object-contain"
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;