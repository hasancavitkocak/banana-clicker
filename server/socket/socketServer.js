import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { SocketEventHandlers } from './eventHandlers.js';
import { MatchmakingService } from '../services/MatchmakingService.js';

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    transports: ['websocket'],
    allowEIO3: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 10000,
    pingInterval: 5000,
    connectTimeout: 45000,
    maxHttpBufferSize: 1e8
  });

  const matchmakingService = new MatchmakingService();
  const eventHandlers = new SocketEventHandlers(matchmakingService);

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.emit('connectionStatus', { 
      connected: true,
      socketId: socket.id,
      timestamp: Date.now()
    });

    socket.on('findMatch', (data) => {
      logger.info(`Finding match for ${socket.id}`, data);
      eventHandlers.handleFindMatch(socket, data);
    });

    socket.on('matchCancelled', () => {
      logger.info(`Match cancelled by ${socket.id}`);
      eventHandlers.handleMatchCancelled(socket);
    });

    socket.on('updateScore', (data) => {
      eventHandlers.handleUpdateScore(socket, data);
    });

    socket.on('surrender', (data) => {
      logger.info(`Player surrendered: ${socket.id}`);
      eventHandlers.handleSurrender(socket, data);
    });

    socket.on('gameEnded', (data) => {
      logger.info(`Game ended for: ${socket.id}`);
      eventHandlers.handleGameEnded(socket, data);
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
      eventHandlers.handleDisconnect(socket);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}