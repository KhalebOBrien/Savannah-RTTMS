import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskService } from '../TaskService';
import { Task } from '../../entities/Task';

const mockTaskRepository = {
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByUserId: vi.fn(),
};

const mockIo = {
  emit: vi.fn(),
};

let taskService: TaskService;

describe('TaskService', () => {
  beforeEach(() => {
    taskService = new TaskService(mockTaskRepository as any, mockIo as any);
  });

  it('should create a task and emit taskCreated event', async () => {
    const mockTask = new Task(
      'mock-id',
      'Test Task',
      'Description',
      false,
      'user-id',
    );
    mockTaskRepository.create.mockResolvedValue(mockTask);

    const createdTask = await taskService.createTask(mockTask);

    expect(mockTaskRepository.create).toHaveBeenCalledWith(mockTask);
    expect(mockIo.emit).toHaveBeenCalledWith('taskCreated', mockTask);
    expect(createdTask).toEqual(mockTask);
  });

  it('should update a task and emit taskUpdated event', async () => {
    const mockTask = new Task(
      'mock-id',
      'Updated Task',
      'Updated Description',
      true,
      'user-id',
    );
    mockTaskRepository.findById.mockResolvedValue(mockTask);
    mockTaskRepository.update.mockResolvedValue(mockTask);

    const updatedTask = await taskService.updateTask(mockTask);

    expect(mockTaskRepository.update).toHaveBeenCalledWith(mockTask);
    expect(mockIo.emit).toHaveBeenCalledWith('taskUpdated', mockTask);
    expect(updatedTask).toEqual(mockTask);
  });

  it('should delete a task and emit taskDeleted event', async () => {
    mockTaskRepository.delete.mockResolvedValue(undefined);

    await taskService.deleteTask('mock-id');

    expect(mockTaskRepository.delete).toHaveBeenCalledWith('mock-id');
    expect(mockIo.emit).toHaveBeenCalledWith('taskDeleted', { id: 'mock-id' });
  });
});
