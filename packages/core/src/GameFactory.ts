import { Game } from './base';
import { GameTypes } from './constants';
import { LandlordPoker, LandlordProcess } from './landlord';

export class GameFactory {
  static landlordGame() {
    return new Game({
      type: GameTypes.LANDLORD,
      poker: new LandlordPoker(),
      process: new LandlordProcess(),
      players: [],
      maxCount: 3,
    });
  }
}
