import { Server } from 'socket.io';
import { serverSocketConfig } from '../config/socketConfig.js';
import { SocketEventHandlers } from './eventHandlers.js';
import { MatchmakingService } from '../services/MatchmakingService.js';
import { logger } from '../utils/logger.js';

export function createSocketServer(httpServer, corsOptions) {
  const io = new Server(httpServer, {
    ...serverSocketConfig,
    cors: corsOptions,
    pingTimeout: 10000,
    pingInterval: 5000
  });

  const matchmakingService = new MatchmakingService();
  const eventHandlers = new SocketEventHandlers(matchmakingService);

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('setUsername', (data) => {
      logger.info(`Username set for ${socket.id}: ${data.username}`);
      eventHandlers.handleSetUsername(socket, data);
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

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
      eventHandlers.handleDisconnect(socket);
    });

    // Send initial connection status
    socket.emit('connectionStatus', { 
      connected: true,
      socketId: socket.id,
      timestamp: Date.now()
    });
  });

  // Monitor active connections
  setInterval(() => {
    const sockets = io.sockets.sockets;
    logger.info(`Active connections: ${sockets.size}`);
  }, 30000);

  return io;
}