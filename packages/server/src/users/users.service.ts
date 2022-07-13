import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  findOneByIP(ip: string) {
    return this.users.find((user) => user.ipAddress === ip);
  }

  create(user: User) {
    user.id = this.users.push(user);
    return user;
  }

  createByIp(ip: string) {
    const user = this.findOneByIP(ip) || this.create(new User());
    user.ipAddress = ip;
    return user;
  }

  delete(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index > 0) {
      this.users.splice(index, 1);
    }
  }
}
