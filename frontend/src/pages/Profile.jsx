import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Footer from '../components/Footer';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-green-50 text-gray-800">
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md text-center">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer mb-6 self-start"
          >
            Back to Home
          </button>

          {/* User Details */}
          <div className="mb-6">
            {user?.user?.profileImage ? (
              <img
                src={user?.user?.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-green-300 mb-4"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold text-green-700 mb-2">{user?.user?.name || 'User Name'}</h2>
            <p className="text-gray-600">{user?.user?.email || 'user@example.com'}</p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/all-transaction-detail')}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition cursor-pointer"
            >
              See All Transactions
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;