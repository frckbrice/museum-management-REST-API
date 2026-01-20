// routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers';

const router = Router();


router.get('/users/:id', userController.getUser);
router.get('/users/:username', userController.getUserByUsername);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.get('/users', userController.getAllUsers);
router.delete('/users/:id', userController.deleteUserById);
router.delete("/users/:email", userController.deleteUserByEmail)

export default router;
