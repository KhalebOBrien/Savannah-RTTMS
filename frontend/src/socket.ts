import { io } from 'socket.io-client';

export const socket = io('http://localhost:1543', {
  autoConnect: false,
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
