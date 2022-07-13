import { Module } from '@nestjs/common';
import { GamesService } from './games.service';

@Module({
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
