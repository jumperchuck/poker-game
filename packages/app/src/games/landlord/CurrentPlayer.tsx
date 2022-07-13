import React, { useCallback, useMemo, useState } from 'react';
import { LandlordPoker, PokerCard } from '@poker-game/core';
import Container from '@/components/container';
import PlayerInfo from '@/components/playerInfo';
import PokerCards from '@/components/pokerCards';

import ActionBar from './ActionBar';
import Record from './Record';
import { playCards, discards, grabLandlord, notGrabLandlord } from './api';

export interface CurrentPlayerProps {
  game: API.Game;
  user: API.User;
  player: API.Player;
  onLeave: () => void;
  onReady: (ready: boolean) => void;
}

const landlordPoker = new LandlordPoker();

const CurrentPlayer: React.FC<CurrentPlayerProps> = (props) => {
  const { game, user, player, onLeave, onReady } = props;

  const lastRecord = game.poker.records[game.poker.records.length - 1];

  const [selectedData, setSelectedData] = useState<API.PokerCard[]>([]);

  const onSelect = useCallback((card: API.PokerCard) => {
    setSelectedData((state) => [...state, card]);
  }, []);

  const onCancel = useCallback((card: API.PokerCard) => {
    setSelectedData((state) => {
      const index = state.findIndex(
        (item) => item.type === card.type && item.color === card.color,
      );
      if (index >= 0) state.splice(index, 1);
      return [...state];
    });
  }, []);

  const onPlay = useCallback(async () => {
    await playCards(selectedData);
    setSelectedData([]);
  }, [selectedData]);

  const onPass = useCallback(async () => {
    await discards();
    setSelectedData([]);
  }, []);

  const canPlay = useMemo(() => {
    return (
      landlordPoker.compareCards(
        selectedData as PokerCard[],
        lastRecord ? (lastRecord.cards as PokerCard[]) : false,
      ) > 0
    );
  }, [selectedData, lastRecord]);

  return (
    <Container relative>
      <ActionBar
        game={game}
        player={player}
        onLeave={onLeave}
        onReady={onReady}
        onGrab={grabLandlord}
        onNotGrab={notGrabLandlord}
        onPlay={onPlay}
        onPass={onPass}
        canPlay={canPlay}
      />
      {game.process.playerId !== player.id && (
        <Record
          data={player.records[player.records.length - 1]}
          style={{
            left: '50%',
            top: '-20px',
            transform: 'translate(-50%, -100%)',
          }}
        />
      )}
      <Container row>
        <PlayerInfo name={user.username} />
        <PokerCards
          data={player?.cards || []}
          selectedData={selectedData}
          onSelect={onSelect}
          onCancel={onCancel}
        />
      </Container>
    </Container>
  );
};

export default CurrentPlayer;
