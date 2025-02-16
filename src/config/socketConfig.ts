import { ManagerOptions, SocketOptions } from 'socket.io-client';

interface CustomSocketConfig extends Partial<ManagerOptions & SocketOptions> {
  secure?: boolean;
}

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  DISCONNECT: 'disconnect',
  FIND_MATCH: 'findMatch',
  MATCH_FOUND: 'matchFound',
  MATCH_CANCELLED: 'matchCancelled',
  UPDATE_SCORE: 'updateScore',
  OPPONENT_UPDATE: 'opponentUpdate',
  SURRENDER: 'surrender',
  OPPONENT_SURRENDERED: 'opponentSurrendered',
  OPPONENT_DISCONNECTED: 'opponentDisconnected',
  GAME_ENDED: 'gameEnded',
  WAITING: 'waiting',
  SET_USERNAME: 'setUsername'
} as const;

export const socketConfig: CustomSocketConfig = {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  forceNew: true,
  autoConnect: false,
  reconnection: true,
  upgrade: true,
  rememberUpgrade: true,
  secure: true
};

export function getSocketUrl(): string {
  return window.location.origin;
}