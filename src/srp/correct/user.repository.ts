import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmUser } from '../../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private repository: Repository<TypeOrmUser>,
  ) {}

  async findByEmail(email: string): Promise<TypeOrmUser | null> {
    return this.repository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.repository.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}
