import { Injectable } from '@nestjs/common';
import { UserMySQLRepo } from './user-mysql.repo';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserMySQLRepo) {}

  async createUser(userData: CreateUserDto) {
    return this.userRepo.create(userData);
  }

  async updateUser(id: string, userData: UpdateUserDto) {
    return this.userRepo.update(id, userData);
  }
}
