declare namespace API {
  interface Result<T = any> {
    code: string;
    message: string;
    data: T;
  }

  interface Room {
    id: number;
    name: string;
    users: User[];
    game: Game;
  }

  interface User {
    id: number;
    username: string;
    ipAddress: string;
    roomId: number;
  }

  interface Game {
    type: string;
    poker: Poker;
    process: Process;
    players: (Player | null)[];
    maxCount: number;
  }

  interface Poker {
    cards: PokerCard[];
    records: PokerRecord[];
    cardWeights: string[];
  }

  interface PokerCard {
    type: string;
    color: number;
  }

  interface PokerRecord {
    type: string;
    playerId: number;
    cards: PokerCard[];
    cardsType?: string;
    cardsWeight?: number;
    timestamp: number;
  }

  interface Player {
    id: number;
    type: string;
    cards: PokerCard[];
    records: PokerRecord[];
    ready: boolean;
    robot: boolean;
  }

  interface Process {
    status: string;
    startTime: number;
    endTime: number;
    pauseTime: number;
    resumeTime: number;
    nextTime: number;
    playerId: number;
  }
}
