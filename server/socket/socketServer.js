import { Server } from 'socket.io';
import { serverSocketConfig, SOCKET_EVENTS } from '../config/socketConfig.js';
import { SocketEventHandlers } from './eventHandlers.js';

export function createSocketServer(httpServer, corsOptions) {
  const io = new Server(httpServer, {
    ...serverSocketConfig,
    cors: corsOptions
  });

  const matchmakingService = new MatchmakingService();
  const eventHandlers = new SocketEventHandlers(matchmakingService);

  io.on('connection', (socket) => {
    eventHandlers.handleConnection(socket);

    socket.on('setUsername', (data) => eventHandlers.handleSetUsername(socket, data));
    socket.on(SOCKET_EVENTS.FIND_MATCH, (data) => eventHandlers.handleFindMatch(socket, data));
    socket.on(SOCKET_EVENTS.MATCH_CANCELLED, () => eventHandlers.handleMatchCancelled(socket));
    socket.on(SOCKET_EVENTS.UPDATE_SCORE, (data) => eventHandlers.handleUpdateScore(socket, data));
    socket.on(SOCKET_EVENTS.SURRENDER, (data) => eventHandlers.handleSurrender(socket, data));
    socket.on(SOCKET_EVENTS.GAME_ENDED, (data) => eventHandlers.handleGameEnded(socket, data));
    socket.on('disconnect', () => eventHandlers.handleDisconnect(socket));
  });

  return io;
}