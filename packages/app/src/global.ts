import { on, SocketEvents } from './services/socket';
import { useRoomInfo } from './hooks/useRoomInfo';

on(SocketEvents.JOIN_ROOM, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.LEAVE_ROOM, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.READY_STATE, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.GAME_START, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.GAME_OVER, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.GAME_PAUSE, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.GAME_RESUME, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});

on(SocketEvents.NEXT_ROUND, (data) => {
  useRoomInfo.setState((state) => ({ ...state, ...data }));
});
