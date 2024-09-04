import { Request, Response } from 'express';
import { AuthService } from '../../domain/services/AuthService';
import { StatusCodes } from 'http-status-codes';
import { ErrorHnadler } from '../errors/ErrorHnadler';
import { apiResponse } from '../../infrastructure/http/response/ApiResponse';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<Response | void> {
    try {
      const { username, email, password } = req.body;
      const token = await this.authService.register(username, email, password);
      return res
        .status(StatusCodes.CREATED)
        .json(apiResponse('success', 'account registered', { token }));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }

  async login(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      return res
        .status(StatusCodes.OK)
        .json(apiResponse('success', 'authenticated', { token }));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }
}
