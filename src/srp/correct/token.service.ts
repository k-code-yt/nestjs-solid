import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmUser } from '../../entities/user.entity';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(user: TypeOrmUser): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
