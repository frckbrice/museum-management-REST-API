// routes/user.routes.ts
import { Router } from "express";
import { userController } from "../controllers";
import { requireAuth, requireAdmin } from "../../config/auth/auth-config";

const router = Router();

// List users (admin only per API spec)
router.get("/users", requireAdmin, userController.getAllUsers);

// Create user (admin only; public registration uses POST /register)
router.post("/users", requireAdmin, userController.createUser);

// Get user by ID or username (authenticated)
router.get("/users/:id", requireAuth, userController.getUser);
router.get("/users/:username", requireAuth, userController.getUserByUsername);

// Update user (authenticated; enforce own profile or admin in controller if needed)
router.put("/users/:id", requireAuth, userController.updateUser);

// Delete user (admin only)
router.delete("/users/:id", requireAdmin, userController.deleteUserById);
router.delete("/users/:email", requireAdmin, userController.deleteUserByEmail);

export default router;
