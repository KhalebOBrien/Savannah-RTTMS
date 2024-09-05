import { Router } from 'express';
import { AuthController } from '../../../interface_adapters/controllers/AuthController';
import { MongoUserRepository } from '../../../infrastructure/db/mongo/UserRepositoryImpl';
import { AuthService } from '../../../domain/services/AuthService';
import { validateBody } from '../middleware/ValidationHandler';
import { loginSchema, registerSchema } from '../validations/AuthValidations';

const userRepository = new MongoUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

router.post('/register', validateBody(registerSchema), (req, res) =>
  authController.register(req, res),
);
router.post('/login', validateBody(loginSchema), (req, res) =>
  authController.login(req, res),
);

export default router;
