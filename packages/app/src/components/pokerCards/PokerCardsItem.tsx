import React from 'react';
import { PokerCardColors } from '@poker-game/core';
import { Text } from '@tarojs/components';

import Container, { ContainerProps } from '../container';
import styles from './index.module.less';

export interface PokerCardsItemProps extends ContainerProps {
  type: string;
  color: number;
}

const getColor = (color: number) => {
  switch (color) {
    case PokerCardColors.CLUB:
    case PokerCardColors.SPADE:
    case PokerCardColors.BLACK:
      return 'black';
    case PokerCardColors.DIAMOND:
    case PokerCardColors.HEART:
    case PokerCardColors.RED:
      return 'red';
  }
};

const colorLabels = {
  [PokerCardColors.CLUB]: '♣️',
  [PokerCardColors.DIAMOND]: '♦️',
  [PokerCardColors.SPADE]: '♠️',
  [PokerCardColors.HEART]: '♥️',
};

const PokerCardsItem: React.FC<PokerCardsItemProps> = (props) => {
  const { type, color: colorProp, ...rest } = props;
  const color = getColor(colorProp);
  return (
    <Container className={styles.pokerCardsItem} {...rest}>
      <Text style={{ color, wordWrap: 'break-word' }}>{type}</Text>
      <Text style={{ color }}>{colorLabels[colorProp]}</Text>
    </Container>
  );
};

export default PokerCardsItem;
