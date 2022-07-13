import React from 'react';
import { Text } from '@tarojs/components';
import { LandlordRecordTypes, PokerRecordTypes } from '@poker-game/core';
import Container, { ContainerProps } from '@/components/container';
import PokerCards from '@/components/pokerCards';

export interface RecordProps extends ContainerProps {
  data?: API.PokerRecord;
}

const Record: React.FC<RecordProps> = (props) => {
  const { data, ...rest } = props;

  if (!data) return null;

  const { type, cards } = data;

  if (type === PokerRecordTypes.PLAY_CARDS) {
    return (
      <Container absolute {...rest}>
        <PokerCards data={cards} />
      </Container>
    );
  }

  if (type === PokerRecordTypes.DISCARDS) {
    return (
      <Container absolute {...rest}>
        <Text>不出</Text>
      </Container>
    );
  }

  if (type === LandlordRecordTypes.GRAB_LANDLORD) {
    return (
      <Container absolute {...rest}>
        <Text>抢地主</Text>
      </Container>
    );
  }

  if (type === LandlordRecordTypes.NOT_GRAB_LANDLORD) {
    return (
      <Container absolute {...rest}>
        <Text>不抢</Text>
      </Container>
    );
  }

  return <Container absolute {...rest} />;
};

export default Record;
