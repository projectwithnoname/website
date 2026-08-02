import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import {
  ACCESS_TOKEN_TTL_SECONDS,
  PAIRING_CODE_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  getTokenSecret,
} from "./config";

/**
 * Self-contained HMAC-signed tokens: `base64url(payload).base64url(signature)`.
 *
 * There is no database yet, so nothing is revocable and pairing codes cannot be
 * enforced as truly single-use — a code can be replayed inside its 60s window.
 * Both limitations are deliberate for v1 and are the first thing a datastore
 * would fix. Do not extend the TTLs to paper over that.
 */

export type ExtensionTokenType = "pair" | "access" | "refresh";

/** The user fields the extension is allowed to see. Mirrored into chrome.storage. */
export interface ExtensionUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

interface TokenPayload extends ExtensionUser {
  /** Token type, checked on verify so an access token cannot be used as a refresh token. */
  t: ExtensionTokenType;
  /** Seconds since epoch. */
  exp: number;
  /** Unique per token, so two tokens minted in the same second differ. */
  jti: string;
}

const TTL_BY_TYPE: Record<ExtensionTokenType, number> = {
  pair: PAIRING_CODE_TTL_SECONDS,
  access: ACCESS_TOKEN_TTL_SECONDS,
  refresh: REFRESH_TOKEN_TTL_SECONDS,
};

const toBase64Url = (input: Buffer | string): string =>
  Buffer.from(input).toString("base64url");

const sign = (encodedPayload: string): string =>
  createHmac("sha256", getTokenSecret()).update(encodedPayload).digest("base64url");

export interface MintedToken {
  token: string;
  /** Milliseconds since epoch, matching what the extension stores. */
  expiresAt: number;
}

export const mintToken = (type: ExtensionTokenType, user: ExtensionUser): MintedToken => {
  const expiresInSeconds = TTL_BY_TYPE[type];
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const payload: TokenPayload = {
    t: type,
    exp,
    jti: randomUUID(),
    sub: user.sub,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    ...(user.picture ? { picture: user.picture } : {}),
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));

  return {
    token: `${encodedPayload}.${sign(encodedPayload)}`,
    expiresAt: exp * 1000,
  };
};

/** Returns the user carried by the token, or null if it is malformed, forged, wrong-typed or expired. */
export const verifyToken = (token: string, expectedType: ExtensionTokenType): ExtensionUser | null => {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expected = Buffer.from(sign(encodedPayload));
  const received = Buffer.from(signature);

  // timingSafeEqual throws on a length mismatch, so guard before comparing.
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  let payload: TokenPayload;

  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
  } catch {
    return null;
  }

  if (payload.t !== expectedType) {
    return null;
  }

  if (typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now()) {
    return null;
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    emailVerified: payload.emailVerified,
  };
};

/** Pulls the bearer token out of an Authorization header, if present and well-formed. */
export const readBearerToken = (request: Request): string | null => {
  const header = request.headers.get("authorization");

  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice("bearer ".length).trim() || null;
};
