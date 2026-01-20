import { Router } from "express";
import passport from "passport";
import { userService } from "../services";
import { hashPassword } from "../../config/auth/auth-config";

const authRoute = Router();

// Register endpoint
authRoute.post("/register", async (req, res, next) => {

    try {
        // Check for existing user
        const existingByUsername = await userService.getUserByUsername(req.body.username);
        if (existingByUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingByEmail = await userService.getUserByEmail(req.body.email);
        if (existingByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const user = await userService.createUser({
            ...req.body,
            password: await hashPassword(req.body.password),
        });

        // Log in the user after registration
        req.login(user, (err) => {
            if (err) return next(err);

            // Remove password from response
            const { password, ...userWithoutPassword } = user;
            res.status(201).json(userWithoutPassword);
        });
    } catch (error) {
        next(error);
    }
});

// Login endpoint
authRoute.post("/login", (req, res, next) => {


    passport.authenticate(
        "local",
        (
            err: any,
            user: Express.User | false | null,
            info: { message?: string }
        ) => {
            if (err)
                return next(err);
            if (!user)
                return res.status(401).json({ message: "Invalid credentials" });

            req.login(user, (err: any) => {
                if (err) return next(err);

                // Remove password from response
                const { password, ...userWithoutPassword } = user as Express.User;
                res.status(200).json(userWithoutPassword);
            });
        }
    )(req, res, next);
});

// Logout endpoint
authRoute.post("/logout", (req, res, next) => {

    req.logout((err) => {
        if (err) {
            console.log("\n\n Logging out user:", err);
            return next(err)
        };
        res.sendStatus(200);
    });
});

// Get current user endpoint
authRoute.get("/current_user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
});

export default authRoute;
