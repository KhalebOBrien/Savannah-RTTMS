import { Request, Response } from 'express';
import { TaskService } from '../../domain/services/TaskService';
import { Task } from '../../domain/entities/Task';
import { StatusCodes } from 'http-status-codes';
import { apiResponse } from '../../infrastructure/http/response/ApiResponse';
import { ErrorHnadler } from '../errors/ErrorHnadler';
import { CustomError } from '../errors/CustomError';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: Request, res: Response): Promise<Response | void> {
    const { title, description, completed, userId } = req.body;
    try {
      const task = new Task('', title, description, completed, userId);
      const createdTask = await this.taskService.createTask(task);

      return res
        .status(StatusCodes.CREATED)
        .json(apiResponse('success', '', createdTask));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }

  async getTask(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        throw new CustomError('Task not found.', StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.OK).json(apiResponse('success', '', task));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }

  async updateTask(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        throw new CustomError('Task not found.', StatusCodes.NOT_FOUND);
      }

      task.title = title;
      task.description = description;
      task.completed = completed;

      const updatedTask = await this.taskService.updateTask(task);
      return res
        .status(StatusCodes.OK)
        .json(apiResponse('success', '', updatedTask));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }

  async deleteTask(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    try {
      await this.taskService.deleteTask(id);

      return res.status(StatusCodes.OK).json(apiResponse('success', '', {}));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }

  async getTasksByUserId(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const { userId } = req.params;

    try {
      const tasks = await this.taskService.getTasksByUserId(userId);
      return res.status(StatusCodes.OK).json(apiResponse('success', '', tasks));
    } catch (error) {
      ErrorHnadler.handleError(error, req, res);
    }
  }
}
