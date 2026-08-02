import { errorResponse, handlePreflight, jsonResponse } from "@/lib/extension/cors";
import { mintToken, verifyToken } from "@/lib/extension/tokens";

export const OPTIONS = handlePreflight;

/**
 * Exchanges a one-time pairing code from /extension/connect for the token pair
 * the extension actually stores. This is the only place the extension gets
 * credentials from a browser session rather than from a refresh token.
 */
export const POST = async (request: Request): Promise<Response> => {
  let code: unknown;

  try {
    ({ code } = await request.json());
  } catch {
    return errorResponse(request, "Malformed request body.", 400);
  }

  if (typeof code !== "string") {
    return errorResponse(request, "Missing pairing code.", 400);
  }

  const user = verifyToken(code, "pair");

  if (!user) {
    return errorResponse(request, "Pairing code is invalid or expired.", 401);
  }

  const access = mintToken("access", user);
  const refresh = mintToken("refresh", user);

  return jsonResponse(request, {
    accessToken: access.token,
    expiresAt: access.expiresAt,
    refreshToken: refresh.token,
    refreshExpiresAt: refresh.expiresAt,
    user,
  });
};
