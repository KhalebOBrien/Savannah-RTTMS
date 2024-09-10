import { io } from 'socket.io-client';
import { store } from './store';
import {
  addTask,
  deleteTaskLocally,
  Task,
  updateTaskLocally,
} from './store/slices/taskSlice';

export const socket = io('http://localhost:1543', {
  autoConnect: false,
});

export const connectSocket = (token: string) => {
  if (socket.connected) {
    console.log('Socket is already connected');
    return;
  }

  if (token) {
    socket.auth = { token };
    socket.connect();
    return;
  }

  console.log('Unauthorized for websocket');
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected');
  } else {
    console.log('No active socket connection to disconnect');
  }
};

export const listenToSocketEvents = () => {
  socket.off('taskCreated');
  socket.off('taskUpdated');
  socket.off('taskDeleted');

  socket.on('taskCreated', (task: Task) => {
    store.dispatch(addTask(task));
  });

  socket.on('taskUpdated', (updatedTask: Task) => {
    store.dispatch(updateTaskLocally(updatedTask));
  });

  socket.on('taskDeleted', (deletedTask: { id: string }) => {
    store.dispatch(deleteTaskLocally(deletedTask.id));
  });
};
