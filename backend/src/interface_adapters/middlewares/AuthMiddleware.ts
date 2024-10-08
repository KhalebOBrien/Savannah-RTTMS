import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../domain/services/AuthService';
import { StatusCodes } from 'http-status-codes';

export class AuthMiddleware {
  constructor(private authService: AuthService) {}

  async authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const user = await this.authService.verifyToken(token);

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    res.locals.user = user;
    next();
  }
}
