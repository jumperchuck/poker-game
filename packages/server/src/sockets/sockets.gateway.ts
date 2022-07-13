import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameEvents } from '@poker-game/core';
import {
  AddRobotData,
  CreateRoomData,
  GameplayData,
  JoinRoomData,
  LeaveRoomData,
  ReadyStateData,
  SocketEvents,
} from './socket.events';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { GamesService } from '../games/games.service';
import { Result } from '../constants/result';

@WebSocketGateway({ origins: true, credentials: true, cors: true })
export class SocketsGateway {
  @WebSocketServer() server: Server;

  constructor(
    private roomsService: RoomsService,
    private usersService: UsersService,
    private gamesService: GamesService,
  ) {
    setTimeout(() => {
      this.server.on('connection', (client) => {
        const user = this.getUser(client);
        if (user.roomId) {
          client.join(`${user.roomId}`);
        }
      });
    }, 0);
  }

  /**
   * 创建房间
   * @param data
   * @param client
   */
  @SubscribeMessage(SocketEvents.CREATE_ROOM)
  async createRoom(
    @MessageBody() data: CreateRoomData,
    @ConnectedSocket() client: Socket,
  ) {
    Logger.debug({ event: SocketEvents.CREATE_ROOM, data });
    const { roomName, gameType } = data;
    const user = this.getUser(client);
    if (user.roomId) {
      return Result.FAIL.build(user);
    }
    // create room
    const room = this.roomsService.create();
    room.addUser(user);
    room.name = roomName;
    client.join(`${room.id}`);
    // create game
    const game = this.gamesService.createGame(gameType);
    game.addPlayer(this.gamesService.createPlayer(gameType, user.id));
    // game.addListener(GameEvents.START, () => {
    //   this.emitToRoom(room.id, SocketEvents.GAME_START, room);
    // });
    game.addListener(GameEvents.OVER, () => {
      this.emitToRoom(room.id, SocketEvents.GAME_OVER, room);
    });
    game.addListener(GameEvents.PAUSE, () => {
      this.emitToRoom(room.id, SocketEvents.GAME_PAUSE, room);
    });
    game.addListener(GameEvents.RESUME, () => {
      this.emitToRoom(room.id, SocketEvents.GAME_RESUME, room);
    });
    game.addListener(GameEvents.NEXT, () => {
      this.emitToRoom(room.id, SocketEvents.NEXT_ROUND, room);
    });
    room.game = game;
    // emit other user
    return Result.SUCCESS.build(room);
  }

  /**
   * 加入房间
   * @param data
   * @param client
   */
  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  async joinRoom(@MessageBody() data: JoinRoomData, @ConnectedSocket() client: Socket) {
    Logger.debug({ event: SocketEvents.JOIN_ROOM, data });
    const { roomId } = data;
    const user = this.getUser(client);
    if (user.roomId) {
      return Result.FAIL.build(user);
    }
    // set room user
    const room = this.roomsService.findOne(roomId);
    room.addUser(user);
    client.join(`${roomId}`);
    // set game player
    const game = room.game;
    game.addPlayer(this.gamesService.createPlayer(game.type, user.id));
    // emit other user
    this.emitToRoom(roomId, SocketEvents.JOIN_ROOM, room);
    return Result.SUCCESS.build(room);
  }

  /**
   * 离开房间
   * @param data
   * @param client
   */
  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  async leaveRoom(@MessageBody() data: LeaveRoomData, @ConnectedSocket() client: Socket) {
    Logger.debug({ event: SocketEvents.LEAVE_ROOM, data });
    const user = this.getUser(client);
    if (!user.roomId) {
      return Result.FAIL.build(user);
    }
    // remove room user
    const room = this.roomsService.findOne(user.roomId);
    room.removeUser(user);
    client.leave(`${room.id}`);
    if (!room.users.length) {
      this.roomsService.delete(room.id);
    }
    // remove game player
    const game = room.game;
    game.removePlayer(user.id);
    // emit other user
    this.emitToRoom(user.roomId, SocketEvents.LEAVE_ROOM, room);
    return Result.SUCCESS.build(room);
  }

  /**
   * 准备状态
   * @param data
   * @param client
   */
  @SubscribeMessage(SocketEvents.READY_STATE)
  async readyState(
    @MessageBody() data: ReadyStateData,
    @ConnectedSocket() client: Socket,
  ) {
    Logger.debug({ event: SocketEvents.READY_STATE, data });
    const { ready } = data;
    const user = this.getUser(client);
    if (!user.roomId) {
      return Result.FAIL.build(user);
    }
    // set ready
    const room = this.roomsService.findOne(user.roomId);
    const game = room.game;
    game.getPlayer(user.id).ready = ready;
    // all ready to start
    if (
      game.players.reduce((acc, item) => acc + Number(item.ready), 0) === game.maxCount
    ) {
      game.start();
    }
    // emit other user
    this.emitToRoom(user.roomId, SocketEvents.READY_STATE, room);
    return Result.SUCCESS.build(room);
  }

  /**
   * 添加电脑玩家
   * @param data
   * @param client
   */
  @SubscribeMessage(SocketEvents.ADD_ROBOT)
  async addRobot(@MessageBody() data: AddRobotData, @ConnectedSocket() client: Socket) {
    Logger.debug({ event: SocketEvents.ADD_ROBOT, data });
    const { playerIndex } = data;
    const user = this.getUser(client);
    if (!user.roomId) {
      return Result.FAIL.build(user);
    }
    const room = this.roomsService.findOne(user.roomId);
    const game = room.game;
    if (playerIndex < 0 || playerIndex >= game.maxCount) {
      return Result.FAIL;
    }
    if (game.players[playerIndex]) {
      return Result.FAIL;
    }
    game.players[playerIndex] = this.gamesService.createRobot(
      game.type,
      playerIndex - game.maxCount,
    );
    // emit other user
    this.emitToRoom(user.roomId, SocketEvents.ADD_ROBOT, room);
    return Result.SUCCESS.build(room);
  }

  /**
   * 游戏流程 区分不同类型的游戏流程
   * @param data
   * @param client
   */
  @SubscribeMessage(SocketEvents.GAMEPLAY)
  async gameProcess(
    @MessageBody() data: GameplayData,
    @ConnectedSocket() client: Socket,
  ) {
    Logger.debug({ event: SocketEvents.GAMEPLAY, data });
    const user = this.getUser(client);
    if (!user.roomId) {
      return Result.FAIL.build(user);
    }
    const room = this.roomsService.findOne(user.roomId);
    const game = room.game;
    const player = game.getPlayer(user.id);
    if (!this.gamesService.gameplay(game, player, data)) {
      return Result.FAIL.build(user);
    }
    // emit other user
    this.emitToRoom(user.roomId, SocketEvents.NEXT_ROUND, room);
    return Result.SUCCESS.build(room);
  }

  getUser(client: Socket) {
    // const ip = client.handshake.address.replace('::ffff:', '');
    return this.usersService.createByIp(client.handshake.address);
  }

  emitToRoom(roomId: number, event: SocketEvents, ...args: any[]) {
    return this.server.to(`${roomId}`).emit(event, ...args);
  }
}
