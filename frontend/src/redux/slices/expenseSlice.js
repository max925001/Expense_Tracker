import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/helpers/axiosInstance';
import toast from 'react-hot-toast';

export const addTransaction = createAsyncThunk('expense/add', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/expenses', data);
    toast.success('Transaction added successfully');
    return res.data.expense;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to add transaction';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const getAllTransactions = createAsyncThunk('expense/getAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/expenses');
    return res.data.expenses;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch transactions';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const filterTransactions = createAsyncThunk('expense/filter', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/expenses/filter', { params });
    return res.data.expenses;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to filter transactions';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const getTotals = createAsyncThunk('expense/totals', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/expenses/totals');
    
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to get totals';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const getTransactionById = createAsyncThunk('expense/getById', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/expenses/${id}`);
    return res.data.expense;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch transaction';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const editTransaction = createAsyncThunk('expense/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log('Editing transaction with ID:', id,data);
    const res = await axiosInstance.put(`/expenses/${id}`, data);
    console.log(res)
    toast.success('Transaction updated successfully');
    return res.data.expense;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update transaction';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const deleteTransaction = createAsyncThunk('expense/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
    toast.success('Transaction deleted successfully');
    return id;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to delete transaction';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

const initialState = {
  expenses: [],
  filteredExpenses: null,
  totals: { totalIncome: 0, totalExpenses: 0, remaining: 0 },
  singleTransaction: null,
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearFilter: (state) => {
      state.filteredExpenses = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTransaction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(getAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(filterTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(filterTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredExpenses = action.payload;
      })
      .addCase(filterTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTotals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getTotals.fulfilled, (state, action) => {
        state.loading = false;
        state.totals = action.payload;
      })
      .addCase(getTotals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTransactionById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTransaction = action.payload;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editTransaction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.expenses[index] = action.payload;
        if (state.filteredExpenses) {
          const filteredIndex = state.filteredExpenses.findIndex((e) => e._id === action.payload._id);
          if (filteredIndex !== -1) state.filteredExpenses[filteredIndex] = action.payload;
        }
        state.singleTransaction = action.payload;
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTransaction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
        if (state.filteredExpenses) {
          state.filteredExpenses = state.filteredExpenses.filter((e) => e._id !== action.payload);
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFilter } = expenseSlice.actions;
export default expenseSlice.reducer;