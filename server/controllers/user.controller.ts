import { Request, Response } from 'express';
import { userService } from '../services';

export class UserController {
    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userService.getUser(id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user' });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        console.log("\n\n hit user profile route for get all users");

        // Handle role parameter
        let role = req.query.role as "visitor" | "attendant" | "admin" | undefined;
        if (role && !['visitor', 'attendant', 'admin'].includes(role)) {
            role = undefined;
            console.warn("\n\n Invalid role provided, resetting to undefined");
        }

        // Fix pagination parameters
        const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : 1; // Default to 1, minimum 1
        const pageSize = req.query.pageSize ? Math.min(100, Math.max(1, parseInt(req.query.pageSize as string))) : 20; // Default 20, clamp 1-100

        const limit = pageSize;
        const offset = (page - 1) * limit;

        try {
            const users = await userService.getAllUsers(limit, offset, role);
            res.json(users);
        } catch (error) {
            console.error('Error in getAllUsers controller:', error);
            res.status(500).json({ error: 'Failed to get all users' });
        }
    }

    async getUserByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const user = await userService.getUserByUsername(username);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user by username' });
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        try {
            const { email } = req.query;
            const user = await userService.getUserByEmail(email as string);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user by email' });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            const user = await userService.createUser(userData);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await userService.updateUser(id, userData);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    // delete user by email
    async deleteUserByEmail(req: Request, res: Response) {
        try {
            const { email } = req.params;
            await userService.deleteUserByEmail(email);
            res.sendStatus(204).send({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    // delete user by id
    async deleteUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await userService.deleteUserById(id);
            res.sendStatus(204).send({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('\n\n 💥💥💥💥💥💥💥💥💥 rror deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }

    }
}

export const userController = new UserController();
