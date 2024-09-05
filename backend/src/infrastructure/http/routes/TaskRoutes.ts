import { Router } from 'express';
import { TaskController } from '../../../interface_adapters/controllers/TaskController';
import { MongoTaskRepository } from '../../../infrastructure/db/mongo/TaskRepositoryImpl';
import { TaskService } from '../../../domain/services/TaskService';
import { AuthMiddleware } from '../../../interface_adapters/middlewares/AuthMiddleware';
import { AuthService } from '../../../domain/services/AuthService';
import { MongoUserRepository } from '../../../infrastructure/db/mongo/UserRepositoryImpl';
import { Server as SocketIOServer } from 'socket.io';
import { validateBody, validateParams } from '../middleware/ValidationHandler';
import { taskIdSchema, taskSchema } from '../validations/TaskValidations';

const TaskRoutes = (io: SocketIOServer) => {
  const taskRepository = new MongoTaskRepository();
  const taskService = new TaskService(taskRepository, io);
  const taskController = new TaskController(taskService);

  const userRepository = new MongoUserRepository();
  const authService = new AuthService(userRepository);
  const authMiddleware = new AuthMiddleware(authService);

  const router = Router();

  router.use((req, res, next) => authMiddleware.authenticate(req, res, next));

  router.post('/', validateBody(taskSchema), (req, res) =>
    taskController.createTask(req, res),
  );

  router.get('/', (req, res) => taskController.getTasksByUser(req, res));

  router.get('/:id', validateParams(taskIdSchema), (req, res) =>
    taskController.getTask(req, res),
  );

  router.put(
    '/:id',
    validateParams(taskIdSchema),
    validateBody(taskSchema),
    (req, res) => taskController.updateTask(req, res),
  );

  router.delete('/:id', validateParams(taskIdSchema), (req, res) =>
    taskController.deleteTask(req, res),
  );

  return router;
};

export default TaskRoutes;
