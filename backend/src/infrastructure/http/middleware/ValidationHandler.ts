import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';
import { apiResponse } from '../response/ApiResponse';
import { StatusCodes } from 'http-status-codes';

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err: any) {
      const errors = err.inner.map((e: any) => ({
        field: e.path,
        message: e.message,
      }));
      res.status(StatusCodes.BAD_REQUEST).json(apiResponse('error', 'Validation error', errors));
    }
  };
