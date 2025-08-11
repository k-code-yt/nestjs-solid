import { IUserRepository } from './ports';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { User } from './user';
import { plainToInstance } from 'class-transformer';
import { TypeOrmUser } from '../../entities/user.entity';

@Injectable()
export class UserMySQLRepo implements IUserRepository, OnModuleDestroy {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  async getConnection(): Promise<DataSource> {
    return this.manager.connection;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const conn = await this.getConnection();

    const query = `
      INSERT INTO users (name, email, created_at) 
      VALUES (?, ?, NOW())
    `;

    const [result] = await conn.query<[TypeOrmUser]>(query, [
      userData.name,
      userData.email,
    ]);

    return this.mapToDomain(result);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const conn = await this.getConnection();

    const query = `
      UPDATE users 
      SET name = ${userData.name}, email = ${userData.email}, updated_at = NOW() 
      WHERE id = ${id}
    `;

    const [result] = await conn.query<[TypeOrmUser]>(query, [
      userData.name,
      userData.email,
      id,
    ]);

    return this.mapToDomain(result);
  }

  private mapToDomain(result: TypeOrmUser) {
    const user = plainToInstance(User, result);
    return user;
  }

  async onModuleDestroy() {
    const connection = this.manager.connection;
    await connection.destroy();
    console.log('Database connection closed');
  }
}
