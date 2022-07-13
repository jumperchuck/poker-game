import { createState } from 'shuttle-state';
import { GameTypes } from '@poker-game/core';

export const useGameTypes = createState([{ type: GameTypes.LANDLORD, name: '斗地主' }]);
