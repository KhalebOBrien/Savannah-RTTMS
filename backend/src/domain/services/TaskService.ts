import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../entities/Task';
import { Server as SocketIOServer } from 'socket.io';

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private io: SocketIOServer,
  ) {}

  async createTask(task: Task): Promise<Task> {
    const createdTask = await this.taskRepository.create(task);
    this.io.emit('taskCreated', createdTask);
    return createdTask;
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async updateTask(task: Task): Promise<Task> {
    const updatedTask = await this.taskRepository.update(task);
    this.io.emit('taskUpdated', updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
    this.io.emit('taskDeleted', { id });
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId);
  }
}
