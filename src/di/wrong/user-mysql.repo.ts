import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UserMySQLRepo implements OnModuleDestroy {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  async getConnection(): Promise<DataSource> {
    return this.manager.connection;
  }

  async create(userData: any) {
    const conn = await this.getConnection();

    const query = `
      INSERT INTO users (name, email, created_at) 
      VALUES (?, ?, NOW())
    `;

    const [result] = await conn.query(query, [userData.name, userData.email]);

    return result;
  }

  async update(id: number, userData: any) {
    const conn = await this.getConnection();

    const query = `
      UPDATE users 
      SET name = ?, email = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    const [result] = await conn.query(query, [
      userData.name,
      userData.email,
      id,
    ]);

    return result;
  }

  async onModuleDestroy() {
    const connection = this.manager.connection;
    await connection.destroy();
    console.log('Database connection closed');
  }
}
