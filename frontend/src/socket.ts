import { io } from 'socket.io-client';

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
