import { createState } from 'shuttle-state';
import { queryRooms } from '@/services/api';

export const useRoomList = createState({
  data: [] as API.Room[],

  queryList: async () => {
    const result = await queryRooms();
    useRoomList.setState((state) => ({ ...state, data: result.data }));
    return result;
  },
});
