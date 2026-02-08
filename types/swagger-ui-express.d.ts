declare module "swagger-ui-express" {
  import { RequestHandler } from "express";
  interface SwaggerUiOptions {
    [key: string]: unknown;
  }
  function serve(): RequestHandler[];
  function setup(
    spec: object,
    options?: SwaggerUiOptions
  ): RequestHandler;
  const _default: { serve: typeof serve; setup: typeof setup };
  export = _default;
}
