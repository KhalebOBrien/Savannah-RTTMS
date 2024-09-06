import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks',
      );
    }
  },
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Task, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const response = await axios.post('/api/tasks', task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task',
      );
    }
  },
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      });
  },
});

export default taskSlice.reducer;
