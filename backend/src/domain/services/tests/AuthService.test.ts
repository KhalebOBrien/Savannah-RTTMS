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
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);
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

});
