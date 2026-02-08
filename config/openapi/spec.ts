// /**
//  * OpenAPI 3.0.3 spec for Museum Management REST API.
//  * Served at GET /api-docs (Swagger UI) and GET /api-docs.json (raw JSON).
//  * Base path: /api/v1
//  */

// const API_VERSION = process.env.npm_package_version ?? "1.0.0";

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const spec: Record<string, any> = {
//   openapi: "3.0.3",
//   info: {
//     title: "Museum Management REST API",
//     version: API_VERSION,
//     description:
//       "REST API for a digital museum platform: content management, session-based auth, bookings, forum, gallery, and real-time features.\n\n**Security:** Authenticated endpoints use session-based auth via `connect.sid` cookie. Call `/login` or `/register` with credentials to obtain a session. Use **Try it out** in Swagger UI with credentials enabled to test protected endpoints.\n\n**CRUD by collection:** History and Gallery support full CRUD (GET list, GET by id, POST, PUT, DELETE). Post likes use POST (like) and DELETE (unlike) only—no PUT, since a like is binary. Contact form messages are immutable from the public API (POST only); GET list, GET unread count, and PATCH read are available. Admin-only operations (see Admin tag) include GET/DELETE contact messages and marking as read.",
//     contact: {
//       name: "API support",
//     },
//     license: {
//       name: "MIT",
//       url: "https://opensource.org/licenses/MIT",
//     },
//   },
//   servers: [
//     { url: "/api/v1", description: "API v1 base path" },
//   ],
//   tags: [
//     { name: "Health", description: "Liveness and readiness probes" },
//     { name: "Auth", description: "Registration, login, logout, current user" },
//     { name: "Users", description: "User CRUD and profile" },
//     { name: "History", description: "History content CRUD" },
//     { name: "Gallery", description: "Gallery items" },
//     { name: "Bookings", description: "Visit bookings" },
//     { name: "Forum", description: "Posts and comments" },
//     { name: "Post likes", description: "Like/unlike posts" },
//     { name: "Contact", description: "Contact form and messages" },
//     { name: "Admin", description: "Admin-only operations: contact messages list, get by ID, mark read, delete" },
//   ],
//   paths: {
//     // ---------- Health ----------
//     "/health": {
//       get: {
//         summary: "Health check (readiness)",
//         description:
//           "Returns service and dependency status. Use for load balancer readiness. Returns 503 if DB is down.",
//         tags: ["Health"],
//         operationId: "getHealth",
//         responses: {
//           "200": {
//             description: "Healthy",
//             content: {
//               "application/json": {
//                 schema: {
//                   type: "object",
//                   required: ["success", "data"],
//                   properties: {
//                     success: { type: "boolean", example: true },
//                     data: {
//                       type: "object",
//                       properties: {
//                         status: { type: "string", enum: ["healthy", "unhealthy"] },
//                         timestamp: { type: "string", format: "date-time" },
//                         version: { type: "string" },
//                         checks: {
//                           type: "object",
//                           additionalProperties: { type: "string" },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           "503": {
//             description: "Unhealthy (e.g. database down)",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },
//     "/live": {
//       get: {
//         summary: "Liveness probe",
//         description:
//           "Returns 200 if the process is running. Does not check dependencies. Use for Kubernetes liveness.",
//         tags: ["Health"],
//         operationId: "getLive",
//         responses: {
//           "200": {
//             description: "Process is alive",
//             content: {
//               "application/json": {
//                 schema: {
//                   type: "object",
//                   required: ["success", "data"],
//                   properties: {
//                     success: { type: "boolean", example: true },
//                     data: {
//                       type: "object",
//                       properties: {
//                         status: { type: "string", example: "alive" },
//                         timestamp: { type: "string", format: "date-time" },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     "/ready": {
//       get: {
//         summary: "Readiness probe",
//         description: "Same as /health. Returns 200 when service and DB are ready to accept traffic.",
//         tags: ["Health"],
//         operationId: "getReady",
//         responses: {
//           "200": { description: "Ready" },
//           "503": {
//             description: "Not ready",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },

//     // ---------- Auth ----------
//     "/register": {
//       post: {
//         summary: "Register and log in",
//         description: "Creates a new user and logs them in. Returns user (no password).",
//         tags: ["Auth"],
//         operationId: "register",
//         requestBody: {
//           required: true,
//           content: {
//             "application/json": {
//               schema: { $ref: "#/components/schemas/RegisterRequest" },
//             },
//           },
//         },
//         responses: {
//           "201": {
//             description: "User created and logged in",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/UserPublic" },
//               },
//             },
//           },
//           "400": {
//             description: "Username or email already exists",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Message" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       }
//     },
//     "/login": {
//       post: {
//         summary: "Log in",
//         description: "Authenticates with username/email and password. Sets session cookie.",
//         tags: ["Auth"],
//         operationId: "login",
//         requestBody: {
//           required: true,
//           content: {
//             "application/json": {
//               schema: { $ref: "#/components/schemas/LoginRequest" },
//             },
//           },
//         },
//         responses: {
//           "200": {
//             description: "Logged in",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/UserPublic" },
//               },
//             },
//           },
//           "401": {
//             description: "Invalid credentials",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Message" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       }
//     },
//     "/logout": {
//       post: {
//         summary: "Log out",
//         description: "Destroys the current session.",
//         tags: ["Auth"],
//         operationId: "logout",
//         security: [{ cookieAuth: [] }],
//         responses: {
//           "200": { description: "Logged out" },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       }
//     },
//     "/current_user": {
//       get: {
//         summary: "Get current user",
//         description: "Returns the authenticated user (no password).",
//         tags: ["Auth"],
//         operationId: "getCurrentUser",
//         security: [{ cookieAuth: [] }],
//         responses: {
//           "200": {
//             description: "Current user",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/UserPublic" },
//               },
//             },
//           },
//           "401": {
//             description: "Not authenticated",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },
//     // ---------- Users ----------
//     "/users": {
//       get: {
//         summary: "List users",
//         description: "Returns paginated users. Optional filter by role.",
//         tags: ["Users"],
//         operationId: "getAllUsers",
//         parameters: [
//           { $ref: "#/components/parameters/PageQuery" },
//           { $ref: "#/components/parameters/PageSizeQuery" },
//           {
//             name: "role",
//             in: "query",
//             description: "Filter by user role",
//             schema: { type: "string", enum: ["visitor", "attendant", "admin"] },
//           },
//         ],
//         responses: {
//           "200": {
//             description: "List of users",
//             content: {
//               "application/json": {
//                 schema: {
//                   type: "array",
//                   items: { $ref: "#/components/schemas/User" },
//                 },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//       post: {
//         summary: "Create user",
//         description: "Creates a new user (admin/registration use).",
//         tags: ["Users"],
//         operationId: "createUser",
//         requestBody: {
//           required: true,
//           content: {
//             "application/json": {
//               schema: { $ref: "#/components/schemas/CreateUserRequest" },
//             },
//           },
//         },
//         responses: {
//           "201": {
//             description: "User created",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/User" },
//               },
//             },
//           },
//           "400": {
//             description: "Validation error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/ValidationErrors" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },
//     "/users/{id}": {
//       get: {
//         summary: "Get user by ID or username",
//         description:
//           "Path parameter may be user UUID or username (route order determines which handler runs).",
//         tags: ["Users"],
//         operationId: "getUserById",
//         parameters: [
//           {
//             name: "id",
//             in: "path",
//             required: true,
//             description: "User UUID or username",
//             schema: { type: "string" },
//           },
//         ],
//         responses: {
//           "200": {
//             description: "User",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/User" },
//               },
//             },
//           },
//           "404": {
//             description: "User not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//       put: {
//         summary: "Update user",
//         tags: ["Users"],
//         operationId: "updateUser",
//         parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//         requestBody: {
//           content: {
//             "application/json": {
//               schema: { $ref: "#/components/schemas/UpdateUserRequest" },
//             },
//           },
//         },
//         responses: {
//           "200": {
//             description: "Updated user",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/User" },
//               },
//             },
//           },
//           "400": {
//             description: "Validation error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/ValidationErrors" },
//               },
//             },
//           },
//           "404": {
//             description: "User not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//       delete: {
//         summary: "Delete user by ID",
//         tags: ["Users"],
//         operationId: "deleteUserById",
//         parameters: [{ $ref: "#/components/parameters/IdPath" }],
//         responses: {
//           "204": { description: "User deleted" },
//           "404": {
//             description: "User not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },
//     // ---------- History ----------
//     "/histories": {
//       get: {
//         summary: "List history content",
//         description: "Returns paginated history content.",
//         tags: ["History"],
//         operationId: "getAllHistoryContent",
//         parameters: [
//           { $ref: "#/components/parameters/PageQuery" },
//           { $ref: "#/components/parameters/PageSizeQuery" },
//         ],
//         responses: {
//           "200": {
//             description: "List of history content",
//             content: {
//               "application/json": {
//                 schema: {
//                   type: "array",
//                   items: { $ref: "#/components/schemas/HistoryContent" },
//                 },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//       post: {
//         summary: "Create history content",
//         description: "Creates new history content. Protected by session auth in production.",
//           tags: ["History"],
//           operationId: "createHistoryContent",
//           security: [{ cookieAuth: [] }],
//           requestBody: {
//             required: true,
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/CreateHistoryContentRequest" },
//               },
//             },
//           },
//           responses: {
//             "201": {
//               description: "History content created",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/HistoryContent" },
//                 },
//               },
//             },
//             "401": {
//               description: "Authentication required",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//             "400": {
//               description: "Validation error",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/ValidationErrors" },
//                 },
//               },
//             },
//             "500": {
//               description: "Internal server error",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     "/histories/{id}": {
//       get: {
//         summary: "Get history content by ID or slug",
//         description:
//           "Path parameter may be UUID or slug. Route order on server determines which resolver runs.",
//         tags: ["History"],
//         operationId: "getHistoryContentById",
//         parameters: [
//           {
//             name: "id",
//             in: "path",
//             required: true,
//             description: "History content UUID or slug",
//             schema: { type: "string" },
//           },
//         ],
//         responses: {
//           "200": {
//             description: "History content",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/HistoryContent" },
//               },
//             },
//           },
//           "404": {
//             description: "Not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//       put: {
//         summary: "Update history content",
//           description: "Updates existing history content by UUID. Protected by session auth in production.",
//           tags: ["History"],
//           operationId: "updateHistoryContent",
//           security: [{ cookieAuth: [] }],
//           parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//           requestBody: {
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/UpdateHistoryContentRequest" },
//               },
//             },
//           },
//           responses: {
//             "200": {
//               description: "Updated history content",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/HistoryContent" },
//                 },
//               },
//             },
//             "400": {
//               description: "Validation error",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/ValidationErrors" },
//                 },
//               },
//             },
//             "401": {
//               description: "Authentication required",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//             "404": {
//               description: "Not found",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//             "500": {
//               description: "Internal server error",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//           },
//         },
//         delete: {
//           summary: "Delete history content",
//           description: "Soft-deletes history content by UUID. Protected by session auth in production.",
//           tags: ["History"],
//           operationId: "deleteHistoryContent",
//           security: [{ cookieAuth: [] }],
//           parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//           responses: {
//             "200": {
//               description: "Deleted",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Message" },
//                 },
//               },
//             },
//             "401": {
//               description: "Authentication required",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//             "404": {
//               description: "Not found",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//             "500": {
//               description: "Internal server error",
//               content: {
//                 "application/json": {
//                   schema: { $ref: "#/components/schemas/Error" },
//                 },
//               },
//             },
//           },
//         },
//       },
    
//     // ---------- Gallery ----------
//     // "/galleries": {
//     //     get: {
//     //       summary: "List gallery items",
//     //       description: "Returns paginated gallery items. Optional query filter by category.",
//     //       tags: ["Gallery"],
//     //       operationId: "getAllGalleryItems",
//     //       parameters: [
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //         {
//     //           name: "category",
//     //           in: "query",
//     //           schema: { type: "string" },
//     //         },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of gallery items",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/GalleryItem" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //     post: {
//     //       summary: "Create gallery item",
//     //       description: "Requires multipart/form-data with image file and fields. Protected by session auth in production.",
//     //       tags: ["Gallery"],
//     //       operationId: "createGalleryItem",
//     //       security: [{ cookieAuth: [] }],
//     //       requestBody: {
//     //         required: true,
//     //         content: {
//     //           "multipart/form-data": {
//     //             schema: {
//     //               type: "object",
//     //               required: ["title", "description", "category"],
//     //               properties: {
//     //                 title: { type: "string" },
//     //                 description: { type: "string" },
//     //                 imageUrl: { type: "string", description: "Optional if file uploaded" },
//     //                 altText: { type: "string" },
//     //                 category: { type: "string" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "201": {
//     //           description: "Gallery item created",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/GalleryItem" },
//     //             },
//     //           },
//     //         },
//     //         "400": {
//     //           description: "Image file required or validation error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "401": {
//     //           description: "Authentication required",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
    
//     // "/galleries/categories/{category}": {
//     //   get: {
//     //       summary: "List gallery items by category",
//     //       tags: ["Gallery"],
//     //       operationId: "getGalleryItemsByCategory",
//     //       parameters: [
//     //         {
//     //           name: "category",
//     //           in: "path",
//     //           required: true,
//     //           schema: { type: "string" },
//     //         },
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of gallery items",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/GalleryItem" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
    
//     // "/galleries/{id}": {
//     //   get: {
//     //       summary: "Get gallery item by ID",
//     //       tags: ["Gallery"],
//     //       operationId: "getGalleryItemById",
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       responses: {
//     //         "200": {
//     //           description: "Gallery item",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/GalleryItem" },
//     //             },
//     //           },
//     //         },
//     //         "404": {
//     //           description: "Not found",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //     put: {
//     //       summary: "Update gallery item",
//     //       description: "Updates an existing gallery item by ID. Protected by session auth in production.",
//     //       tags: ["Gallery"],
//     //       operationId: "updateGalleryItem",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       requestBody: {
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/UpdateGalleryItemRequest" },
//     //           },
//     //           "multipart/form-data": {
//     //             schema: {
//     //               type: "object",
//     //               properties: {
//     //                 title: { type: "string" },
//     //                 description: { type: "string" },
//     //                 imageUrl: { type: "string" },
//     //                 altText: { type: "string" },
//     //                 category: { type: "string" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "200": {
//     //           description: "Updated gallery item",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/GalleryItem" },
//     //             },
//     //           },
//     //         },
//     //         "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrors" } } }},
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       },
//     //     },
//     //     delete: {
//     //       summary: "Delete gallery item",
//     //       description: "Deletes a gallery item by ID. Protected by session auth in production.",
//     //       tags: ["Gallery"],
//     //       operationId: "deleteGalleryItem",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       responses: {
//     //         "204": { description: "Gallery item deleted" },
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       },
//     //     },
//     //   },
//     // },
//     // // ---------- Bookings ----------
//     // "/bookings": {
//     //     get: {
//     //       summary: "List bookings",
//     //       description:
//     //         "Authenticated. Visitors see only their bookings; attendants/admins see all. Optional filter by status (query).",
//     //       tags: ["Bookings"],
//     //       operationId: "getAllBookings",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //         {
//     //           name: "status",
//     //           in: "query",
//     //           schema: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
//     //         },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of bookings",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/Booking" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "401": {
//     //           description: "Authentication required",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Message" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       post: {
//     //         summary: "Create booking",
//     //         description: "Creates a booking. If authenticated, userId is set from session. Sends WebSocket event.",
//     //         tags: ["Bookings"],
//     //         operationId: "createBooking",
//     //         requestBody: {
//     //           required: true,
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/CreateBookingRequest" },
//     //             },
//     //           },
//     //         },
//     //         responses: {
//     //           "201": {
//     //             description: "Booking created",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Booking" },
//     //               },
//     //             },
//     //           },
//     //           "400": {
//     //             description: "Validation error",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/ValidationErrors" },
//     //               },
//     //             },
//     //           },
//     //           "500": {
//     //             description: "Internal server error",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Error" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       }
//     //     }
//     //   },
//     //   "/bookings/{id}": {
//     //     get: {
//     //       summary: "Get booking by ID",
//     //       tags: ["Bookings"],
//     //       operationId: "getBookingById",
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       responses: {
//     //         "200": {
//     //           description: "Booking",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Booking" },
//     //             },
//     //           },
//     //         },
//     //         "404": {
//     //           description: "Not found",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //     put: {
//     //       summary: "Update booking",
//     //       description: "Full update of a booking by ID. Authenticated; visitors may only update their own.",
//     //       tags: ["Bookings"],
//     //       operationId: "updateBooking",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       requestBody: {
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/UpdateBookingRequest" },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "200": {
//     //           description: "Updated booking",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Booking" },
//     //             },
//     //           },
//     //         },
//     //         "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrors" } } }},
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //       },
//     //     }},
//     //     delete: {
//     //       summary: "Delete booking",
//     //       description: "Deletes a booking by ID. Authenticated; visitors may only delete their own.",
//     //       tags: ["Bookings"],
//     //       operationId: "deleteBooking",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       responses: {
//     //         "204": { description: "Booking deleted" },
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       }},
//     //     }},
//     //   },
//     //   "/bookings/users/{userId}": {
//     //     get: {
//     //       summary: "List bookings by user ID",
//     //       tags: ["Bookings"],
//     //       operationId: "getBookingsByUserId",
//     //       parameters: [
//     //         {
//     //           name: "userId",
//     //           in: "path",
//     //           required: true,
//     //           schema: { type: "string", format: "uuid" },
//     //         },
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of bookings",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/Booking" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     }
//     //   },
//     //   "/bookings/attendant/{id}/status": {
//     //     patch: {
//     //       summary: "Update booking status (attendant)",
//     //       description: "Attendant or admin only. Sets status to pending, confirmed, or cancelled.",
//     //       tags: ["Bookings"],
//     //       operationId: "updateBookingStatus",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       requestBody: {
//     //         required: true,
//     //         content: {
//     //           "application/json": {
//     //             schema: {
//     //               type: "object",
//     //               required: ["status"],
//     //               properties: {
//     //                 status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "200": {
//     //           description: "Updated booking",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Booking" },
//     //             },
//     //           },
//     //         },
//     //         "400": {
//     //           description: "Invalid status",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Message" },
//     //             },
//     //           },
//     //         },
//     //         "401": {
//     //           description: "Authentication required",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "403": {
//     //           description: "Access denied",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "404": {
//     //           description: "Booking not found",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Message" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     }
//     //   },

