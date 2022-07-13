import { Player } from './Player';

export enum PokerCardColors {
  SPADE, // 黑桃
  DIAMOND, // 方块
  CLUB, // 梅花
  HEART, // 红桃
  BLACK, // 黑色
  RED, // 红色
}

export enum PokerCardRedColors {
  DIAMOND = PokerCardColors.DIAMOND,
  HEART = PokerCardColors.HEART,
}

export enum PokerCardBlackColors {
  SPADE = PokerCardColors.SPADE,
  CLUB = PokerCardColors.CLUB,
}

export enum PokerCardTypes {
  JOKER = 'JOKER',
  A = 'A',
  No2 = '2',
  No3 = '3',
  No4 = '4',
  No5 = '5',
  No6 = '6',
  No7 = '7',
  No8 = '8',
  No9 = '9',
  No10 = '10',
  J = 'J',
  Q = 'Q',
  K = 'K',
}

export enum PokerRecordTypes {
  PLAY_CARDS = 'play-cards', // 出牌
  DISCARDS = 'discards', // 弃牌
  DRAW_CARDS = 'draw-cards', // 摸牌
}

export interface PokerCard {
  type: PokerCardTypes;
  color: PokerCardColors;
}

export interface PokerRecord {
  type: string;
  playerId: number;
  cards: PokerCard[];
  cardsType?: string;
  cardsWeight?: number;
  timestamp: number;
}

export interface PokerHand {
  type: string;
  weight: number;
}

export abstract class Poker {
  /**
   * 扑克牌
   */
  cards: PokerCard[] = [];

  /**
   * 出牌记录
   */
  records: PokerRecord[] = [];

  /**
   * 权重
   */
  cardWeights: PokerCardTypes[] = [];

  /**
   * 生成扑克牌
   */
  createCards() {
    this.cards = Object.values(PokerCardTypes).flatMap<PokerCard>((type) => {
      const colors =
        type === PokerCardTypes.JOKER
          ? [PokerCardColors.RED, PokerCardColors.BLACK]
          : [
              PokerCardColors.SPADE,
              PokerCardColors.DIAMOND,
              PokerCardColors.CLUB,
              PokerCardColors.HEART,
            ];
      return colors.map((color) => ({
        type,
        color,
      }));
    });

    return this.cards;
  }

  /**
   * 洗牌
   */
  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const random = Math.floor(Math.random() * i);
      [this.cards[i], this.cards[random]] = [this.cards[random], this.cards[i]];
    }
    return this.cards;
  }

  /**
   * 分析牌型数量
   * @param cards
   */
  parseCards(cards: PokerCard[]) {
    const result: Record<string, PokerCardColors[]> = {};
    cards.forEach((item) => {
      if (!result[item.type]) result[item.type] = [];
      result[item.type].push(item.color);
    });
    return result;
  }

  /**
   * 出牌
   * @param player
   * @param cards
   */
  playCards(player: Player, cards: PokerCard[]) {
    const verify = this.verifyCards(cards);
    const last = this.records[this.records.length - 1];
    if (!verify) {
      return false;
    }
    if (
      last &&
      last.playerId !== player.id &&
      last.type === PokerRecordTypes.PLAY_CARDS &&
      this.compareCards(verify, { type: last.cardsType, weight: last.cardsWeight }) < 1
    ) {
      return false;
    }
    const record = {
      playerId: player.id,
      cards,
      cardsType: verify.type,
      cardsWeight: verify.weight,
      type: PokerRecordTypes.PLAY_CARDS,
      timestamp: Date.now(),
    };
    player.records.push(record);
    player.cards = player.cards.filter(
      (item) =>
        !cards.find((card) => card.type === item.type && card.color === item.color),
    );
    this.records.push(record);
    return true;
  }

  /**
   * 弃牌
   */
  discards(player: Player, cards: PokerCard[]) {
    const record = {
      playerId: player.id,
      cards,
      type: PokerRecordTypes.DISCARDS,
      timestamp: Date.now(),
    };
    player.records.push(record);
    player.cards = player.cards.filter(
      (item) =>
        !cards.find((card) => card.type === item.type && card.color === item.color),
    );
    this.records.push(record);
    return true;
  }

  /**
   * 摸牌
   * @param player
   * @param quantity
   */
  drawCards(player: Player, quantity: number) {
    const cards = this.cards.splice(0, quantity);
    const record = {
      playerId: player.id,
      cards,
      type: PokerRecordTypes.DRAW_CARDS,
      timestamp: Date.now(),
    };
    player.records.push(record);
    player.cards.push(...cards);
    this.records.push(record);
    return cards;
  }

  /**
   * 比较牌型大小
   * @param cards1
   * @param cards2
   */
  compareCards(
    cards1: PokerCard[] | PokerHand | false,
    cards2: PokerCard[] | PokerHand | false,
  ): number {
    const hand1 = Array.isArray(cards1) ? this.verifyCards(cards1) : cards1;
    const hand2 = Array.isArray(cards2) ? this.verifyCards(cards2) : cards2;

    if (!hand1) {
      return hand2 ? -1 : 0;
    }

    if (!hand2) {
      return hand1 ? 1 : 0;
    }

    if (hand1.type === hand2.type) {
      return hand1.weight - hand2.weight;
    }

    return 0;
  }

  /**
   * 整理，排序
   * @param cards
   */
  sortCards(cards: PokerCard[]) {
    cards.sort((a, b) => {
      return this.cardWeights.indexOf(b.type) - this.cardWeights.indexOf(a.type);
    });
  }

  /**
   * 校验牌型
   * @param cards
   */
  abstract verifyCards(cards: PokerCard[]): PokerHand | false;

  /**
   * 发牌
   * @param players
   */
  abstract dealCards(players: Player[]): void;

  /**
   * 提示出牌
   * @param player
   */
  abstract hintCards(player: Player): PokerCard[] | false;
}
