import { handlePreflight, jsonResponse } from "@/lib/extension/cors";
import { readBearerToken, verifyToken } from "@/lib/extension/tokens";

export const OPTIONS = handlePreflight;

/**
 * Sign-out endpoint for the extension.
 *
 * IMPORTANT: with no datastore this cannot actually invalidate anything — the
 * tokens are self-contained, so a copy taken before sign-out stays valid until
 * it expires. The real sign-out is the extension clearing its own storage. This
 * route exists so there is one call site to make authoritative once revocation
 * has somewhere to write to (a jti denylist keyed by user).
 *
 * It always reports success so a sign-out can never get stuck client-side.
 */
export const POST = async (request: Request): Promise<Response> => {
  const token = readBearerToken(request);
  const user = token ? verifyToken(token, "access") : null;

  if (user) {
    // TODO: once a datastore exists, add this user's tokens to a denylist here.
  }

  return jsonResponse(request, { ok: true });
};
