const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}. See docs/extension-auth-plan.md for setup.`);
  }

  return value;
};

export const getTokenSecret = (): string => requireEnv("EXTENSION_TOKEN_SECRET");

export const getExtensionId = (): string => requireEnv("EXTENSION_ID");

export const getExtensionOrigin = (): string => `chrome-extension://${getExtensionId()}`;

export const PAIRING_CODE_TTL_SECONDS = 60;

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;

export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
