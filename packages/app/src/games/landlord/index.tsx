import React, { useCallback } from 'react';
import Container from '@/components/container';
import { useRoomInfo } from '@/hooks/useRoomInfo';

import CurrentPlayer from './CurrentPlayer';
import OtherPlayer from './OtherPlayer';

export interface LandlordProps {
  userInfo: API.User;
  roomInfo: API.Room;
}

const Landlord: React.FC<LandlordProps> = (props) => {
  const { userInfo, roomInfo } = props;
  const { users, game } = roomInfo;

  const currentIndex = game.players.findIndex((item) => item.id === userInfo.id);
  const leftIndex = currentIndex === game.maxCount - 1 ? 0 : currentIndex + 1;
  const rightIndex = currentIndex === 0 ? game.maxCount - 1 : currentIndex - 1;

  const currentUser = userInfo;
  const currentPlayer = game.players[currentIndex];
  const leftUser = users[leftIndex];
  const leftPlayer = game.players[leftIndex];
  const rightUser = users[rightIndex];
  const rightPlayer = game.players[rightIndex];

  const onAddLeftRobot = useCallback(() => {
    useRoomInfo.getState().addRobot(leftIndex);
  }, [leftIndex]);

  const onAddRightRobot = useCallback(() => {
    useRoomInfo.getState().addRobot(rightIndex);
  }, [rightIndex]);

  return (
    <Container full center>
      <Container full flex row>
        <OtherPlayer
          game={game}
          user={leftUser}
          player={leftPlayer}
          onAddRobot={onAddLeftRobot}
          style={{ alignItems: 'start' }}
        />
        <OtherPlayer
          game={game}
          user={rightUser}
          player={rightPlayer}
          onAddRobot={onAddRightRobot}
          style={{ alignItems: 'end' }}
          recordStyle={{
            left: 'auto',
            right: '130px',
          }}
        />
      </Container>
      <CurrentPlayer
        game={game}
        user={currentUser}
        player={currentPlayer}
        onLeave={useRoomInfo.getState().leaveRoom}
        onReady={useRoomInfo.getState().readyState}
      />
    </Container>
  );
};

export default Landlord;
