import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Response } from "express";
import type { ExpressApp, ExpressNext } from "../../types/express-app";
import { UnauthorizedError, ForbiddenError } from "../../middlewares/errors/error-handler";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { sessionService, userService } from "../../server/services";
import { User as SelectUser } from "../database/schema/schema-types";
import bcrypt from "bcrypt";

declare global {
  namespace Express {
    interface User extends SelectUser { }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10); // async version
  const hashed = await bcrypt.hash(password, salt);

  return hashed;
}

export async function comparePasswords(supplied: string, stored: string) {
  const match = await bcrypt.compare(supplied, stored);

  return match;
}

import { env } from "../env/env-validation";

export function configureAuth(app: ExpressApp) {
  const sessionSettings: session.SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionService.getSessionStore(),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    },
  };

  // Configure session and passport
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username", // or 'emailOrUsername' if that's what you're sending
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          // Check if input is email or username
          let user;
          if (username.includes("@")) {
            user = await userService.getUserByEmail(username);
          } else {
            user = await userService.getUserByUsername(username);
          }

          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize/deserialize user for session
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userService.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Authentication middleware
export function requireAuth(req: Express.Request, _res: Response, next: ExpressNext) {
  if (!req.isAuthenticated()) {
    return next(new UnauthorizedError("Authentication required"));
  }
  next();
}

// Role-based middleware
export function requireAttendant(req: Express.Request, _res: Response, next: ExpressNext) {
  if (!req.isAuthenticated()) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (req.user.userType !== "attendant" && req.user.userType !== "admin") {
    return next(new ForbiddenError("Access denied"));
  }

  next();
}

export function requireAdmin(req: Express.Request, _res: Response, next: ExpressNext) {
  if (!req.isAuthenticated()) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (req.user.userType !== "admin") {
    return next(new ForbiddenError("Access denied"));
  }

  next();
}
