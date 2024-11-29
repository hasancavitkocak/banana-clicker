import { SOCKET_EVENTS } from '../config/socketConfig.js';

export class MatchmakingService {
  constructor() {
    this.waitingPlayers = new Map();
    this.activeGames = new Map();
    this.usernames = new Map(); // Store usernames
  }

  setUsername(socketId, username) {
    this.usernames.set(socketId, username);
  }

  getUsername(socketId) {
    return this.usernames.get(socketId) || `Player ${socketId.slice(0, 4)}`;
  }

  findMatch(socket, duration) {
    console.log('Player searching for match:', socket.id, 'Duration:', duration);
    
    // Remove player from any existing waiting lists first
    this.removePlayerFromWaitingLists(socket.id);
    
    // Get or create waiting list for this specific duration
    const durationWaitingPlayers = this.getWaitingPlayersForDuration(duration);
    
    // Try to find an opponent with exactly the same duration
    const opponent = this.findOpponentWithSameDuration(socket.id, durationWaitingPlayers);

    if (opponent) {
      this.createMatch(socket, opponent, duration);
    } else {
      this.addToWaitingList(socket, duration, durationWaitingPlayers);
    }
  }

  removePlayerFromWaitingLists(playerId) {
    for (const [, players] of this.waitingPlayers.entries()) {
      players.delete(playerId);
    }
    this.usernames.delete(playerId); // Clean up username when player leaves
  }

  getWaitingPlayersForDuration(duration) {
    if (!this.waitingPlayers.has(duration)) {
      this.waitingPlayers.set(duration, new Map());
    }
    return this.waitingPlayers.get(duration);
  }

  findOpponentWithSameDuration(playerId, durationWaitingPlayers) {
    let opponent = null;
    for (const [waitingId, waitingSocket] of durationWaitingPlayers) {
      if (waitingId !== playerId) {
        opponent = waitingSocket;
        durationWaitingPlayers.delete(waitingId);
        break;
      }
    }
    return opponent;
  }

  createMatch(player1, player2, duration) {
    const gameId = `${player1.id}-${player2.id}`;
    
    this.activeGames.set(gameId, {
      players: [player1.id, player2.id],
      scores: { [player1.id]: 0, [player2.id]: 0 },
      clicks: { [player1.id]: 0, [player2.id]: 0 },
      maxCombos: { [player1.id]: 1, [player2.id]: 1 },
      duration: duration,
      usernames: {
        [player1.id]: this.getUsername(player1.id),
        [player2.id]: this.getUsername(player2.id)
      }
    });

    player1.join(gameId);
    player2.join(gameId);

    // Send match found event with opponent usernames
    player1.emit(SOCKET_EVENTS.MATCH_FOUND, { 
      gameId,
      opponentUsername: this.getUsername(player2.id)
    });
    player2.emit(SOCKET_EVENTS.MATCH_FOUND, { 
      gameId,
      opponentUsername: this.getUsername(player1.id)
    });
    
    console.log('Match created:', gameId, 'Duration:', duration);
  }

  addToWaitingList(socket, duration, durationWaitingPlayers) {
    durationWaitingPlayers.set(socket.id, socket);
    socket.emit(SOCKET_EVENTS.WAITING);
    console.log('Player added to waiting list:', socket.id, 'Duration:', duration);
  }

  cancelMatch(socketId) {
    this.removePlayerFromWaitingLists(socketId);
  }

  handleDisconnect(socketId) {
    this.removePlayerFromWaitingLists(socketId);
    this.handleDisconnectionInActiveGames(socketId);
  }

  handleDisconnectionInActiveGames(socketId) {
    for (const [gameId, game] of this.activeGames) {
      if (game.players.includes(socketId)) {
        const opponent = game.players.find(id => id !== socketId);
        if (opponent) {
          const opponentSocket = this.getSocketById(opponent);
          if (opponentSocket) {
            opponentSocket.emit(SOCKET_EVENTS.OPPONENT_DISCONNECTED);
          }
        }
        this.activeGames.delete(gameId);
      }
    }
  }

  getGame(gameId) {
    return this.activeGames.get(gameId);
  }

  removeGame(gameId) {
    this.activeGames.delete(gameId);
  }
}