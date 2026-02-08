/**
 * Standard REST API response types (production-ready).
 * All successful responses use a consistent envelope; errors use StandardErrorResponse from error-response.
 */

/** Metadata for list responses (pagination, etc.) */
export interface ApiResponseMeta {
  /** Current page (1-based) when paginated */
  page?: number;
  /** Items per page */
  pageSize?: number;
  /** Total number of items */
  total?: number;
  /** ISO timestamp of the response */
  timestamp: string;
}

/** Standard success envelope for single-resource and action responses */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  /** Optional metadata (e.g. pagination, version) */
  meta?: ApiResponseMeta;
}

/** Health check component status */
export interface HealthCheckComponent {
  status: "up" | "down";
  /** Optional message or latency hint */
  message?: string;
}

/** Health check response body (used by GET /health) */
export interface HealthCheckData {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  checks: Record<string, string | HealthCheckComponent>;
}

/** Helper to build a success response object */
export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<ApiResponseMeta>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta && {
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    }),
  };
}
