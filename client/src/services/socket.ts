import { io, Socket } from 'socket.io-client';
import { storage } from './storage';
import { Platform } from 'react-native';

// User's Local IP address for physical device Expo Go testing
const SOCKET_URL = 'https://healthcare-solution-1.onrender.com';

class SocketService {
  public socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
      
      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
