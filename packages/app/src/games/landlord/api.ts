import { LandlordRecordTypes, PokerRecordTypes } from '@poker-game/core';
import { emit, SocketEvents } from '@/services/socket';
import { useRoomInfo } from '@/hooks/useRoomInfo';

export const playCards = async (cards: API.PokerCard[]) => {
  const { data: result } = await emit<API.Room>(SocketEvents.GAMEPLAY, {
    type: PokerRecordTypes.PLAY_CARDS,
    cards,
  });
  useRoomInfo.setState((state) => ({ ...state, ...result }));
  return result;
};

export const discards = async () => {
  const { data: result } = await emit<API.Room>(SocketEvents.GAMEPLAY, {
    type: PokerRecordTypes.DISCARDS,
    cards: [],
  });
  useRoomInfo.setState((state) => ({ ...state, ...result }));
  return result;
};

export const drawCards = async (quantity: number) => {
  const { data: result } = await emit<API.Room>(SocketEvents.GAMEPLAY, {
    type: PokerRecordTypes.DRAW_CARDS,
    quantity,
  });
  useRoomInfo.setState((state) => ({ ...state, ...result }));
  return result;
};

export const grabLandlord = async () => {
  const { data: result } = await emit<API.Room>(SocketEvents.GAMEPLAY, {
    type: LandlordRecordTypes.GRAB_LANDLORD,
  });
  useRoomInfo.setState((state) => ({ ...state, ...result }));
  return result;
};

export const notGrabLandlord = async () => {
  const { data: result } = await emit<API.Room>(SocketEvents.GAMEPLAY, {
    type: LandlordRecordTypes.NOT_GRAB_LANDLORD,
  });
  useRoomInfo.setState((state) => ({ ...state, ...result }));
  return result;
};
