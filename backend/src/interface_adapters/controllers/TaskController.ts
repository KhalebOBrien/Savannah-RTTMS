import { Request, Response } from 'express';
import { TaskService } from '../../domain/services/TaskService';
import { Task } from '../../domain/entities/Task';
import { StatusCodes } from 'http-status-codes';
import { apiResponse } from '../../infrastructure/http/response/ApiResponse';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: Request, res: Response): Promise<void> {
    const { title, description, completed, userId } = req.body;
    const task = new Task('', title, description, completed, userId);
    const createdTask = await this.taskService.createTask(task);
    res.status(StatusCodes.CREATED).json(createdTask);
  }

  async getTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(apiResponse('error', 'Task not found', []));
    } else {
      res.status(StatusCodes.OK).json(apiResponse('success', '', task));
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    task.title = title;
    task.description = description;
    task.completed = completed;

    const updatedTask = await this.taskService.updateTask(task);
    res.json(updatedTask);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.taskService.deleteTask(id);
    res.status(204).send();
  }

  async getTasksByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const tasks = await this.taskService.getTasksByUserId(userId);
    res.json(tasks);
  }
}
