import React from 'react';

import Container from '../container';
import PokerCardsItem from './PokerCardsItem';

export interface PokerCardsProps {
  data: API.PokerCard[];
  selectedData?: API.PokerCard[];
  onSelect?: (card: API.PokerCard) => void;
  onCancel?: (card: API.PokerCard) => void;
}

const PokerCards: React.FC<PokerCardsProps> = (props) => {
  const { data, selectedData, onSelect, onCancel } = props;
  return (
    <Container row center>
      {data.map((item, index) => {
        const selected = selectedData?.indexOf(item) >= 0;
        return (
          <PokerCardsItem
            key={index}
            type={item.type}
            color={item.color}
            style={{
              marginLeft: index > 0 ? '-15px' : 0,
              marginTop: selected ? '-20px' : 0,
            }}
            onClick={() => {
              selected ? onCancel?.(item) : onSelect?.(item);
            }}
          />
        );
      })}
    </Container>
  );
};

export default PokerCards;
