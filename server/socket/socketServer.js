import { Server } from 'socket.io';
import { serverSocketConfig } from '../config/socketConfig.js';
import { SocketEventHandlers } from './eventHandlers.js';
import { MatchmakingService } from '../services/MatchmakingService.js';

export function createSocketServer(httpServer, corsOptions) {
const io = new Server(httpServer, {
  transports: ['websocket'], // Sadece WebSocket kullan
  cors: {
    origin: ['https://banana-clicker.fly.dev/', 'http://localhost:3000'], // Fly.io ve local URL izinleri
    methods: ['GET', 'POST'],
  },
});

  const matchmakingService = new MatchmakingService();
  const eventHandlers = new SocketEventHandlers(matchmakingService);

  io.on('connection', (socket) => {
    eventHandlers.handleConnection(socket);

    socket.on('setUsername', (data) => eventHandlers.handleSetUsername(socket, data));
    socket.on('findMatch', (data) => eventHandlers.handleFindMatch(socket, data));
    socket.on('matchCancelled', () => eventHandlers.handleMatchCancelled(socket));
    socket.on('updateScore', (data) => eventHandlers.handleUpdateScore(socket, data));
    socket.on('surrender', (data) => eventHandlers.handleSurrender(socket, data));
    socket.on('gameEnded', (data) => eventHandlers.handleGameEnded(socket, data));
    socket.on('disconnect', () => eventHandlers.handleDisconnect(socket));
  });

  return io;
}