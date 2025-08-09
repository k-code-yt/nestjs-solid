import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ActivityLoggerService {
  private readonly logger = new Logger(ActivityLoggerService.name);

  logLoginAttempt(email: string): void {
    this.logger.log(`Login attempt for: ${email}`);
  }

  logLoginSuccess(email: string): void {
    this.logger.log(`Successful login for: ${email}`);
  }

  logLoginFailure(email: string, reason: string): void {
    this.logger.warn(`Failed login for ${email}: ${reason}`);
  }

  logAccountLocked(email: string): void {
    this.logger.warn(`Account locked for: ${email}`);
  }
}
