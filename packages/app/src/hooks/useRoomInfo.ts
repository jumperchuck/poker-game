import { createState } from 'shuttle-state';
import { devtools } from 'shuttle-state/middleware';
import {
  addRobot,
  createRoom,
  joinRoom,
  leaveRoom,
  queryRoom,
  readyState,
} from '@/services/api';
import { CreateRoomData, JoinRoomData } from '@/services/socket';
import { useUserInfo } from './useUserInfo';

export const useRoomInfo = createState({
  id: 0,
  name: '',
  users: [] as API.User[],
  game: {
    type: '',
    poker: {
      cards: [],
      records: [],
      cardWeights: [],
    },
    players: [],
    process: {
      status: '',
      startTime: 0,
      endTime: 0,
      pauseTime: 0,
      resumeTime: 0,
      nextTime: 0,
      playerId: 0,
    },
    maxCount: 3,
  } as API.Game,

  queryInfo: async () => {
    const { data: result } = await queryRoom(useUserInfo.getState().roomId);
    useRoomInfo.setState((state) => ({ ...state, ...result }));
    return result;
  },
  createRoom: async (data: CreateRoomData) => {
    const { data: result } = await createRoom(data);
    useRoomInfo.setState((state) => ({ ...state, ...result }));
    useUserInfo.setState((state) => ({ ...state, roomId: result.id }));
    return result;
  },
  joinRoom: async (data: JoinRoomData) => {
    const { data: result } = await joinRoom(data);
    useRoomInfo.setState((state) => ({ ...state, ...result }));
    useUserInfo.setState((state) => ({ ...state, roomId: result.id }));
    return result;
  },
  leaveRoom: async () => {
    const { data: result } = await leaveRoom({ roomId: useUserInfo.getState().id });
    useRoomInfo.resetState();
    useUserInfo.setState((state) => ({ ...state, roomId: 0 }));
    return result;
  },
  readyState: async (ready: boolean) => {
    const { data: result } = await readyState({ ready });
    useRoomInfo.setState((state) => ({ ...state, ...result }));
    return result;
  },
  addRobot: async (playerIndex: number) => {
    const { data: result } = await addRobot({ playerIndex });
    useRoomInfo.setState((state) => ({ ...state, ...result }));
    return result;
  },
});

useRoomInfo.use(devtools('room-info'));
