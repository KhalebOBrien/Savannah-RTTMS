import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AuthService } from '../AuthService';
import { User } from '../../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mockUserRepository = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
};

let authService: AuthService;

describe('AuthService', () => {
  beforeEach(() => {
    authService = new AuthService(mockUserRepository as any);

    // @ts-ignore: Ignore TypeScript error for mocking bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
    // @ts-ignore
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    // @ts-ignore
    vi.spyOn(jwt, 'sign').mockReturnValue('fake-jwt-token');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register a user and return a JWT token', async () => {
    const mockUser: User = new User(
      'mock-id',
      'testuser',
      'test@example.com',
      'password123',
    );
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(mockUser);

    const token = await authService.register(
      'testuser',
      'test@example.com',
      'password123',
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser.id, email: mockUser.email },
      expect.any(String),
      { expiresIn: expect.any(String) },
    );

    expect(token).toBe('fake-jwt-token');
  });

  it('should throw an error if user already exists during registration', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      new User(
        'mock-id',
        'existinguser',
        'existing@example.com',
        'password123',
      ),
    );

    await expect(
      authService.register(
        'existinguser',
        'existing@example.com',
        'password123',
      ),
    ).rejects.toThrow('User already exists');
  });

  it('should login a user and return a JWT token', async () => {
    const mockUser = new User(
      'mock-id',
      'testuser',
      'test@example.com',
      'hashed-password',
    );

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    // @ts-ignore
    bcrypt.compare.mockResolvedValue(true);

    const token = await authService.login('test@example.com', 'password123');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashed-password',
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser.id, email: mockUser.email },
      expect.any(String), // JWT secret
      { expiresIn: expect.any(String) },
    );

    expect(token).toBe('fake-jwt-token');
  });

  it('should throw an error if user does not exist during login', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login('nonexistent@example.com', 'password123'),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error if password is incorrect during login', async () => {
    const mockUser = new User(
      'mock-id',
      'testuser',
      'test@example.com',
      'hashed-password',
    );

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    // @ts-ignore
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login('test@example.com', 'wrongpassword'),
    ).rejects.toThrow('Invalid email or password');

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrongpassword',
      'hashed-password',
    );
  });
});
