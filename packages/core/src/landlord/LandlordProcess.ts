import { PlayerTypes, Process, ProcessStatus } from '../base';
import { GameEvents } from '../constants';
import { delay } from '../utils';
import { LandlordPoker } from './LandlordPoker';
import { LandlordPlayer } from './LandlordPlayer';

export enum LandlordProcessStatus {
  LANDLORD = 'processing-landlord', // 选地主
}

export class LandlordProcess extends Process {
  constructor() {
    super();
    this.timer = delay(() => {
      const player = this.players.find((item) => item.id === this.playerId);
      if (this.status === LandlordProcessStatus.LANDLORD) {
        this.poker.discards(player, []);
      } else {
        const cards = this.poker.hintCards(player);
        if (cards && cards.length) {
          this.poker.playCards(player, []);
        } else {
          this.poker.discards(player, []);
        }
      }
      this.next();
    }, 24000);
  }

  start(poker: LandlordPoker, players: LandlordPlayer[]) {
    super.start(poker, players, false);
    // 选择地主
    this.status = LandlordProcessStatus.LANDLORD;
    this.eventEmitter.emit(GameEvents.START);
  }

  next() {
    const player = this.players.find((item) => item.id === this.playerId);

    if (this.status === LandlordProcessStatus.LANDLORD) {
      if (player.type === PlayerTypes.SPECIAL) {
        // 已选择地主，地主先出牌
        this.status = ProcessStatus.PROCESSING;
        this.nextTime = Date.now() + 24000;
        if (player.robot) {
          // 托管状态, 2s后出牌
          this.timer.reset(2000);
        } else {
          this.timer.reset();
        }
        this.eventEmitter.emit(GameEvents.NEXT);
        return;
      }
    }

    super.next();
  }
}
