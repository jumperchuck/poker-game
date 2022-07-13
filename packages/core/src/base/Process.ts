import { Poker } from './Poker';
import { Player } from './Player';
import { EventEmitter, EventListener, delay, random } from '../utils';
import { GameEvents } from '../constants';

export enum ProcessStatus {
  PREPARING = 'preparing', // 准备中
  PROCESSING = 'processing', // 进行中
  PAUSED = 'paused', // 已暂停
  FINISHED = 'finished', // 已结束
}

export abstract class Process {
  protected eventEmitter = new EventEmitter();

  protected poker: Poker;

  protected players: Player[];

  protected timer = delay(() => {
    const player = this.players.find((item) => item.id === this.playerId);
    const cards = this.poker.hintCards(player);
    if (cards && cards.length) {
      this.poker.playCards(player, []);
    } else {
      this.poker.discards(player, []);
    }
    this.next();
  }, 24000);

  /**
   * 开始时间
   */
  startTime: number;

  /**
   * 结束时间
   */
  endTime: number;

  /**
   * 暂停时间
   */
  pauseTime: number;

  /**
   * 恢复时间
   */
  resumeTime: number;

  /**
   * 状态
   */
  status: string = ProcessStatus.PREPARING;

  /**
   * 当前回合截止时间
   */
  nextTime: number;

  /**
   * 当前回合玩家
   */
  playerId: number;

  /**
   * 开始游戏
   */
  start(poker: Poker, players: Player[], emit = true) {
    this.startTime = Date.now();
    this.endTime = 0;
    this.pauseTime = 0;
    this.resumeTime = 0;
    this.status = ProcessStatus.PROCESSING;
    this.poker = poker;
    this.players = players;
    // 发牌
    this.poker.createCards();
    this.poker.shuffleCards();
    this.poker.dealCards(this.players);
    // 理牌
    this.players.forEach((player) => this.poker.sortCards(player.cards));
    // 随机出牌
    const player = this.players[random(0, this.players.length)];
    this.playerId = player.id;
    this.nextTime = Date.now() + 24000;
    if (player.robot) {
      // 托管状态, 2s后出牌
      this.timer.reset(2000);
    } else {
      this.timer.start();
    }
    if (emit) this.eventEmitter.emit(GameEvents.START);
  }

  /**
   * 停止游戏
   */
  stop(emit = true) {
    this.endTime = Date.now();
    this.status = ProcessStatus.FINISHED;
    this.timer.stop();
    this.nextTime = 0;
    this.playerId = null;
    if (emit) this.eventEmitter.emit(GameEvents.OVER);
  }

  /**
   * 暂停游戏
   */
  pause(emit = true) {
    this.pauseTime = Date.now();
    this.status = ProcessStatus.PAUSED;
    this.timer.stop();
    if (emit) this.eventEmitter.emit(GameEvents.PAUSE);
  }

  /**
   * 恢复游戏
   */
  resume(emit = true) {
    this.resumeTime = Date.now();
    this.status = ProcessStatus.PROCESSING;
    this.timer.start();
    if (emit) this.eventEmitter.emit(GameEvents.RESUME);
  }

  /**
   * 下个回合
   */
  next(emit = true) {
    const playerIndex = this.players.findIndex((item) => item.id === this.playerId);
    const player = this.players[playerIndex];
    const nextPlayerIndex = playerIndex === this.players.length - 1 ? 0 : playerIndex + 1;
    const nextPlayer = this.players[nextPlayerIndex];
    if (!player) {
      return;
    }
    if (!this.status.startsWith(ProcessStatus.PROCESSING)) {
      return;
    }
    if (player.cards.length === 0) {
      return this.stop();
    }
    this.playerId = nextPlayer.id;
    this.nextTime = Date.now() + 24000;
    if (nextPlayer.robot) {
      // 托管状态, 2s后出牌
      this.timer.reset(2000);
    } else {
      this.timer.reset();
    }
    if (emit) this.eventEmitter.emit(GameEvents.NEXT);
  }

  /**
   * 监听
   * @param event
   * @param listener
   */
  addListener(event: string, listener: EventListener) {
    this.eventEmitter.addListener(event, listener);
  }

  /**
   * 移除监听
   * @param event
   * @param listener
   */
  removeListener(event: string, listener: EventListener) {
    this.eventEmitter.removeListener(event, listener);
  }
}
