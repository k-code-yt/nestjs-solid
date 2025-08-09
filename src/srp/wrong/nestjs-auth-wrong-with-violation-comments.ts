import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

// ###VIOLATIONS###
// ----Multiple Reasons to Change---
// - Database schema changes
// - Auth provider/JWT configuration changes
// - Rate limiting rules change
// - Logging requirements change
// - Login business rules change -> should be only this one!
@Injectable()
export class AuthService {
  constructor(
    // What if we change schema?
    // What if we change DB to Mongo?
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // What if we will use other token service?
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log(`Login attempt for: ${email} at ${new Date()}`);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      console.log(`Failed login - user not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // What if switch bcrypt?
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Login rate limit exceeded');
    }

    await this.userRepository.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    // what if want to use a package for logging or external service
    await this.logUserActivity(user.id, 'login', {
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

  private async logUserActivity(userId: string, action: string, metadata: any) {
    console.log(`User Activity: ${userId} - ${action}`, metadata);
  }
}
