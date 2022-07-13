import { GameTypes, PokerCard, PokerRecordTypes } from '@poker-game/core';

export enum SocketEvents {
  /**
   * 创建房间
   */
  CREATE_ROOM = 'create-room',

  /**
   * 加入房间
   */
  JOIN_ROOM = 'join-room',

  /**
   * 离开房间
   */
  LEAVE_ROOM = 'leave-room',

  /**
   * 准备状态
   */
  READY_STATE = 'ready-state',

  /**
   * 添加电脑人
   */
  ADD_ROBOT = 'add-robot',

  /**
   * 下个回合
   */
  NEXT_ROUND = 'next-round',

  /**
   * 游戏开始
   */
  GAME_START = 'game-start',

  /**
   * 游戏结束
   */
  GAME_OVER = 'game-over',

  /**
   * 游戏暂停
   */
  GAME_PAUSE = 'game-pause',

  /**
   * 游戏恢复
   */
  GAME_RESUME = 'game-resume',

  /**
   * 游戏流程
   */
  GAMEPLAY = 'gameplay',
}

export type CreateRoomData = {
  roomName: string;
  gameType: GameTypes;
};

export type JoinRoomData = {
  roomId: number;
};

export type LeaveRoomData = {
  roomId: number;
};

export type ReadyStateData = {
  ready: boolean;
};

export type AddRobotData = {
  playerIndex: number;
};

export type GameplayData =
  | {
      type: PokerRecordTypes.PLAY_CARDS;
      cards: PokerCard[];
    }
  | {
      type: PokerRecordTypes.DISCARDS;
      cards: PokerCard[];
    }
  | {
      type: PokerRecordTypes.DRAW_CARDS;
      quantity: number;
    }
  | {
      type: string;
      [key: string]: any;
    };
