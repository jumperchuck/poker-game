import React from 'react';
import { Button, View } from '@tarojs/components';
import { GameTypes } from '@poker-game/core';
import { useRoomInfo } from '@/hooks/useRoomInfo';

export interface FooterProps {
  gameType: GameTypes;
}

const Footer: React.FC<FooterProps> = (props) => {
  const { gameType } = props;
  const [roomInfo] = useRoomInfo();
  const onCreate = () => {
    roomInfo.createRoom({
      roomName: 'sbb is my son',
      gameType,
    });
  };
  return (
    <View>
      <Button onClick={onCreate}>创建房间</Button>
    </View>
  );
};

export default Footer;
