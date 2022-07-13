import { GameFactory, LandlordPlayer, LandlordProcessStatus } from '../src';

describe('create', function () {
  it('test 1', function () {
    const game = GameFactory.landlordGame();
    game.players.push(new LandlordPlayer(0));
    game.players.push(new LandlordPlayer(1));
    game.players.push(new LandlordPlayer(2));
    game.start();

    expect(game.process.status).toBe(LandlordProcessStatus.LANDLORD);
  });
});
