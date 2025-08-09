import { describe, beforeEach, it } from 'node:test';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { UserRepository } from './user.repository';
import { ActivityLoggerService } from './logger.service';
import { TokenService } from './token.service';

interface MockFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  mockResolvedValue(value: Awaited<ReturnType<T>>): this;
  mockReturnValue(value: ReturnType<T>): this;
  mockImplementation(fn: T): this;
  mockReset(): this;
  mockClear(): this;
}

function createMockFunction<
  T extends (...args: any[]) => any,
>(): MockFunction<T> {
  const mockFn = (() => {}) as any;
  mockFn.mockResolvedValue = (value: any) => {
    mockFn._mockResolvedValue = value;
    return mockFn;
  };
  mockFn.mockReturnValue = (value: any) => {
    mockFn._mockReturnValue = value;
    return mockFn;
  };
  mockFn.mockImplementation = (fn: T) => {
    mockFn._mockImplementation = fn;
    return mockFn;
  };
  mockFn.mockReset = () => {
    delete mockFn._mockResolvedValue;
    delete mockFn._mockReturnValue;
    delete mockFn._mockImplementation;
    return mockFn;
  };
  mockFn.mockClear = () => mockFn.mockReset();

  const wrappedFn = ((...args: any[]) => {
    if (mockFn._mockImplementation) {
      return mockFn._mockImplementation(...args);
    }
    if (mockFn._mockResolvedValue !== undefined) {
      return Promise.resolve(mockFn._mockResolvedValue);
    }
    if (mockFn._mockReturnValue !== undefined) {
      return mockFn._mockReturnValue;
    }
    return undefined;
  }) as MockFunction<T>;

  Object.assign(wrappedFn, mockFn);
  return wrappedFn;
}

type Mocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? MockFunction<T[K]>
    : T[K];
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Mocked<UserRepository>;
  let passwordService: Mocked<PasswordService>;
  let activityLogger: any;
  let tokenService: any;

  // Mock user object
  const mockUser = {
    id: '1',
    email: 'test@test.com',
    firstName: 'kos',
    password: 'hashedPassword',
    lastLoginAt: new Date(),
  };

  beforeEach(() => {
    const mockUserRepository = {
      findByEmail: createMockFunction(),
      updateLastLogin: createMockFunction(),
    } as Mocked<UserRepository>;

    const mockPasswordService = {
      compare: createMockFunction(),
      hash: createMockFunction(),
    } as Mocked<PasswordService>;

    const mockActivityLogger = {
      logLoginAttempt: createMockFunction(),
      logLoginFailure: createMockFunction(),
      logLoginSuccess: createMockFunction(),
    };

    const mockTokenService = {
      generateAccessToken: createMockFunction(),
      generateRefreshToken: createMockFunction(),
      verifyToken: createMockFunction(),
    };

    userRepository = mockUserRepository;
    passwordService = mockPasswordService;
    activityLogger = mockActivityLogger;
    tokenService = mockTokenService;

    authService = new AuthService(
      userRepository as unknown as UserRepository,
      passwordService as unknown as PasswordService,
      activityLogger as unknown as ActivityLoggerService,
      tokenService as unknown as TokenService,
    );
  });

  it('should login successfully with valid credentials', async () => {
    const mockToken = 'mock-jwt-token';

    userRepository.findByEmail.mockResolvedValue(mockUser);
    passwordService.compare.mockResolvedValue(true);
    tokenService.generateAccessToken.mockReturnValue(mockToken);

    const result = await authService.login('test@test.com', 'password');

    expect(result.access_token).toBe(mockToken);
    expect(result.user.id).toBe(mockUser.id);
    expect(result.user.email).toBe(mockUser.email);

    expect(activityLogger.logLoginAttempt).toHaveBeenCalledWith(
      'test@test.com',
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(passwordService.compare).toHaveBeenCalledWith(
      'password',
      mockUser.password,
    );
    expect(userRepository.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    expect(activityLogger.logLoginSuccess).toHaveBeenCalledWith(mockUser.email);
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith(mockUser);
  });
});
