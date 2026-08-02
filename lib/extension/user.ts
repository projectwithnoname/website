import type { User } from "@auth0/nextjs-auth0/types";

import type { ExtensionUser } from "./tokens";

export const toExtensionUser = (user: User): ExtensionUser => ({
  sub: user.sub,
  email: user.email ?? "",
  name: user.name ?? user.nickname ?? user.email ?? "",
  picture: user.picture,
  emailVerified: user.email_verified === true,
});
