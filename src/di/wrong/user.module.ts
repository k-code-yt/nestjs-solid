import { Module } from '@nestjs/common';
import { UserService } from './user-mysql.service';
import { UserMySQLRepo } from './user-mysql.repo';

@Module({
  controllers: [],
  providers: [UserService, UserMySQLRepo],
  exports: [UserService],
})
export class UserModule {}
