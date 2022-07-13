import { randomNums } from '../utils';
import {
  Poker,
  Player,
  PlayerTypes,
  PokerCard,
  PokerCardColors,
  PokerCardTypes,
  PokerHand,
  PokerRecord,
} from '../base';

export enum LandlordRecordTypes {
  GRAB_LANDLORD = 'grab-landlord',
  NOT_GRAB_LANDLORD = 'not-grab-landlord',
}

export enum LandlordHandTypes {
  BOMB = 'bomb', // 炸弹
  SINGLE = 'single', // 单张
  PAIR = 'pair', // 对子
  THREE = 'three', // 三张
  THREE_WITH_SINGLE = 'three-with-single', // 三带一
  THREE_WITH_PAIR = 'three-with-pair', // 三带二
  MULTI_THREE = 'multi-three', // 飞机不带
  MULTI_THREE_WITH_SINGLE = 'multi-three-with-single', // 飞机带单张
  MULTI_THREE_WITH_PAIR = 'multi-three-with-pair', // 飞机带对子
  STRAIGHT = 'straight', // 顺子
  PAIRING = 'pairing', // 连对
}

export class LandlordPoker extends Poker {
  landlordCards: PokerCard[] = [];

  cardWeights: PokerCardTypes[] = [
    PokerCardTypes.No3,
    PokerCardTypes.No4,
    PokerCardTypes.No5,
    PokerCardTypes.No6,
    PokerCardTypes.No7,
    PokerCardTypes.No8,
    PokerCardTypes.No9,
    PokerCardTypes.No10,
    PokerCardTypes.J,
    PokerCardTypes.Q,
    PokerCardTypes.K,
    PokerCardTypes.A,
    PokerCardTypes.No2,
    PokerCardTypes.JOKER,
  ];

  dealCards(players: Player[]) {
    // 生成地主牌
    const randoms = randomNums(0, this.cards.length - 1, 3);
    const cards = [...this.cards].filter((_, i) => !randoms.includes(i));
    this.landlordCards = randoms.map((i) => this.cards[i]);
    // 发牌，每人17张。地主额外拥有3张牌
    players.forEach((player) => {
      player.cards = cards.splice(0, 17);
      if (player.type === PlayerTypes.SPECIAL) {
        player.cards.push(...this.landlordCards);
      }
    });
  }

  verifyCards(cards: PokerCard[]) {
    const length = cards?.length;
    if (!length) return false;
    const result = this.parseCards(cards);
    const transform = Object.entries(result)
      .map(([type, colors]) => ({
        type,
        qty: colors.length,
        weight: this.cardWeights.indexOf(type as PokerCardTypes),
      }))
      .sort((a, b) => {
        if (b.qty > a.qty) {
          return 1;
        } else if (b.qty < a.qty) {
          return -1;
        } else if (a.type === b.type) {
          return 0;
        }
        return b.weight - a.weight;
      });
    const qty = transform.map((item) => item.qty).toString();
    const weight = transform[0].weight;
    if (weight < 0) {
      return false;
    }
    // 单张
    if (qty === '1') {
      // 大王权重最大
      if (
        cards[0].type === PokerCardTypes.JOKER &&
        cards[0].color === PokerCardColors.RED
      ) {
        return {
          type: LandlordHandTypes.SINGLE,
          weight: this.cardWeights.length,
        };
      }
      return { type: LandlordHandTypes.SINGLE, weight };
    }
    // 对子 or 王炸
    if (qty === '2') {
      if (cards[0].type === PokerCardTypes.JOKER) {
        return { type: LandlordHandTypes.BOMB, weight };
      }
      return { type: LandlordHandTypes.PAIR, weight };
    }
    // 三张不带
    if (qty === '3') {
      return { type: LandlordHandTypes.THREE, weight };
    }
    // 三带一
    if (qty === '3,1') {
      return { type: LandlordHandTypes.THREE_WITH_SINGLE, weight };
    }
    // 炸弹
    if (qty === '4') {
      return { type: LandlordHandTypes.BOMB, weight };
    }
    // 三带二
    if (qty === '3,2') {
      return { type: LandlordHandTypes.THREE_WITH_PAIR, weight };
    }
    // 飞机不带
    if (qty === '3,3') {
      return { type: LandlordHandTypes.MULTI_THREE, weight };
    }
    // 飞机带单张
    if (qty === '3,3,1,1' || qty === '3,3,3,1,1,1') {
      return { type: LandlordHandTypes.MULTI_THREE_WITH_SINGLE, weight };
    }
    // 飞机带对子
    if (qty === '3,3,2,2' || qty === '3,3,3,2,2,2') {
      return { type: LandlordHandTypes.MULTI_THREE_WITH_PAIR, weight };
    }
    // 顺子
    if (
      length >= 5 &&
      length <= 12 &&
      transform[0].weight <= this.cardWeights.indexOf(PokerCardTypes.A) &&
      transform.every((item, i) => {
        const isOne = item.qty === 1;
        if (!isOne) return false;
        if (i > 0) return item.weight == transform[i - 1].weight - 1;
        return isOne;
      })
    ) {
      return { type: LandlordHandTypes.STRAIGHT, weight };
    }
    // 连对
    if (
      length >= 6 &&
      length % 2 == 0 &&
      transform[0].weight <= this.cardWeights.indexOf(PokerCardTypes.A) &&
      transform.every((item, i) => {
        const isTwo = item.qty === 2;
        if (!isTwo) return false;
        if (i > 0) return item.weight == transform[i - 1].weight - 1;
        return isTwo;
      })
    ) {
      return { type: LandlordHandTypes.PAIRING, weight };
    }
    return false;
  }

  compareCards(
    cards1: PokerCard[] | PokerHand | false,
    cards2: PokerCard[] | PokerHand | false,
  ): number {
    const hand1 = Array.isArray(cards1) ? this.verifyCards(cards1) : cards1;
    const hand2 = Array.isArray(cards2) ? this.verifyCards(cards2) : cards2;

    if (
      hand1 &&
      hand2 &&
      hand1.type !== hand2.type &&
      hand1.type === LandlordHandTypes.BOMB
    ) {
      return 1;
    }

    return super.compareCards(hand1, hand2);
  }

  hintCards(player: Player): PokerCard[] | false {
    const lastRecord = this.records[this.records.length - 1];
    if (!lastRecord || lastRecord.playerId === player.id) {
      return [player.cards[0]];
    }
    return false;
  }

  /**
   * 抢地主
   * @param player
   */
  grabLandlord(player: Player) {
    const record: PokerRecord = {
      playerId: player.id,
      cards: [],
      type: LandlordRecordTypes.GRAB_LANDLORD,
      timestamp: Date.now(),
    };
    player.records.push(record);
    player.cards.push(...this.landlordCards);
    player.type = PlayerTypes.SPECIAL;
    this.sortCards(player.cards);
    this.records.push(record);
    return true;
  }

  /**
   * 不抢地主
   * @param player
   */
  notGrabLandlord(player: Player) {
    const record: PokerRecord = {
      playerId: player.id,
      cards: [],
      type: LandlordRecordTypes.NOT_GRAB_LANDLORD,
      timestamp: Date.now(),
    };
    player.records.push(record);
    this.records.push(record);
    return true;
  }
}
