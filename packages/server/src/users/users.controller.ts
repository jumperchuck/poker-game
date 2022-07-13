import { Request } from 'express';
import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    if (id === 'info') {
      return this.userService.createByIp(request.ip);
    }
    return this.userService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() body: { username: string },
  ) {
    const user =
      id === 'info'
        ? this.userService.findOneByIP(request.ip)
        : this.userService.findOne(Number(id));
    if (user) {
      user.username = body.username;
      return user;
    }
    return false;
  }
}
