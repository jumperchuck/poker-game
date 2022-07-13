import {
  emit,
  CreateRoomData,
  GameplayData,
  JoinRoomData,
  LeaveRoomData,
  ReadyStateData,
  SocketEvents,
  AddRobotData,
} from './socket';
import { get, put } from './request';

export const createRoom = (data: CreateRoomData) => {
  return emit<API.Room>(SocketEvents.CREATE_ROOM, data);
};

export const joinRoom = (data: JoinRoomData) => {
  return emit<API.Room>(SocketEvents.JOIN_ROOM, data);
};

export const leaveRoom = (data: LeaveRoomData) => {
  return emit<API.Result>(SocketEvents.LEAVE_ROOM, data);
};

export const readyState = (data: ReadyStateData) => {
  return emit<API.Room>(SocketEvents.READY_STATE, data);
};

export const addRobot = (data: AddRobotData) => {
  return emit<API.Room>(SocketEvents.ADD_ROBOT, data);
};

export const gameplay = (data: GameplayData) => {
  return emit<API.Room>(SocketEvents.GAMEPLAY, data);
};

export const queryRooms = () => {
  return get<API.Room[]>('/rooms');
};

export const queryRoom = (roomId: number) => {
  return get<API.Room>(`/rooms/${roomId}`);
};

export const queryUsers = () => {
  return get<API.User[]>('/users');
};

export const queryUser = (userId: number | 'info') => {
  return get<API.User>(`/users/${userId}`);
};

export const updateUser = (userId: number | 'info', data: { username: string }) => {
  return put<API.User>(`/users/${userId}`, data);
};
