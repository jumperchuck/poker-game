import React from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import { GameTypes } from '@poker-game/core';
import { useGameTypes } from '@/hooks/useGameTypes';

export interface GameTypeListProps {
  value: GameTypes;
  onChange: (value: GameTypes) => void;
}

const GameTypeList: React.FC<GameTypeListProps> = () => {
  const [gameTypes] = useGameTypes();
  return (
    <ScrollView>
      {gameTypes.map((item) => (
        <View key={item.type} style={{ background: 'red' }}>
          <Text>{item.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default GameTypeList;
