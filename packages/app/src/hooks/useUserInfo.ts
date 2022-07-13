import { createState } from 'shuttle-state';
import Taro from '@tarojs/taro';
import { queryUser, updateUser } from '@/services/api';

export const useUserInfo = createState({
  id: 0,
  username: '无名大侠',
  ipAddress: '',
  roomId: 0,

  queryInfo: async () => {
    const result = await queryUser('info');
    useUserInfo.setState((state) => ({ ...state, ...result.data }));
    return result;
  },
  updateInfo: async (username: string) => {
    const result = await updateUser('info', { username });
    useUserInfo.setState((state) => ({ ...state, ...result.data }));
    return result;
  },
});

const onRoomIdChange = (roomId: number) => {
  const pages = Taro.getCurrentPages();
  const page = pages[pages.length - 1];
  if (roomId) {
    if (!page.route.includes('/room')) {
      Taro.redirectTo({
        url: '/pages/room',
      });
    }
  } else {
    if (page.route.includes('/room')) {
      Taro.redirectTo({
        url: '/pages/home',
      });
    }
  }
};

useUserInfo.subscribe((state) => {
  const pages = Taro.getCurrentPages();
  if (!pages.length) {
    setTimeout(() => {
      onRoomIdChange(state.roomId);
    }, 50);
  } else {
    onRoomIdChange(state.roomId);
  }
});
