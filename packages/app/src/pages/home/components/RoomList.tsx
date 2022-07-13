import React, { useEffect, useMemo } from 'react';
import { ScrollView, Text } from '@tarojs/components';
import { GameTypes } from '@poker-game/core';
import { useRoomList } from '@/hooks/useRoomList';
import { useRoomInfo } from '@/hooks/useRoomInfo';
import Container from '@/components/container';

export interface RoomListProps {
  gameType: GameTypes;
}

const RoomList: React.FC<RoomListProps> = (props) => {
  const { gameType } = props;
  const [roomList] = useRoomList();
  const [joinRoom] = useRoomInfo((state) => state.joinRoom);

  const data = useMemo(() => {
    return roomList.data.filter((item) => item.game.type === gameType);
  }, [roomList.data, gameType]);

  useEffect(() => {
    roomList.queryList();
  }, []);

  return (
    <>
      <Container row>
        <Text style={{ flex: 1 }}>ID</Text>
        <Text style={{ flex: 1.5 }}>房间名</Text>
        <Text style={{ flex: 1.5 }}>人数</Text>
        <Text style={{ flex: 1.5 }}>状态</Text>
      </Container>
      <ScrollView>
        {data.map((item) => (
          <Container key={item.id} row onClick={() => joinRoom({ roomId: item.id })}>
            <Text style={{ flex: 1 }}>{item.id}</Text>
            <Text style={{ flex: 1.5 }}>{item.name}</Text>
            <Text style={{ flex: 1.5 }}>{item.users.length}</Text>
            <Text style={{ flex: 1.5 }}>{item.game.process.status}</Text>
          </Container>
        ))}
      </ScrollView>
    </>
  );
};

export default RoomList;
