import { Module } from '@nestjs/common';
import { SocketsModule } from './sockets/sockets.module';
import { GamesModule } from './games/games.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SocketsModule, GamesModule, RoomsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
