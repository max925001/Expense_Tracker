import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/helpers/axiosInstance';
import toast from 'react-hot-toast';

export const createAccount = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/users/register', data);
    toast.success(res.data?.message || 'Registration successful');
    return res.data; // Backend should return user data
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create account';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/users/login', data);
    const userRes = await axiosInstance.get('/users/me'); // Fetch user data after login
    toast.success(res.data?.message || 'Login successful');
    return userRes.data; // Return user data
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to login';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/users/logout');
    toast.success(res.data?.message || 'Logout successful');
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to logout';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/users/me');
    return res.data; // Backend returns user data if cookie is valid
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Not authenticated';
    return rejectWithValue(errorMessage);
  }
});

export const editProfile = createAsyncThunk('auth/edit', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put('/users/edit', data);
    toast.success(res.data?.message || 'Profile updated successfully');
    return res.data; // Backend returns updated user
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update profile';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isLoggedIn', 'true');
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isLoggedIn', 'true');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        localStorage.clear();
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('isLoggedIn', 'true');
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      })
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;