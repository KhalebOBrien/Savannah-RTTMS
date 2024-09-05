import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { jwtConfig } from '../../infrastructure/config/jwtConfig';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User('', username, email, hashedPassword);
    const createdUser = await this.userRepository.create(newUser);

    return this.generateToken(createdUser);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    return jwt.sign({ userId: user.id, email: user.email }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { userId: string };
      return await this.userRepository.findById(decoded.userId);
    } catch (error) {
      return null;
    }
  }
}
