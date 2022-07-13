import { Injectable } from '@nestjs/common';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  private rooms: Room[] = [];

  findAll() {
    return this.rooms;
  }

  findOne(id: number) {
    return this.rooms.find((room) => room.id === id);
  }

  create(room?: Room) {
    room = room || new Room();
    room.id = this.rooms.push(room);
    return room;
  }

  delete(id: number) {
    const index = this.rooms.findIndex((room) => room.id === id);
    if (index >= 0) {
      this.rooms.splice(index, 1);
    }
  }
}
