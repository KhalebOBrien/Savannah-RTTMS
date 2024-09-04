import { TaskRepository } from '../../../domain/repositories/TaskRepository';
import { Task } from '../../../domain/entities/Task';
import mongoose, { Schema, Document } from 'mongoose';

// interface TaskDocument extends Task, Document {}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
});

const TaskModel = mongoose.model<Task>('Tasks', TaskSchema);
// const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);

export class MongoTaskRepository implements TaskRepository {
  async create(task: Task): Promise<Task> {
    const newTask = new TaskModel(task);
    const savedTask = await newTask.save();
    return new Task(
      savedTask.id,
      savedTask.title,
      savedTask.description,
      savedTask.completed,
      savedTask.userId,
    );
  }

  async findById(id: string): Promise<Task | null> {
    const task = await TaskModel.findById(id);
    if (!task) return null;
    return new Task(
      task.id,
      task.title,
      task.description,
      task.completed,
      task.userId,
    );
  }

  async update(task: Task): Promise<Task> {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      task.id,
      {
        title: task.title,
        description: task.description,
        completed: task.completed,
      },
      { new: true },
    );
    if (!updatedTask) throw new Error('Task not found');
    return new Task(
      updatedTask.id,
      updatedTask.title,
      updatedTask.description,
      updatedTask.completed,
      updatedTask.userId,
    );
  }

  async delete(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(id);
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ userId });
    return tasks.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.description,
          task.completed,
          task.userId,
        ),
    );
  }
}
