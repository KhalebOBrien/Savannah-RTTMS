import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { socket, connectSocket, disconnectSocket } from '../../socket';

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

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks',
      );
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/tasks', task);
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
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    connectToSocket: (state, action: PayloadAction<string>) => {
      connectSocket(action.payload);

      socket.on('taskCreated', (task: Task) => {
        state.tasks.push(task);
      });

      socket.on('taskUpdated', (updatedTask: Task) => {
        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id,
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });

      socket.on('taskDeleted', (deletedTask: { id: string }) => {
        state.tasks = state.tasks.filter((task) => task.id !== deletedTask.id);
      });
    },
    disconnectFromSocket: () => {
      disconnectSocket();
    },
  },
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

export const {
  addTask,
  updateTask,
  deleteTask,
  connectToSocket,
  disconnectFromSocket,
} = taskSlice.actions;

export default taskSlice.reducer;
