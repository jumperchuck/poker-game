import React, { useState } from 'react';
import { Text } from '@tarojs/components';
import { useInterval } from 'react-use';

import Container from '../container';

export interface RoundTimeProps {
  endTime: number;
}

const RoundTime: React.FC<RoundTimeProps> = (props) => {
  const { endTime } = props;
  const [_, setState] = useState({});
  useInterval(() => {
    setState({});
  }, 1000);
  return (
    <Container>
      <Text>{Math.ceil((endTime - Date.now()) / 1000)}</Text>
    </Container>
  );
};

export default RoundTime;
