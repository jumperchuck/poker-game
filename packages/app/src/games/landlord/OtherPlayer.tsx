import React from 'react';
import { Button, Text } from '@tarojs/components';
import { ProcessStatus } from '@poker-game/core';
import Container, { ContainerProps } from '@/components/container';
import PlayerInfo from '@/components/playerInfo';
import RoundTime from '@/components/roundTime';
import Record from '@/games/landlord/Record';

export interface OtherPlayerProps extends ContainerProps {
  game: API.Game;
  user: API.User;
  player: API.Player;
  onAddRobot: () => void;
  recordStyle?: React.CSSProperties;
}

const OtherPlayer: React.FC<OtherPlayerProps> = (props) => {
  const { game, user, player, onAddRobot, recordStyle, ...rest } = props;

  if (!player) {
    return (
      <Container flex center {...rest}>
        <Container>
          <PlayerInfo name="+" onClick={onAddRobot} />
          <Text>等待加入</Text>
        </Container>
      </Container>
    );
  }

  if (game.process.status === ProcessStatus.PREPARING) {
    return (
      <Container flex center {...rest}>
        <Container>
          <PlayerInfo name={player.robot ? '托管' : user.username} />
          {player.ready ? <Button>已准备</Button> : null}
        </Container>
      </Container>
    );
  }

  return (
    <Container relative flex center {...rest}>
      <Container>
        <PlayerInfo name={player.robot ? '托管' : user.username} />
        <Button>剩余{player.cards.length}</Button>
      </Container>
      {game.process.playerId === player.id && (
        <RoundTime endTime={game.process.nextTime} />
      )}
      {game.process.playerId !== player.id && (
        <Record
          data={player.records[player.records.length - 1]}
          style={{
            left: '130px',
            top: '50%',
            transform: 'translateY(-50%)',
            ...recordStyle,
          }}
        />
      )}
    </Container>
  );
};

export default OtherPlayer;
