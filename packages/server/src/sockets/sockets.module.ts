import { Module } from '@nestjs/common';

import { SocketsGateway } from './sockets.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [RoomsModule, UsersModule, GamesModule],
  providers: [SocketsGateway],
})
export class SocketsModule {}
