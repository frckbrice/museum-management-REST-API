declare module "supertest" {
  import type { ExpressApp } from "./express-app";

  interface SuperTest {
    get(path: string): SuperTest;
    post(path: string): SuperTest;
    options(path: string): SuperTest;
    set(field: string, val: string): SuperTest;
    expect(status: number): SuperTest;
    then<T>(fn: (res: { status: number; body: unknown; headers: Record<string, string> }) => T): Promise<T>;
  }

  function request(app: ExpressApp): SuperTest;
  export = request;
}
