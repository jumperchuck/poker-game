import React, { useEffect } from 'react';
import { Text } from '@tarojs/components';
import { GameTypes } from '@poker-game/core';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useRoomInfo } from '@/hooks/useRoomInfo';

import Landlord from '@/games/landlord';
import Container from '@/components/container';

const Room: React.FC = () => {
  const [userInfo] = useUserInfo();
  const [roomInfo] = useRoomInfo();
  const { game } = roomInfo;

  useEffect(() => {
    roomInfo.queryInfo();
  }, []);

  switch (game.type) {
    case GameTypes.LANDLORD:
      return <Landlord userInfo={userInfo} roomInfo={roomInfo} />;
  }

  return (
    <Container full center>
      <Text>加载中...</Text>
    </Container>
  );
};

export default Room;
