import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { serverSocketConfig, SOCKET_EVENTS } from './config/socketConfig.js';
import { MatchmakingService } from './services/MatchmakingService.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Check if dist directory exists
const distPath = join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.error('Error: dist directory not found. Please run npm run build first.');
  process.exit(1);
}

// Serve static files
app.use(express.static(distPath));
app.use('/sounds', express.static(join(__dirname, '../public/sounds')));

// Handle all routes
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Initialize Socket.IO with CORS and connection settings
const io = new Server(httpServer, {
  ...serverSocketConfig,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const matchmakingService = new MatchmakingService();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send immediate acknowledgment
  socket.emit('connected', { id: socket.id });

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

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log('User disconnected:', socket.id);
    matchmakingService.handleDisconnect(socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});