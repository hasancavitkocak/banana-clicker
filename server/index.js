import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MatchmakingService } from './services/MatchmakingService.js';
import { serverSocketConfig, SOCKET_EVENTS } from './config/socketConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize Socket.IO with CORS and connection settings
const io = new Server(httpServer, {
  ...serverSocketConfig,
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const matchmakingService = new MatchmakingService();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('connected', { id: socket.id });

  socket.on('setUsername', ({ username }) => {
    matchmakingService.setUsername(socket.id, username);
  });

  socket.on(SOCKET_EVENTS.FIND_MATCH, ({ duration }) => {
    console.log('Finding match for:', socket.id, 'Duration:', duration);
    matchmakingService.findMatch(socket, duration);
  });

  socket.on(SOCKET_EVENTS.MATCH_CANCELLED, () => {
    console.log('Player cancelled matchmaking:', socket.id);
    matchmakingService.cancelMatch(socket.id);
    socket.emit(SOCKET_EVENTS.MATCH_CANCELLED);
  });

  socket.on(SOCKET_EVENTS.UPDATE_SCORE, ({ gameId, score, clicks, maxCombo }) => {
    const game = matchmakingService.getGame(gameId);
    if (game) {
      game.scores[socket.id] = score;
      game.clicks[socket.id] = clicks;
      game.maxCombos[socket.id] = maxCombo;

      const opponent = game.players.find(id => id !== socket.id);
      if (opponent) {
        socket.to(opponent).emit(SOCKET_EVENTS.OPPONENT_UPDATE, {
          score,
          clicks,
          maxCombo
        });
      }
    }
  });

  socket.on(SOCKET_EVENTS.SURRENDER, ({ gameId }) => {
    const game = matchmakingService.getGame(gameId);
    if (game) {
      const opponent = game.players.find(id => id !== socket.id);
      if (opponent) {
        socket.to(opponent).emit(SOCKET_EVENTS.OPPONENT_SURRENDERED);
      }
      matchmakingService.removeGame(gameId);
    }
  });

  socket.on(SOCKET_EVENTS.GAME_ENDED, ({ gameId }) => {
    matchmakingService.removeGame(gameId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    matchmakingService.handleDisconnect(socket.id);
  });
});

// Serve index.html for all remaining routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});