import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { editProfile } from '../redux/slices/authSlice';
import Footer from '../components/Footer';

const EditProfile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.user?.name || '');
  const [email, setEmail] = useState(user?.user?.email || '');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.user?.profileImage || null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle file selection and create preview URL
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(user?.user?.profileImage || null);
    }
  };

  // Clean up preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && file) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, file]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (file) formData.append('profilePic', file);
    dispatch(editProfile(formData))
      .unwrap()
      .then(() => navigate('/profile'))
      .catch(() => {});
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 md:p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-700 text-center flex-1">Edit Profile</h2>
            <button
              onClick={() => navigate("/profile")}
              className="text-sm sm:text-base bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
              aria-label="Go back to previous page"
            >
              Back
            </button>
          </div>
          <div className="mb-6 text-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-green-300 mb-4"
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full p-3 border border-green-300 rounded focus:outline-none focus:border-green-500 cursor-pointer"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;