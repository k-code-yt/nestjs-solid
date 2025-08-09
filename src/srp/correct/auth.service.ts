import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordService } from './password.service';
import { ActivityLoggerService } from './logger.service';
import { TokenService } from './token.service';

// Independent changes || code does not break on changes
// Testable
// Teams can work in parallel
// We have more lines of code, but code is more readable and maintanable
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private activityLogger: ActivityLoggerService,
    private tokenService: TokenService,
  ) {}

  async login(email: string, password: string) {
    this.activityLogger.logLoginAttempt(email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.activityLogger.logLoginFailure(email, 'User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.passwordService.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      this.activityLogger.logLoginFailure(user.email, 'Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.userRepository.updateLastLogin(user.id);
    this.activityLogger.logLoginSuccess(user.email);

    const accessToken = this.tokenService.generateAccessToken(user);
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
