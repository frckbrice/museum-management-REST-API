// services/session/session-service.ts
import connectPg from "connect-pg-simple";
import session from "express-session";
import { BaseService } from "./base-service";

export class SessionService extends BaseService {
  private sessionStore: session.Store;

  constructor() {
    super();
    const PostgresSessionStore = connectPg(session);

    this.sessionStore = new PostgresSessionStore({
      pool: this.connectionPool,
      createTableIfMissing: true,
      errorLog: (error: Error) => {
        console.error("\n\n Session store error:", error);
      },
    });
  }

  getSessionStore(): session.Store {
    return this.sessionStore;
  }
}
