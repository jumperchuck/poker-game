import { PokerCard, PokerRecord } from './Poker';

export enum PlayerTypes {
  NORMAL = 'normal',
  SPECIAL = 'special',
}

export abstract class Player {
  /**
   * 拥有的扑克牌
   */
  cards: PokerCard[] = [];

  /**
   * 出牌记录
   */
  records: PokerRecord[] = [];

  /**
   * 准备状态
   */
  ready: boolean;

  /**
   * 托管状态
   */
  robot: boolean;

  /**
   * @param id   玩家id
   * @param type 玩家类型
   */
  constructor(public id: number, public type: string = PlayerTypes.NORMAL) {}
}
