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
  WAITING: 'waiting'
};

export const serverSocketConfig = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"]
  },
  pingTimeout: 10000,
  pingInterval: 5000,
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  allowUpgrades: true,
  upgradeTimeout: 10000,
  connectTimeout: 45000,
  maxHttpBufferSize: 1e8
};