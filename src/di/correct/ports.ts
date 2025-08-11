import { CreateUserDto, UpdateUserDto } from './dtos';
import { User } from './user';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
}
