import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

// 1. typeorm -> prisam. SQL -> MONGO
// 2. teamlead -> I need unit tests
// 3. 2 team or more
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      console.log(`Failed login - user not found: ${email}`);
      throw new UnauthorizedException('Failed auth');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    // auth-failed-flow
    if (!isValidPassword) {
      throw new UnauthorizedException('Failed auth');
    }

    // auth-success-flow
    await this.userRepository.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    console.log(`Successful login for user: ${email}`);
    this.logUserActivity(user.id, 'login', {
      ip: 'TODO: get from request',
      userAgent: 'TODO: get from request',
      timestamp: new Date(),
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private logUserActivity(userId: string, action: string, metadata: any) {
    console.log(`User Activity: ${userId} - ${action}`, metadata);
  }
}
