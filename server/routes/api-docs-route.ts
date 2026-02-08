/**
 * OpenAPI / Swagger UI — serves interactive API docs at GET /api-docs.
 * Pass a plain object copy so Swagger UI's resolver does not hit undefined (e.g. reading 'users').
 */
import type { ExpressApp, ExpressResponse } from "../../types/express-app";
import swaggerUi from "swagger-ui-express";
import spec from "../../config/openapi/spec";

function getSpecCopy(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(spec)) as Record<string, unknown>;
}

export function mountApiDocs(app: ExpressApp): void {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(getSpecCopy(), {
      explorer: true,
      deepLinking: true,
      persistAuthorization: true,
      docExpansion: "list",
    })
  );
  app.get("/api-docs.json", (_req: unknown, res: ExpressResponse) => {
    res.json(getSpecCopy());
  });
}
