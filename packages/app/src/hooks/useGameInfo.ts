import { useRoomInfo } from '@/hooks/useRoomInfo';

export const useGameInfo = () => {
  const [gameInfo] = useRoomInfo((state) => state.game);

  return {
    gameInfo,
  };
};
