import { createHmac } from "node:crypto";

import type { AppUser } from "./session";

const TTL_SECONDS = 60 * 60 * 24 * 30;

export const mintExtensionToken = (user: AppUser): string => {
  const secret = process.env.EXTENSION_TOKEN_SECRET;

  if (!secret) {
    throw new Error("Missing EXTENSION_TOKEN_SECRET");
  }

  const payload = Buffer.from(
    JSON.stringify({
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
    }),
  ).toString("base64url");

  const signature = createHmac("sha256", secret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
};
