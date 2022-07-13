import React from 'react';
import { Text } from '@tarojs/components';

import Container, { ContainerProps } from '../container';
import styles from './index.module.less';

export interface PlayerInfoProps extends ContainerProps {
  name: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = (props) => {
  const { name, ...rest } = props;
  return (
    <Container className={styles.container} center {...rest}>
      <Text>{name}</Text>
    </Container>
  );
};

export default PlayerInfo;
