import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { useUserInfo } from '@/hooks/useUserInfo';
import Container from '@/components/container';

import Username from './components/username';

const jumpToHome = () => {
  Taro.redirectTo({
    url: '/pages/home',
  });
};

const Index: React.FC = () => {
  const [userInfo] = useUserInfo();

  return (
    <Container full center>
      <Text>扑克游戏</Text>
      <View>
        <Username value={userInfo.username} onChange={userInfo.updateInfo} />
        <Button onClick={jumpToHome}>进入游戏</Button>
      </View>
    </Container>
  );
};

export default Index;
