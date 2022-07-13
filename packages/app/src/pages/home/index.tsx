import React, { useState } from 'react';
import { Text } from '@tarojs/components';
import { GameTypes } from '@poker-game/core';

import Container from '@/components/container';
import GameTypeList from './components/GameTypeList';
import RoomList from './components/RoomList';
import Footer from './components/Footer';

const Home: React.FC = () => {
  const [gameType, setGameType] = useState(GameTypes.LANDLORD);
  return (
    <Container full>
      <Text>房间</Text>
      <Container flex row>
        <Container flex={1}>
          <GameTypeList value={gameType} onChange={setGameType} />
        </Container>
        <Container flex={3}>
          <RoomList gameType={gameType} />
        </Container>
      </Container>
      <Footer gameType={gameType} />
    </Container>
  );
};

export default Home;
