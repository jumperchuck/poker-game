import { Game } from '@poker-game/core';
import { User } from '../users/user.entity';

export class Room {
  id: number;

  name: string;

  users: User[] = [];

  game: Game;

  addUser(user: User) {
    const index = this.users.indexOf(user);
    if (index < 0) this.users.push(user);
    user.roomId = this.id;
  }

  removeUser(user: User) {
    const index = this.users.indexOf(user);
    if (index >= 0) this.users.splice(index, 1);
    user.roomId = null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      users: this.users,
      game: {
        ...this.game,
        process: {
          startTime: this.game.process.startTime,
          endTime: this.game.process.endTime,
          pauseTime: this.game.process.pauseTime,
          resumeTime: this.game.process.resumeTime,
          status: this.game.process.status,
          nextTime: this.game.process.nextTime,
          playerId: this.game.process.playerId,
        },
      },
    };
  }
}
