import { NextFunction, Request, Response } from 'express';
import { CustomError } from './CustomErrorMiddleware';
import { apiResponse } from '../../infrastructure/http/response/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../infrastructure/logger/Logger';

export class ErrorMiddleware {
  public static handleError(
    error: Error | unknown,
    req: Request<any, any, any, any>,
    res: Response,
  ): Response {
    if (error instanceof Error) {
      const statusCode =
        error instanceof CustomError
          ? error.statusCode
          : StatusCodes.INTERNAL_SERVER_ERROR;

      return res
        .status(statusCode)
        .json(apiResponse('error', error.message, []));
    } else {
      logger.error(
        `⚠️*⚠️*⚠️*⚠️*⚠️*⚠️*⚠️*⚠️ An UNKNOWN error occurred ⚠️*⚠️*⚠️*⚠️*⚠️*⚠️*⚠️*⚠️ `,
      );
      logger.error(error);

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(apiResponse('error', 'An unknown error occurred', []));
    }
  }
}
