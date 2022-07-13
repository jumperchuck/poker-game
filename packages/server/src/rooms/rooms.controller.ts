import { Controller, Get, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get('')
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(Number(id));
  }
}
