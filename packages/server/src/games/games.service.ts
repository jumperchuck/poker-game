import { Injectable } from '@nestjs/common';
import {
  Game,
  GameFactory,
  GameTypes,
  LandlordPlayer,
  LandlordPoker,
  LandlordRecordTypes,
  Player,
  PokerRecordTypes,
} from '@poker-game/core';

const configs: Record<string, (game: Game, player: Player, data: any) => boolean> = {
  /**
   * Base Game
   */
  [PokerRecordTypes.PLAY_CARDS](game, player, data) {
    if (game.poker.playCards(player, data.cards)) {
      game.next();
      return true;
    }
    return false;
  },
  [PokerRecordTypes.DISCARDS](game, player, data) {
    if (game.poker.discards(player, data.cards)) {
      game.next();
      return true;
    }
    return false;
  },
  [PokerRecordTypes.DRAW_CARDS](game, player, data) {
    if (game.poker.drawCards(player, data.quantity)) {
      game.next();
      return true;
    }
    return false;
  },
  /**
   * Landlord Game
   */
  [`${GameTypes.LANDLORD}:${LandlordRecordTypes.GRAB_LANDLORD}`](game, player) {
    if (game.poker instanceof LandlordPoker) {
      if (game.poker.grabLandlord(player)) {
        game.next();
        return true;
      }
    }
  },
  [`${GameTypes.LANDLORD}:${LandlordRecordTypes.NOT_GRAB_LANDLORD}`](game, player) {
    if (game.poker instanceof LandlordPoker) {
      if (game.poker.notGrabLandlord(player)) {
        game.next();
        return true;
      }
    }
  },
};

@Injectable()
export class GamesService {
  createGame(type: GameTypes) {
    switch (type) {
      case GameTypes.LANDLORD:
        return GameFactory.landlordGame();
    }
  }

  createPlayer(type: GameTypes, id?: number) {
    switch (type) {
      case GameTypes.LANDLORD:
        return new LandlordPlayer(id);
    }
  }

  createRobot(type: GameTypes, id?: number) {
    const player = this.createPlayer(type, id);
    player.robot = true;
    player.ready = true;
    return player;
  }

  gameplay(game: Game, player: Player, data: any) {
    if (configs[`${game.type}:${data.type}`]) {
      return configs[`${game.type}:${data.type}`](game, player, data);
    }
    if (configs[`${data.type}`]) {
      return configs[`${data.type}`](game, player, data);
    }
    return false;
  }
}