//     //   // ---------- Forum (posts & comments) ----------
//     //   "/posts": {
//     //     get: {
//     //       summary: "List posts",
//     //       description:
//     //         "Optional query attendantOnly=true (requires attendant/admin). Paginated.",
//     //       tags: ["Forum"],
//     //       operationId: "getAllPosts",
//     //       parameters: [
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //         {
//     //           name: "attendantOnly",
//     //           in: "query",
//     //           schema: { type: "string", enum: ["true", "false"] },
//     //         },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of posts",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/Post" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "403": {
//     //           description: "Access denied (attendant-only filter without role)",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Message" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       post: {
//     //         summary: "Create post",
//     //         description: "Authenticated. Sends WebSocket event on success.",
//     //         tags: ["Forum"],
//     //         operationId: "createPost",
//     //         security: [{ cookieAuth: [] }],
//     //         requestBody: {
//     //           required: true,
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/CreatePostRequest" },
//     //             },
//     //           },
//     //         },
//     //         responses: {
//     //           "201": {
//     //             description: "Post created",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Post" },
//     //               },
//     //             },
//     //           },
//     //           "400": {
//     //             description: "Validation error",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/ValidationErrors" },
//     //               },
//     //             },
//     //           },
//     //           "401": {
//     //             description: "Authentication required",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Message" },
//     //               },
//     //             },
//     //           },
//     //           "403": {
//     //             description: "Access denied (e.g. attendant-only post as visitor)",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Message" },
//     //               },
//     //             },
//     //           },
//     //           "500": {
//     //             description: "Internal server error",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Error" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       }
//     //     }
//     //   },
//     //   "/posts/{id}": {
//     //     get: {
//     //       summary: "Get post by ID",
//     //       description: "Returns 403 for attendant-only posts if user is not attendant/admin.",
//     //       tags: ["Forum"],
//     //       operationId: "getPostById",
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       responses: {
//     //         "200": {
//     //           description: "Post",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Post" },
//     //             },
//     //           },
//     //         },
//     //         "403": {
//     //           description: "Access denied",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Message" },
//     //             },
//     //           },
//     //         },
//     //         "404": {
//     //           description: "Post not found",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Message" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //     put: {
//     //       summary: "Update post",
//     //       description: "Updates a post by ID. Author or admin only. Sends WebSocket event.",
//     //       tags: ["Forum"],
//     //       operationId: "updatePost",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       requestBody: {
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/UpdatePostRequest" },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "200": {
//     //           description: "Updated post",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Post" },
//     //             },
//     //           },
//     //         },
//     //         "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrors" } } }},
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "404": { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       }},
//     //     }},
//     //     delete: {
//     //       summary: "Delete post",
//     //       description: "Deletes a post by ID. Author or admin only. Sends WebSocket event.",
//     //       tags: ["Forum"],
//     //       operationId: "deletePost",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //       responses: {
//     //         "204": { description: "Post deleted" },
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "404": { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       }},
//     //     }},
//     //   }}},
//     //   "/posts/{id}/comments": {
//     //     get: {
//     //       summary: "List comments for a post",
//     //       tags: ["Forum"],
//     //       operationId: "getCommentsByPostId",
//     //       parameters: [
//     //         { $ref: "#/components/parameters/UuidPath" },
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of comments",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/Comment" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       post: {
//     //         summary: "Add comment to post",
//     //         description: "Authenticated. Sends WebSocket event.",
//     //         tags: ["Forum"],
//     //         operationId: "createComment",
//     //         security: [{ cookieAuth: [] }],
//     //         parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //         requestBody: {
//     //           required: true,
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "object",
//     //                 required: ["content"],
//     //                 properties: {
//     //                   content: { type: "string" },
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         responses: {
//     //           "201": {
//     //             description: "Comment created",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Comment" },
//     //               },
//     //             },
//     //           },
//     //           "400": {
//     //             description: "Validation error",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/ValidationErrors" },
//     //               },
//     //             },
//     //           },
//     //           "401": {
//     //             description: "Authentication required",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Message" },
//     //               },
//     //             },
//     //           },
//     //           "403": {
//     //             description: "Access denied (e.g. attendant-only post)",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Message" },
//     //               },
//     //             },
//     //           },
//     //           "404": {
//     //             description: "Post not found",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Message" },
//     //               },
//     //             },
//     //           },
//     //           "500": {
//     //             description: "Internal server error",
//     //             content: {
//     //               "application/json": {
//     //                 schema: { $ref: "#/components/schemas/Error" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     //   "/posts/{postId}/comments/{commentId}": {
//     //     get: {
//     //       summary: "Get comment by ID",
//     //       tags: ["Forum"],
//     //       operationId: "getCommentById",
//     //       parameters: [
//     //         { name: "postId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
//     //         { name: "commentId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "Comment",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Comment" },
//     //             },
//     //           },
//     //         },
//     //         "404": { description: "Comment not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schem : { $ref: "#/components/schemas/Error" } } },
//     //       }},
//     //     }},
//     //     put: {
//     //       summary: "Update comment",
//     //       description: "Updates a comment by ID. Author or admin only.",
//     //       tags: ["Forum"],
//     //       operationId: "updateComment",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [
//     //         { name: "postId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
//     //         { name: "commentId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
//     //       ],
//     //       requestBody: {
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/UpdateCommentRequest" },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "200": {
//     //           description: "Updated comment",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Comment" },
//     //             },
//     //           },
//     //         },
//     //         "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrors" } } }},
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "404": { description: "Comment not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       }},
//     //     }},
//     //     delete: {
//     //       summary: "Delete comment",
//     //       description: "Deletes a comment by ID. Author or admin only.",
//     //       tags: ["Forum"],
//     //       operationId: "deleteComment",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [
//     //         { name: "postId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
//     //         { name: "commentId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
//     //       ],
//     //       responses: {
//     //         "204": { description: "Comment deleted" },
//     //         "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }},
//     //         "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "404": { description: "Comment not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       }},
//     //     }},
//     //   }},
//     //   "/posts/{id}/likes": {
//     //     get: {
//     //       summary: "List likes for a post",
//     //       description: "Returns paginated list of users who liked the post.",
//     //       tags: ["Post likes"],
//     //       operationId: "getPostLikes",
//     //       parameters: [
//     //         { $ref: "#/components/parameters/UuidPath" },
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of post likes",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/PostLike" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "404": { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //         "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//     //       },
//     //     }},
//     //   }},
//     //   // ---------- Post likes ----------
//     //   "/post_likes": {
//     //     post: {
//     //       summary: "Like a post",
//     //       description: "Records a like for the given post by the given user. Idempotent for same post/user.",
//     //       tags: ["Post likes"],
//     //       operationId: "likePost",
//     //       security: [{ cookieAuth: [] }],
//     //       requestBody: {
//     //         required: true,
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/LikePostRequest" },
//     //           },
//     //         },
//     //       },
//     //       responses: {
//     //         "200": {
//     //           description: "Like recorded",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/PostLike" },
//     //             },
//     //           },
//     //         },
//     //         "400": {
//     //           description: "Missing postId or userId",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "object",
//     //                 properties: {
//     //                   error: { type: "boolean" },
//     //                   message: { type: "string" },
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     //   delete: {
//     //     summary: "Unlike a post",
//     //     description: "Removes a like for the given post and user. Requires postId and userId in body.",
//     //     tags: ["Post likes"],
//     //     operationId: "unlikePost",
//     //     requestBody: {
//     //       required: true,
//     //       content: {
//     //         "application/json": {
//     //           schema: { $ref: "#/components/schemas/LikePostRequest" },
//     //         },
//     //       },
//     //     },
//     //     responses: {
//     //       "200": {
//     //         description: "Unliked",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/Message" },
//     //           },
//     //         },
//     //       },
//     //       "400": {
//     //         description: "Missing postId or userId",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/Error" },
//     //           },
//     //         },
//     //       },
//     //       "500": {
//     //         description: "Internal server error",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/Error" },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // },

//     //   // ---------- Contact ----------
//     //   "/contact_messages": {
//     //     get: {
//     //       summary: "List contact messages",
//     //       tags: ["Contact"],
//     //       operationId: "getAllContactMessages",
//     //       parameters: [
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of contact messages",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/ContactMessage" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     //   post: {
//     //     summary: "Submit contact form",
//     //     description: "Public contact form submission. Contact messages are immutable (no PUT); admins can delete via Admin API.",
//     //     tags: ["Contact"],
//     //     operationId: "createContactMessage",
//     //     requestBody: {
//     //       required: true,
//     //       content: {
//     //         "application/json": {
//     //           schema: { $ref: "#/components/schemas/CreateContactMessageRequest" },
//     //         },
//     //       },
//     //     },
//     //     responses: {
//     //       "201": {
//     //         description: "Message submitted",
//     //         content: {
//     //           "application/json": {
//     //             schema: {
//     //               type: "object",
//     //               properties: {
//     //                 success: { type: "boolean", example: true },
//     //                 id: { type: "string", format: "uuid" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       "400": {
//     //         description: "Validation error",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/ValidationErrors" },
//     //           },
//     //         },
//     //       },
//     //       "500": {
//     //         description: "Internal server error",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/Error" },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // },
//     // "/contact_messages/unread_count": {
//     //     get: {
//     //       summary: "Get unread contact messages count",
//     //       tags: ["Contact"],
//     //       operationId: "getUnreadContactMessagesCount",
//     //       responses: {
//     //         "200": {
//     //           description: "Unread count",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "object",
//     //                 required: ["count"],
//     //                 properties: {
//     //                   count: { type: "integer" },
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // "/contact_messages/{id}/read": {
//     //   patch: {
//     //     summary: "Mark contact message as read",
//     //     tags: ["Contact"],
//     //     operationId: "markContactMessageAsRead",
//     //     parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     //     responses: {
//     //       "200": {
//     //         description: "Marked as read",
//     //         content: {
//     //           "application/json": {
//     //             schema: {
//     //               type: "object",
//     //               properties: {
//     //                 success: { type: "boolean", example: true },
//     //               },
//     //             },
//     //           },
//     //         },
//     //       },
//     //       "404": {
//     //         description: "Not found",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/Error" },
//     //           },
//     //         },
//     //       },
//     //       "500": {
//     //         description: "Internal server error",
//     //         content: {
//     //           "application/json": {
//     //             schema: { $ref: "#/components/schemas/Error" },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // },

//     // // ---------- Admin ----------
//     // "/admin/contact-messages": {
//     //     get: {
//     //       summary: "List contact messages (admin)",
//     //       description: "Admin-only. Same as GET /contact_messages.",
//     //       tags: ["Admin"],
//     //       operationId: "adminGetAllContactMessages",
//     //       security: [{ cookieAuth: [] }],
//     //       parameters: [
//     //         { $ref: "#/components/parameters/PageQuery" },
//     //         { $ref: "#/components/parameters/PageSizeQuery" },
//     //       ],
//     //       responses: {
//     //         "200": {
//     //           description: "List of contact messages",
//     //           content: {
//     //             "application/json": {
//     //               schema: {
//     //                 type: "array",
//     //                 items: { $ref: "#/components/schemas/ContactMessage" },
//     //               },
//     //             },
//     //           },
//     //         },
//     //         "401": {
//     //           description: "Authentication required",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "403": {
//     //           description: "Admin access required",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //         "500": {
//     //           description: "Internal server error",
//     //           content: {
//     //             "application/json": {
//     //               schema: { $ref: "#/components/schemas/Error" },
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   },
//     // },
//     "/galleries": {
//   get: {
//     summary: "List gallery items",
//     description: "Returns paginated gallery items. Optional query filter by category.",
//     tags: ["Gallery"],
//     operationId: "getAllGalleryItems",
//     parameters: [
//       { $ref: "#/components/parameters/PageQuery" },
//       { $ref: "#/components/parameters/PageSizeQuery" },
//       {
//         name: "category",
//         in: "query",
//         schema: { type: "string" },
//       },
//     ],
//     responses: {
//       "200": {
//         description: "List of gallery items",
//         content: {
//           "application/json": {
//             schema: {
//               type: "array",
//               items: { $ref: "#/components/schemas/GalleryItem" },
//             },
//           },
//         },
//       },
//       "500": {
//         description: "Internal server error",
//         content: {
//           "application/json": {
//             schema: { $ref: "#/components/schemas/Error" },
//           },
//         },
//       },
//     },
//   },
//   post: {
//     summary: "Create gallery item",
//     description: "Requires multipart/form-data with image file and fields. Protected by session auth in production.",
//     tags: ["Gallery"],
//     operationId: "createGalleryItem",
//     security: [{ cookieAuth: [] }],
//     requestBody: {
//       required: true,
//       content: {
//         "multipart/form-data": {
//           schema: {
//             type: "object",
//             required: ["title", "description", "category"],
//             properties: {
//               title: { type: "string" },
//               description: { type: "string" },
//               imageUrl: { type: "string", description: "Optional if file uploaded" },
//               altText: { type: "string" },
//               category: { type: "string" },
//             },
//           },
//         },
//       },
//     },
//     responses: {
//       "201": {
//         description: "Gallery item created",
//         content: {
//           "application/json": {
//             schema: { $ref: "#/components/schemas/GalleryItem" },
//           },
//         },
//       },
//       "400": {
//         description: "Image file required or validation error",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//       },
//       "401": {
//         description: "Authentication required",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//       },
//       "500": {
//         description: "Internal server error",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//       },
//     },
//   },
// },

// "/galleries/categories/{category}": {
//   get: {
//     summary: "List gallery items by category",
//     tags: ["Gallery"],
//     operationId: "getGalleryItemsByCategory",
//     parameters: [
//       { name: "category", in: "path", required: true, schema: { type: "string" } },
//       { $ref: "#/components/parameters/PageQuery" },
//       { $ref: "#/components/parameters/PageSizeQuery" },
//     ],
//     responses: {
//       "200": {
//         description: "List of gallery items",
//         content: {
//           "application/json": {
//             schema: {
//               type: "array",
//               items: { $ref: "#/components/schemas/GalleryItem" },
//             },
//           },
//         },
//       },
//       "500": {
//         description: "Internal server error",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//       },
//     },
//   },
// },

// "/galleries/{id}": {
//   get: {
//     summary: "Get gallery item by ID",
//     tags: ["Gallery"],
//     operationId: "getGalleryItemById",
//     parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     responses: {
//       "200": {
//         description: "Gallery item",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/GalleryItem" } } },
//       },
//       "404": {
//         description: "Not found",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//       },
//       "500": {
//         description: "Internal server error",
//         content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
//       },
//     },
//   },
//   post: {
//     summary: "Create gallery item by ID",
//     description: "Creates a new gallery item with a specific ID. Protected by session auth in production.",
//     tags: ["Gallery"],
//     operationId: "createGalleryItemById",
//     security: [{ cookieAuth: [] }],
//     parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     requestBody: {
//       required: true,
//       content: {
//         "application/json": { schema: { $ref: "#/components/schemas/CreateGalleryItemRequest" } },
//         "multipart/form-data": {
//           schema: {
//             type: "object",
//             required: ["title", "description", "category"],
//             properties: {
//               title: { type: "string" },
//               description: { type: "string" },
//               imageUrl: { type: "string" },
//               altText: { type: "string" },
//               category: { type: "string" },
//             },
//           },
//         },
//       },
//     },
//     responses: {
//       "201": { description: "Gallery item created", content: { "application/json": { schema: { $ref: "#/components/schemas/GalleryItem" } } } },
//       "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrors" } } } },
//       "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//       "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//     },
//   },
//   put: {
//     summary: "Update gallery item",
//     description: "Updates an existing gallery item by ID. Protected by session auth in production.",
//     tags: ["Gallery"],
//     operationId: "updateGalleryItem",
//     security: [{ cookieAuth: [] }],
//     parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     requestBody: {
//       content: {
//         "application/json": { schema: { $ref: "#/components/schemas/UpdateGalleryItemRequest" } },
//         "multipart/form-data": {
//           schema: {
//             type: "object",
//             properties: {
//               title: { type: "string" },
//               description: { type: "string" },
//               imageUrl: { type: "string" },
//               altText: { type: "string" },
//               category: { type: "string" },
//             },
//           },
//         },
//       },
//     },
//     responses: {
//       "200": { description: "Updated gallery item", content: { "application/json": { schema: { $ref: "#/components/schemas/GalleryItem" } } } },
//       "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrors" } } } },
//       "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//       "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//       "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//     },
//   },
//   delete: {
//     summary: "Delete gallery item",
//     description: "Deletes a gallery item by ID. Protected by session auth in production.",
//     tags: ["Gallery"],
//     operationId: "deleteGalleryItem",
//     security: [{ cookieAuth: [] }],
//     parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//     responses: {
//       "204": { description: "Gallery item deleted" },
//       "401": { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//       "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//       "500": { description: "Internal server error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
//     },
//   },
// },


//     "/admin/contact-messages/{id}": {
//       get: {
//         summary: "Get contact message by ID (admin)",
//         description: "Admin-only. Returns a single contact message by UUID.",
//         tags: ["Admin"],
//         operationId: "adminGetContactMessageById",
//         security: [{ cookieAuth: [] }],
//         parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//         responses: {
//           "200": {
//             description: "Contact message",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/ContactMessage" },
//               },
//             },
//           },
//           "401": {
//             description: "Authentication required",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "403": {
//             description: "Admin access required",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "404": {
//             description: "Not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//       delete: {
//         summary: "Delete contact message (admin)",
//         description: "Admin-only. Permanently deletes a contact message.",
//         tags: ["Admin"],
//         operationId: "adminDeleteContactMessage",
//         security: [{ cookieAuth: [] }],
//         parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//         responses: {
//           "204": {
//             description: "Contact message deleted",
//           },
//           "401": {
//             description: "Authentication required",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "403": {
//             description: "Admin access required",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "404": {
//             description: "Not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },
//     "/admin/contact-messages/{id}/read": {
//       patch: {
//         summary: "Mark contact message as read (admin)",
//         tags: ["Admin"],
//         operationId: "adminMarkContactMessageAsRead",
//         security: [{ cookieAuth: [] }],
//         parameters: [{ $ref: "#/components/parameters/UuidPath" }],
//         responses: {
//           "200": {
//             description: "Marked as read",
//             content: {
//               "application/json": {
//                 schema: {
//                   type: "object",
//                   properties: {
//                     success: { type: "boolean", example: true },
//                   },
//                 },
//               },
//             },
//           },
//           "401": {
//             description: "Authentication required",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "403": {
//             description: "Admin access required",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "404": {
//             description: "Not found",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//           "500": {
//             description: "Internal server error",
//             content: {
//               "application/json": {
//                 schema: { $ref: "#/components/schemas/Error" },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
//   components: {
//       securitySchemes: {
//         cookieAuth: {
//           type: "apiKey",
//           in: "cookie",
//           name: "connect.sid",
//           description: "Session cookie set by the server after login. Send with credentials.",
//         },
//       },
//       parameters: {
//         PageQuery: {
//           name: "page",
//           in: "query",
//           description: "Page number (1-based)",
//           schema: { type: "integer", minimum: 1, default: 1 },
//         },
//         PageSizeQuery: {
//           name: "pageSize",
//           in: "query",
//           description: "Items per page",
//           schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
//         },
//         UuidPath: {
//           name: "id",
//           in: "path",
//           required: true,
//           description: "UUID of the resource",
//           schema: { type: "string", format: "uuid" },
//         },
//         IdPath: {
//           name: "id",
//           in: "path",
//           required: true,
//           schema: { type: "string" },
//         },
//       },
//       schemas: {
//         Error: {
//           type: "object",
//           required: ["success", "error", "timestamp", "path"],
//           properties: {
//             success: { type: "boolean", example: false },
//             error: {
//               type: "object",
//               required: ["message"],
//               properties: {
//                 message: { type: "string" },
//                 code: { type: "string" },
//                 details: {},
//                 stack: { type: "string", description: "Only in non-production" },
//               },
//             },
//             requestId: { type: "string" },
//             timestamp: { type: "string", format: "date-time" },
//             path: { type: "string" },
//           },
//         },
//         Message: {
//           type: "object",
//           properties: {
//             message: { type: "string" },
//           },
//         },
//         ValidationErrors: {
//           type: "object",
//           properties: {
//             errors: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   path: { type: "array", items: { type: "string" } },
//                   message: { type: "string" },
//                 },
//               },
//             },
//           },
//         },
//         User: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             username: { type: "string" },
//             email: { type: "string", format: "email" },
//             fullName: { type: "string" },
//             userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
//             profileImage: { type: "string", nullable: true },
//             bio: { type: "string", nullable: true },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//             deletedAt: { type: "string", format: "date-time", nullable: true },
//           },
//         },
//         UserPublic: {
//           type: "object",
//           description: "User without password (e.g. login/register response)",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             username: { type: "string" },
//             email: { type: "string", format: "email" },
//             fullName: { type: "string" },
//             userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
//             profileImage: { type: "string", nullable: true },
//             bio: { type: "string", nullable: true },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//           },
//         },
//         RegisterRequest: {
//           type: "object",
//           required: ["username", "password", "email", "fullName"],
//           properties: {
//             username: { type: "string", minLength: 3 },
//             password: { type: "string", minLength: 6 },
//             email: { type: "string", format: "email" },
//             fullName: { type: "string", minLength: 2 },
//             profileImage: { type: "string" },
//             bio: { type: "string" },
//           },
//         },
//         LoginRequest: {
//           type: "object",
//           required: ["username", "password"],
//           properties: {
//             username: { type: "string", description: "Username or email" },
//             password: { type: "string" },
//           },
//         },
//         CreateUserRequest: {
//           type: "object",
//           required: ["username", "password", "email", "fullName"],
//           properties: {
//             username: { type: "string", minLength: 3 },
//             password: { type: "string", minLength: 6 },
//             email: { type: "string", format: "email" },
//             fullName: { type: "string", minLength: 2 },
//             userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
//             profileImage: { type: "string" },
//             bio: { type: "string" },
//           },
//         },
//         UpdateUserRequest: {
//           type: "object",
//           properties: {
//             username: { type: "string", minLength: 3 },
//             email: { type: "string", format: "email" },
//             fullName: { type: "string", minLength: 2 },
//             userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
//             profileImage: { type: "string" },
//             bio: { type: "string" },
//           },
//         },
//         HistoryContent: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             title: { type: "string" },
//             slug: { type: "string" },
//             content: { type: "string" },
//             metaDescription: { type: "string" },
//             keywords: { type: "string" },
//             imageUrl: { type: "string", nullable: true },
//             authorId: { type: "string", format: "uuid", nullable: true },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//             deletedAt: { type: "string", format: "date-time", nullable: true },
//           },
//         },
//         CreateHistoryContentRequest: {
//           type: "object",
//           required: ["title", "slug", "content", "metaDescription", "keywords"],
//           properties: {
//             title: { type: "string" },
//             slug: { type: "string" },
//             content: { type: "string" },
//             metaDescription: { type: "string" },
//             keywords: { type: "string" },
//             imageUrl: { type: "string" },
//             authorId: { type: "string", format: "uuid" },
//           },
//         },
//         UpdateHistoryContentRequest: {
//           type: "object",
//           properties: {
//             title: { type: "string" },
//             slug: { type: "string" },
//             content: { type: "string" },
//             metaDescription: { type: "string" },
//             keywords: { type: "string" },
//             imageUrl: { type: "string" },
//             authorId: { type: "string", format: "uuid" },
//           },
//         },
//         GalleryItem: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             title: { type: "string" },
//             description: { type: "string" },
//             imageUrl: { type: "string" },
//             altText: { type: "string", nullable: true },
//             category: { type: "string" },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//           },
//         },
//         UpdateGalleryItemRequest: {
//           type: "object",
//           properties: {
//             title: { type: "string" },
//             description: { type: "string" },
//             imageUrl: { type: "string" },
//             altText: { type: "string" },
//             category: { type: "string" },
//           },
//         },
//         Booking: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             userId: { type: "string", format: "uuid", nullable: true },
//             fullName: { type: "string", nullable: true },
//             email: { type: "string", nullable: true },
//             phone: { type: "string", nullable: true },
//             visitDate: { type: "string", format: "date-time" },
//             groupSize: { type: "string" },
//             tourType: { type: "string" },
//             specialRequests: { type: "string", nullable: true },
//             status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//           },
//         },
//         CreateBookingRequest: {
//           type: "object",
//           required: ["fullName", "email", "phone", "visitDate", "groupSize", "tourType"],
//           properties: {
//             fullName: { type: "string" },
//             email: { type: "string", format: "email" },
//             phone: { type: "string", minLength: 6 },
//             visitDate: { type: "string", format: "date-time" },
//             groupSize: { type: "string" },
//             tourType: { type: "string" },
//             specialRequests: { type: "string" },
//           },
//         },
//         UpdateBookingRequest: {
//           type: "object",
//           properties: {
//             fullName: { type: "string" },
//             email: { type: "string", format: "email" },
//             phone: { type: "string", minLength: 6 },
//             visitDate: { type: "string", format: "date-time" },
//             groupSize: { type: "string" },
//             tourType: { type: "string" },
//             specialRequests: { type: "string" },
//             status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
//           },
//         },
//         Post: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             authorId: { type: "string", format: "uuid" },
//             title: { type: "string" },
//             slug: { type: "string" },
//             content: { type: "string" },
//             isAttendantOnly: { type: "boolean" },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//             deletedAt: { type: "string", format: "date-time", nullable: true },
//           },
//         },
//         CreatePostRequest: {
//           type: "object",
//           required: ["title", "slug", "content"],
//           properties: {
//             title: { type: "string" },
//             slug: { type: "string" },
//             content: { type: "string" },
//             isAttendantOnly: { type: "boolean", default: false },
//           },
//         },
//         Comment: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             postId: { type: "string", format: "uuid" },
//             authorId: { type: "string", format: "uuid" },
//             content: { type: "string" },
//             createdAt: { type: "string", format: "date-time" },
//             updatedAt: { type: "string", format: "date-time" },
//           },
//         },
//         UpdateCommentRequest: {
//           type: "object",
//           properties: {
//             content: { type: "string", minLength: 1 },
//           },
//         },
//         PostLike: {
//           type: "object",
//           description: "A like on a forum post",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             postId: { type: "string", format: "uuid" },
//             userId: { type: "string", format: "uuid" },
//             createdAt: { type: "string", format: "date-time" },
//           },
//         },
//         LikePostRequest: {
//           type: "object",
//           required: ["postId", "userId"],
//           description: "Body for like and unlike post operations",
//           properties: {
//             postId: { type: "string", format: "uuid" },
//             userId: { type: "string", format: "uuid" },
//           },
//         },
//         ContactMessage: {
//           type: "object",
//           properties: {
//             id: { type: "string", format: "uuid" },
//             fullName: { type: "string" },
//             email: { type: "string", format: "email" },
//             subject: { type: "string" },
//             message: { type: "string" },
//             isRead: { type: "boolean" },
//             createdAt: { type: "string", format: "date-time" },
//           },
//         },
//         CreateContactMessageRequest: {
//           type: "object",
//           required: ["fullName", "email", "subject", "message"],
//           properties: {
//             fullName: { type: "string" },
//             email: { type: "string", format: "email" },
//             subject: { type: "string" },
//             message: { type: "string", minLength: 10 },
//           },
//         },
//         UpdateContactMessageRequest: {
//           type: "object",
//           properties: {
//             fullName: { type: "string" },
//             email: { type: "string", format: "email" },
//             subject: { type: "string" },
//             message: { type: "string", minLength: 10 },
//             isRead: { type: "boolean" },
//           },
//         },
//     },
//   },
// };
// export default spec;

/**
 * OpenAPI 3.0.3 spec for Museum Management REST API.
 * Served at GET /api-docs (Swagger UI) and GET /api-docs.json (raw JSON).
 * Base path: /api/v1
 */

const API_VERSION = process.env.npm_package_version ?? "1.0.0";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spec: Record<string, any> = {
  openapi: "3.0.3",
  info: {
    title: "Museum Management REST API",
    version: API_VERSION,
    description:
      "REST API for a digital museum platform: content management, session-based auth, bookings, forum, gallery, and real-time features.\n\n**Security:** Authenticated endpoints use session-based auth via `connect.sid` cookie. Call `/login` or `/register` with credentials to obtain a session. Use **Try it out** in Swagger UI with credentials enabled to test protected endpoints.\n\n**CRUD by collection:** History and Gallery support full CRUD (GET list, GET by id, POST, PUT, DELETE). Post likes use POST (like) and DELETE (unlike) only—no PUT, since a like is binary. Contact form messages are immutable from the public API (POST only); GET list, GET unread count, and PATCH read are available. Admin-only operations (see Admin tag) include GET/DELETE contact messages and marking as read.",
    contact: {
      name: "API support",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    { url: "/api/v1", description: "API v1 base path" },
  ],
  tags: [
    { name: "Health", description: "Liveness and readiness probes" },
    { name: "Auth", description: "Registration, login, logout, current user" },
    { name: "Users", description: "User CRUD and profile" },
    { name: "History", description: "History content CRUD" },
    { name: "Gallery", description: "Gallery items" },
    { name: "Bookings", description: "Visit bookings" },
    { name: "Forum", description: "Posts and comments" },
    { name: "Post likes", description: "Like/unlike posts" },
    { name: "Contact", description: "Contact form and messages" },
    { name: "Admin", description: "Admin-only operations: contact messages list, get by ID, mark read, delete" },
  ],
  paths: {
    // ---------- Health ----------
    "/health": {
      get: {
        summary: "Health check (readiness)",
        description:
          "Returns service and dependency status. Use for load balancer readiness. Returns 503 if DB is down.",
        tags: ["Health"],
        operationId: "getHealth",
        responses: {
          "200": {
            description: "Healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["success", "data"],
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        status: { type: "string", enum: ["healthy", "unhealthy"] },
                        timestamp: { type: "string", format: "date-time" },
                        version: { type: "string" },
                        checks: {
                          type: "object",
                          additionalProperties: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "503": {
            description: "Unhealthy (e.g. database down)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/live": {
      get: {
        summary: "Liveness probe",
        description:
          "Returns 200 if the process is running. Does not check dependencies. Use for Kubernetes liveness.",
        tags: ["Health"],
        operationId: "getLive",
        responses: {
          "200": {
            description: "Process is alive",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["success", "data"],
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        status: { type: "string", example: "alive" },
                        timestamp: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/ready": {
      get: {
        summary: "Readiness probe",
        description: "Same as /health. Returns 200 when service and DB are ready to accept traffic.",
        tags: ["Health"],
        operationId: "getReady",
        responses: {
          "200": { description: "Ready" },
          "503": {
            description: "Not ready",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Auth ----------
    "/register": {
      post: {
        summary: "Register and log in",
        description: "Creates a new user and logs them in. Returns user (no password).",
        tags: ["Auth"],
        operationId: "register",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created and logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserPublic" },
              },
            },
          },
          "400": {
            description: "Username or email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        summary: "Log in",
        description: "Authenticates with username/email and password. Sets session cookie.",
        tags: ["Auth"],
        operationId: "login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserPublic" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/logout": {
      post: {
        summary: "Log out",
        description: "Destroys the current session.",
        tags: ["Auth"],
        operationId: "logout",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Logged out" },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/current_user": {
      get: {
        summary: "Get current user",
        description: "Returns the authenticated user (no password).",
        tags: ["Auth"],
        operationId: "getCurrentUser",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserPublic" },
              },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Users ----------
    "/users": {
      get: {
        summary: "List users",
        description: "Returns paginated users. Optional filter by role.",
        tags: ["Users"],
        operationId: "getAllUsers",
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
          {
            name: "role",
            in: "query",
            description: "Filter by user role",
            schema: { type: "string", enum: ["visitor", "attendant", "admin"] },
          },
        ],
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create user",
        description: "Creates a new user (admin/registration use).",
        tags: ["Users"],
        operationId: "createUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Get user by ID or username",
        description:
          "Path parameter may be user UUID or username (route order determines which handler runs).",
        tags: ["Users"],
        operationId: "getUserById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "User UUID or username",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "User",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update user",
        tags: ["Users"],
        operationId: "updateUser",
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete user by ID",
        tags: ["Users"],
        operationId: "deleteUserById",
        parameters: [{ $ref: "#/components/parameters/IdPath" }],
        responses: {
          "204": { description: "User deleted" },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- History ----------
    "/histories": {
      get: {
        summary: "List history content",
        description: "Returns paginated history content.",
        tags: ["History"],
        operationId: "getAllHistoryContent",
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of history content",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/HistoryContent" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create history content",
        description: "Creates new history content. Protected by session auth in production.",
        tags: ["History"],
        operationId: "createHistoryContent",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateHistoryContentRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "History content created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HistoryContent" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/histories/{id}": {
      get: {
        summary: "Get history content by ID or slug",
        description:
          "Path parameter may be UUID or slug. Route order on server determines which resolver runs.",
        tags: ["History"],
        operationId: "getHistoryContentById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "History content UUID or slug",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "History content",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HistoryContent" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update history content",
        description: "Updates existing history content by UUID. Protected by session auth in production.",
        tags: ["History"],
        operationId: "updateHistoryContent",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateHistoryContentRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated history content",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HistoryContent" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete history content",
        description: "Soft-deletes history content by UUID. Protected by session auth in production.",
        tags: ["History"],
        operationId: "deleteHistoryContent",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Gallery ----------
    "/galleries": {
      get: {
        summary: "List gallery items",
        description: "Returns paginated gallery items. Optional query filter by category.",
        tags: ["Gallery"],
        operationId: "getAllGalleryItems",
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "List of gallery items",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/GalleryItem" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create gallery item",
        description: "Requires multipart/form-data with image file and fields. Protected by session auth in production.",
        tags: ["Gallery"],
        operationId: "createGalleryItem",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "category"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  imageUrl: { type: "string", description: "Optional if file uploaded" },
                  altText: { type: "string" },
                  category: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Gallery item created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GalleryItem" },
              },
            },
          },
          "400": {
            description: "Image file required or validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/galleries/categories/{category}": {
      get: {
        summary: "List gallery items by category",
        tags: ["Gallery"],
        operationId: "getGalleryItemsByCategory",
        parameters: [
          {
            name: "category",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of gallery items",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/GalleryItem" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/galleries/{id}": {
      get: {
        summary: "Get gallery item by ID",
        tags: ["Gallery"],
        operationId: "getGalleryItemById",
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Gallery item",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GalleryItem" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update gallery item",
        description: "Updates an existing gallery item by ID. Protected by session auth in production.",
        tags: ["Gallery"],
        operationId: "updateGalleryItem",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateGalleryItemRequest" },
            },
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  imageUrl: { type: "string" },
                  altText: { type: "string" },
                  category: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated gallery item",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GalleryItem" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete gallery item",
        description: "Deletes a gallery item by ID. Protected by session auth in production.",
        tags: ["Gallery"],
        operationId: "deleteGalleryItem",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "204": { description: "Gallery item deleted" },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Bookings ----------
    "/bookings": {
      get: {
        summary: "List bookings",
        description:
          "Authenticated. Visitors see only their bookings; attendants/admins see all. Optional filter by status (query).",
        tags: ["Bookings"],
        operationId: "getAllBookings",
        security: [{ cookieAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
          },
        ],
        responses: {
          "200": {
            description: "List of bookings",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Booking" },
                },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create booking",
        description: "Creates a booking. If authenticated, userId is set from session. Sends WebSocket event.",
        tags: ["Bookings"],
        operationId: "createBooking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBookingRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Booking created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/bookings/{id}": {
      get: {
        summary: "Get booking by ID",
        tags: ["Bookings"],
        operationId: "getBookingById",
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Booking",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update booking",
        description: "Full update of a booking by ID. Authenticated; visitors may only update their own.",
        tags: ["Bookings"],
        operationId: "updateBooking",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBookingRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated booking",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete booking",
        description: "Deletes a booking by ID. Authenticated; visitors may only delete their own.",
        tags: ["Bookings"],
        operationId: "deleteBooking",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "204": { description: "Booking deleted" },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/bookings/users/{userId}": {
      get: {
        summary: "List bookings by user ID",
        tags: ["Bookings"],
        operationId: "getBookingsByUserId",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of bookings",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Booking" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/bookings/attendant/{id}/status": {
      patch: {
        summary: "Update booking status (attendant)",
        description: "Attendant or admin only. Sets status to pending, confirmed, or cancelled.",
        tags: ["Bookings"],
        operationId: "updateBookingStatus",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated booking",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "400": {
            description: "Invalid status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Access denied",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Booking not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Forum (posts & comments) ----------
    "/posts": {
      get: {
        summary: "List posts",
        description:
          "Optional query attendantOnly=true (requires attendant/admin). Paginated.",
        tags: ["Forum"],
        operationId: "getAllPosts",
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
          {
            name: "attendantOnly",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
          },
        ],
        responses: {
          "200": {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
          "403": {
            description: "Access denied (attendant-only filter without role)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create post",
        description: "Authenticated. Sends WebSocket event on success.",
        tags: ["Forum"],
        operationId: "createPost",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Post created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "403": {
            description: "Access denied (e.g. attendant-only post as visitor)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      get: {
        summary: "Get post by ID",
        description: "Returns 403 for attendant-only posts if user is not attendant/admin.",
        tags: ["Forum"],
        operationId: "getPostById",
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          "403": {
            description: "Access denied",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update post",
        description: "Updates a post by ID. Author or admin only. Sends WebSocket event.",
        tags: ["Forum"],
        operationId: "updatePost",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePostRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete post",
        description: "Deletes a post by ID. Author or admin only. Sends WebSocket event.",
        tags: ["Forum"],
        operationId: "deletePost",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "204": { description: "Post deleted" },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}/comments": {
      get: {
        summary: "List comments for a post",
        tags: ["Forum"],
        operationId: "getCommentsByPostId",
        parameters: [
          { $ref: "#/components/parameters/UuidPath" },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of comments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Add comment to post",
        description: "Authenticated. Sends WebSocket event.",
        tags: ["Forum"],
        operationId: "createComment",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Comment created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "403": {
            description: "Access denied (e.g. attendant-only post)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/{postId}/comments/{commentId}": {
      get: {
        summary: "Get comment by ID",
        tags: ["Forum"],
        operationId: "getCommentById",
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Comment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          "404": {
            description: "Comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update comment",
        description: "Updates a comment by ID. Author or admin only.",
        tags: ["Forum"],
        operationId: "updateComment",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCommentRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated comment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete comment",
        description: "Deletes a comment by ID. Author or admin only.",
        tags: ["Forum"],
        operationId: "deleteComment",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "204": { description: "Comment deleted" },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Comment not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}/likes": {
      get: {
        summary: "List likes for a post",
        description: "Returns paginated list of users who liked the post.",
        tags: ["Post likes"],
        operationId: "getPostLikes",
        parameters: [
          { $ref: "#/components/parameters/UuidPath" },
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of post likes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PostLike" },
                },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Post likes ----------
    "/post_likes": {
      post: {
        summary: "Like a post",
        description: "Records a like for the given post by the given user. Idempotent for same post/user.",
        tags: ["Post likes"],
        operationId: "likePost",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LikePostRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Like recorded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostLike" },
              },
            },
          },
          "400": {
            description: "Missing postId or userId",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Unlike a post",
        description: "Removes a like for the given post and user. Requires postId and userId in body.",
        tags: ["Post likes"],
        operationId: "unlikePost",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LikePostRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Unliked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Message" },
              },
            },
          },
          "400": {
            description: "Missing postId or userId",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Contact ----------
    "/contact_messages": {
      get: {
        summary: "List contact messages",
        tags: ["Contact"],
        operationId: "getAllContactMessages",
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of contact messages",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ContactMessage" },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Submit contact form",
        description: "Public contact form submission. Contact messages are immutable (no PUT); admins can delete via Admin API.",
        tags: ["Contact"],
        operationId: "createContactMessage",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateContactMessageRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Message submitted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    id: { type: "string", format: "uuid" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrors" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/contact_messages/unread_count": {
      get: {
        summary: "Get unread contact messages count",
        tags: ["Contact"],
        operationId: "getUnreadContactMessagesCount",
        responses: {
          "200": {
            description: "Unread count",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["count"],
                  properties: {
                    count: { type: "integer" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/contact_messages/{id}/read": {
      patch: {
        summary: "Mark contact message as read",
        tags: ["Contact"],
        operationId: "markContactMessageAsRead",
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ---------- Admin ----------
    "/admin/contact-messages": {
      get: {
        summary: "List contact messages (admin)",
        description: "Admin-only. Same as GET /contact_messages.",
        tags: ["Admin"],
        operationId: "adminGetAllContactMessages",
        security: [{ cookieAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/PageQuery" },
          { $ref: "#/components/parameters/PageSizeQuery" },
        ],
        responses: {
          "200": {
            description: "List of contact messages",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ContactMessage" },
                },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/admin/contact-messages/{id}": {
      get: {
        summary: "Get contact message by ID (admin)",
        description: "Admin-only. Returns a single contact message by UUID.",
        tags: ["Admin"],
        operationId: "adminGetContactMessageById",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Contact message",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactMessage" },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete contact message (admin)",
        description: "Admin-only. Permanently deletes a contact message.",
        tags: ["Admin"],
        operationId: "adminDeleteContactMessage",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "204": {
            description: "Contact message deleted",
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/admin/contact-messages/{id}/read": {
      patch: {
        summary: "Mark contact message as read (admin)",
        tags: ["Admin"],
        operationId: "adminMarkContactMessageAsRead",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UuidPath" }],
        responses: {
          "200": {
            description: "Marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          "401": {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "403": {
            description: "Admin access required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description: "Session cookie set by the server after login. Send with credentials.",
      },
    },
    parameters: {
      PageQuery: {
        name: "page",
        in: "query",
        description: "Page number (1-based)",
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      PageSizeQuery: {
        name: "pageSize",
        in: "query",
        description: "Items per page",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      UuidPath: {
        name: "id",
        in: "path",
        required: true,
        description: "UUID of the resource",
        schema: { type: "string", format: "uuid" },
      },
      IdPath: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["success", "error", "timestamp", "path"],
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            required: ["message"],
            properties: {
              message: { type: "string" },
              code: { type: "string" },
              details: {},
              stack: { type: "string", description: "Only in non-production" },
            },
          },
          requestId: { type: "string" },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
        },
      },
      Message: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      ValidationErrors: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "array", items: { type: "string" } },
                message: { type: "string" },
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          fullName: { type: "string" },
          userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
          profileImage: { type: "string", nullable: true },
          bio: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
      UserPublic: {
        type: "object",
        description: "User without password (e.g. login/register response)",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          fullName: { type: "string" },
          userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
          profileImage: { type: "string", nullable: true },
          bio: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["username", "password", "email", "fullName"],
        properties: {
          username: { type: "string", minLength: 3 },
          password: { type: "string", minLength: 6 },
          email: { type: "string", format: "email" },
          fullName: { type: "string", minLength: 2 },
          profileImage: { type: "string" },
          bio: { type: "string" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", description: "Username or email" },
          password: { type: "string" },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["username", "password", "email", "fullName"],
        properties: {
          username: { type: "string", minLength: 3 },
          password: { type: "string", minLength: 6 },
          email: { type: "string", format: "email" },
          fullName: { type: "string", minLength: 2 },
          userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
          profileImage: { type: "string" },
          bio: { type: "string" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          username: { type: "string", minLength: 3 },
          email: { type: "string", format: "email" },
          fullName: { type: "string", minLength: 2 },
          userType: { type: "string", enum: ["visitor", "attendant", "admin"] },
          profileImage: { type: "string" },
          bio: { type: "string" },
        },
      },
      HistoryContent: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          metaDescription: { type: "string" },
          keywords: { type: "string" },
          imageUrl: { type: "string", nullable: true },
          authorId: { type: "string", format: "uuid", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
      CreateHistoryContentRequest: {
        type: "object",
        required: ["title", "slug", "content", "metaDescription", "keywords"],
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          metaDescription: { type: "string" },
          keywords: { type: "string" },
          imageUrl: { type: "string" },
          authorId: { type: "string", format: "uuid" },
        },
      },
      UpdateHistoryContentRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          metaDescription: { type: "string" },
          keywords: { type: "string" },
          imageUrl: { type: "string" },
          authorId: { type: "string", format: "uuid" },
        },
      },
      GalleryItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          altText: { type: "string", nullable: true },
          category: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateGalleryItemRequest: {
        type: "object",
        required: ["title", "description", "imageUrl", "category"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          altText: { type: "string" },
          category: { type: "string" },
        },
      },
      UpdateGalleryItemRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          altText: { type: "string" },
          category: { type: "string" },
        },
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid", nullable: true },
          fullName: { type: "string", nullable: true },
          email: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          visitDate: { type: "string", format: "date-time" },
          groupSize: { type: "string" },
          tourType: { type: "string" },
          specialRequests: { type: "string", nullable: true },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateBookingRequest: {
        type: "object",
        required: ["fullName", "email", "phone", "visitDate", "groupSize", "tourType"],
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string", minLength: 6 },
          visitDate: { type: "string", format: "date-time" },
          groupSize: { type: "string" },
          tourType: { type: "string" },
          specialRequests: { type: "string" },
        },
      },
      UpdateBookingRequest: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string", minLength: 6 },
          visitDate: { type: "string", format: "date-time" },
          groupSize: { type: "string" },
          tourType: { type: "string" },
          specialRequests: { type: "string" },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled"] },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          authorId: { type: "string", format: "uuid" },
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          isAttendantOnly: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
      },
      CreatePostRequest: {
        type: "object",
        required: ["title", "slug", "content"],
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          isAttendantOnly: { type: "boolean", default: false },
        },
      },
      UpdatePostRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          content: { type: "string" },
          isAttendantOnly: { type: "boolean" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          postId: { type: "string", format: "uuid" },
          authorId: { type: "string", format: "uuid" },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UpdateCommentRequest: {
        type: "object",
        properties: {
          content: { type: "string", minLength: 1 },
        },
      },
      PostLike: {
        type: "object",
        description: "A like on a forum post",
        properties: {
          id: { type: "string", format: "uuid" },
          postId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      LikePostRequest: {
        type: "object",
        required: ["postId", "userId"],
        description: "Body for like and unlike post operations",
        properties: {
          postId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
        },
      },
      ContactMessage: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          subject: { type: "string" },
          message: { type: "string" },
          isRead: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateContactMessageRequest: {
        type: "object",
        required: ["fullName", "email", "subject", "message"],
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          subject: { type: "string" },
          message: { type: "string", minLength: 10 },
        },
      },
      UpdateContactMessageRequest: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          subject: { type: "string" },
          message: { type: "string", minLength: 10 },
          isRead: { type: "boolean" },
        },
      },
    },
  },
};

export default spec;