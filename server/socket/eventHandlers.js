import { SOCKET_EVENTS } from '../config/socketConfig.js';

export class SocketEventHandlers {
  constructor(matchmakingService) {
    this.matchmakingService = matchmakingService;
  }

  handleConnection(socket) {
    console.log('User connected:', socket.id);
    socket.emit('connected', { id: socket.id });
  }

  handleSetUsername(socket, { username }) {
    this.matchmakingService.setUsername(socket.id, username);
  }

  handleFindMatch(socket, { duration }) {
    console.log('Finding match for:', socket.id, 'Duration:', duration);
    this.matchmakingService.findMatch(socket, duration);
  }

  handleMatchCancelled(socket) {
    console.log('Player cancelled matchmaking:', socket.id);
    this.matchmakingService.cancelMatch(socket.id);
    socket.emit(SOCKET_EVENTS.MATCH_CANCELLED);
  }

  handleUpdateScore(socket, { gameId, score, clicks, maxCombo }) {
    const game = this.matchmakingService.getGame(gameId);
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
  }

  handleSurrender(socket, { gameId }) {
    const game = this.matchmakingService.getGame(gameId);
    if (game) {
      const opponent = game.players.find(id => id !== socket.id);
      if (opponent) {
        socket.to(opponent).emit(SOCKET_EVENTS.OPPONENT_SURRENDERED);
      }
      this.matchmakingService.removeGame(gameId);
    }
  }

  handleGameEnded(socket, { gameId }) {
    this.matchmakingService.removeGame(gameId);
  }

  handleDisconnect(socket) {
    console.log('User disconnected:', socket.id);
    this.matchmakingService.handleDisconnect(socket.id);
  }
}