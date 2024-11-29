export class MatchmakingService {
  constructor() {
    this.waitingPlayers = new Map();
    this.activeGames = new Map();
    this.usernames = new Map();
    this.regions = new Map();
    this.skillLevels = new Map();
  }

  setPlayerPreferences(socketId, { username, region, skillLevel }) {
    this.usernames.set(socketId, username);
    this.regions.set(socketId, region);
    this.skillLevels.set(socketId, skillLevel);
  }

  findMatch(socket, { duration, region, skillLevel }) {
    console.log('Player searching for match:', socket.id, 'Duration:', duration, 'Region:', region, 'Skill:', skillLevel);
    
    this.removePlayerFromWaitingLists(socket.id);
    const matchCriteria = this.getMatchingPlayers(duration, region, skillLevel);
    const opponent = this.findBestOpponent(socket.id, matchCriteria);

    if (opponent) {
      this.createMatch(socket, opponent, duration);
    } else {
      this.addToWaitingList(socket, duration, region, skillLevel);
    }
  }

  getMatchingPlayers(duration, region, skillLevel) {
    return Array.from(this.waitingPlayers.entries())
      .filter(([, player]) => {
        const playerRegion = this.regions.get(player.id);
        const playerSkill = this.skillLevels.get(player.id);
        
        return player.duration === duration &&
               (region === 'AUTO' || playerRegion === region || playerRegion === 'AUTO') &&
               this.isSkillLevelCompatible(skillLevel, playerSkill);
      });
  }

  isSkillLevelCompatible(skill1, skill2) {
    const levels = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
    const index1 = levels.indexOf(skill1);
    const index2 = levels.indexOf(skill2);
    return Math.abs(index1 - index2) <= 1;
  }

  // ... rest of the existing methods remain the same
}