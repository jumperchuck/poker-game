import React from 'react';
import { Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';

import Container from '@/components/container';
import { useUserInfo } from '@/hooks/useUserInfo';
import './app.less';
import './global';

const App: React.FC = (props) => {
  const [userInfo] = useUserInfo();

  useDidShow(() => {
    userInfo.queryInfo();
  });

  const page = <Container>{props.children}</Container>;

  const loading = userInfo.id ? null : (
    <Container full center>
      <Text>正在加载ing...</Text>
    </Container>
  );

  return (
    <>
      {page}
      {loading}
    </>
  );
};

export default App;
