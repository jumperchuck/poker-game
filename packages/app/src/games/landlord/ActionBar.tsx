import React from 'react';
import { Button } from '@tarojs/components';
import { LandlordProcessStatus, ProcessStatus } from '@poker-game/core';
import Container from '@/components/container';
import RoundTime from '@/components/roundTime';

export interface ActionBarProps {
  game: API.Game;
  player: API.Player;
  canPlay: boolean;
  onLeave: () => void;
  onReady: (ready: boolean) => void;
  onGrab: () => void;
  onNotGrab: () => void;
  onPlay: () => void;
  onPass: () => void;
}

const ActionBar: React.FC<ActionBarProps> = (props) => {
  const { game, player, canPlay, onLeave, onReady, onGrab, onNotGrab, onPlay, onPass } =
    props;
  const { process } = game;

  if (process.status === ProcessStatus.PREPARING) {
    return (
      <Container row center style={{ height: '50px' }}>
        <Button onClick={onLeave}>离开</Button>
        <Button onClick={() => onReady(!player.ready)}>
          {player.ready ? '取消准备' : '准备'}
        </Button>
      </Container>
    );
  }

  return (
    <Container
      row
      center
      absolute
      style={{
        height: '50px',
        left: '50%',
        top: '-20px',
        transform: 'translate(-50%, -100%)',
      }}
    >
      {game.process.playerId === player.id && (
        <>
          <RoundTime endTime={game.process.nextTime} />
          {game.process.status === LandlordProcessStatus.LANDLORD && (
            <>
              <Button onClick={onGrab} style={{ width: '100px' }}>
                抢地主
              </Button>
              <Button onClick={onNotGrab} style={{ width: '100px' }}>
                不抢
              </Button>
            </>
          )}
          {game.process.status === ProcessStatus.PROCESSING && (
            <Container row>
              <Button onClick={onPlay} style={{ width: '100px' }} disabled={!canPlay}>
                出牌
              </Button>
              <Button onClick={onPass} style={{ width: '100px' }}>
                不出
              </Button>
            </Container>
          )}
        </>
      )}
    </Container>
  );
};

export default ActionBar;
