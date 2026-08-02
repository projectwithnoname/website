import { errorResponse, handlePreflight, jsonResponse } from "@/lib/extension/cors";
import { mintToken, verifyToken } from "@/lib/extension/tokens";

export const OPTIONS = handlePreflight;

export const POST = async (request: Request): Promise<Response> => {
  let refreshToken: unknown;

  try {
    ({ refreshToken } = await request.json());
  } catch {
    return errorResponse(request, "Malformed request body.", 400);
  }

  if (typeof refreshToken !== "string") {
    return errorResponse(request, "Missing refresh token.", 400);
  }

  const user = verifyToken(refreshToken, "refresh");

  if (!user) {
    return errorResponse(request, "Refresh token is invalid or expired.", 401);
  }

  const access = mintToken("access", user);
  const rotated = mintToken("refresh", user);

  return jsonResponse(request, {
    accessToken: access.token,
    expiresAt: access.expiresAt,
    refreshToken: rotated.token,
    refreshExpiresAt: rotated.expiresAt,
    user,
  });
};
