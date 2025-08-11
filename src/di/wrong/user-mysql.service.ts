import { Injectable } from '@nestjs/common';
import { UserMySQLRepo } from './user-mysql.repo';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserMySQLRepo) {}

  async create(userData: CreateUserDto) {
    return this.userRepo.create(userData);
  }

  async update(id: number, userData: UpdateUserDto) {
    return this.userRepo.update(id, userData);
  }
}
