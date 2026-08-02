import { errorResponse, handlePreflight, jsonResponse } from "@/lib/extension/cors";
import { readBearerToken, verifyToken } from "@/lib/extension/tokens";

export const OPTIONS = handlePreflight;

export const GET = async (request: Request): Promise<Response> => {
  const token = readBearerToken(request);

  if (!token) {
    return errorResponse(request, "Missing bearer token.", 401);
  }

  const user = verifyToken(token, "access");

  if (!user) {
    return errorResponse(request, "Access token is invalid or expired.", 401);
  }

  return jsonResponse(request, { user });
};
