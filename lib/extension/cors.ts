import { getExtensionOrigin } from "./config";

/**
 * The extension's service worker calls these routes cross-origin, so every
 * /api/extension response needs CORS headers. The allowed origin is exactly our
 * own extension — never `*`, since these responses carry tokens and user data.
 */

const corsHeaders = (origin: string): Record<string, string> => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  // The allowed origin varies with the request, so caches must not share responses.
  Vary: "Origin",
});

const isAllowedOrigin = (request: Request): boolean =>
  request.headers.get("origin") === getExtensionOrigin();

/** Handles the preflight. Unknown origins get a bare 403 with no CORS headers. */
export const handlePreflight = (request: Request): Response => {
  if (!isAllowedOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, { status: 204, headers: corsHeaders(getExtensionOrigin()) });
};

/**
 * Wraps a JSON body in a CORS-enabled response. Requests from an unexpected
 * origin still get the body — the browser blocks the read, and the routes
 * themselves are bearer-authenticated, so CORS is defence in depth here rather
 * than the access control itself.
 */
export const jsonResponse = (request: Request, body: unknown, status = 200): Response => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // These responses are per-user and short-lived; never let anything cache them.
    "Cache-Control": "no-store",
  };

  if (isAllowedOrigin(request)) {
    Object.assign(headers, corsHeaders(getExtensionOrigin()));
  }

  return new Response(JSON.stringify(body), { status, headers });
};

export const errorResponse = (request: Request, message: string, status: number): Response =>
  jsonResponse(request, { error: message }, status);
