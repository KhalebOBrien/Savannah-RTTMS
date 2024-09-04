import { Router } from 'express';
import { AuthController } from '../../../interface_adapters/controllers/AuthController';
import { MongoUserRepository } from '../../../infrastructure/db/mongo/UserRepositoryImpl';
import { AuthService } from '../../../domain/services/AuthService';

const userRepository = new MongoUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

export default router;
