import { GameEvents, GameTypes } from '../constants';
import { Player } from './Player';
import { Poker } from './Poker';
import { Process } from './Process';
import { EventListener } from '../utils';

export interface GameContext {
  type: GameTypes;
  poker: Poker;
  process: Process;
  players: Player[];
  maxCount: number;
}

export class Game {
  type: GameTypes;

  poker: Poker;

  process: Process;

  players: Player[];

  maxCount: number;

  constructor(context: GameContext) {
    this.type = context.type;
    this.poker = context.poker;
    this.process = context.process;
    this.players = context.players;
    this.maxCount = context.maxCount;
  }

  start() {
    this.process.start(this.poker, this.players);
  }

  stop() {
    this.process.stop();
  }

  pause() {
    this.process.pause();
  }

  resume() {
    this.process.resume();
  }

  next() {
    this.process.next();
  }

  addListener(event: GameEvents, listener: EventListener) {
    this.process.addListener(event, listener);
  }

  removeListener(event: GameEvents, listener: EventListener) {
    this.process.removeListener(event, listener);
  }

  getPlayer(id: number) {
    return this.players.find((item) => item.id === id);
  }

  addPlayer(player: Player) {
    const index = this.players.indexOf(player);
    if (index < 0) {
      for (let i = 0; i <= this.players.length; i++) {
        if (!this.players[i]) {
          this.players[i] = player;
          return;
        }
      }
      this.players.push(player);
    }
  }

  removePlayer(player: Player | number) {
    const index = this.players.findIndex((item) =>
      typeof player === 'number' ? item.id === player : item == player,
    );
    if (index > 0) {
      this.players.splice(index, 1);
    }
  }
}
