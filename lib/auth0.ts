import {
  Auth0Client,
  filterDefaultIdTokenClaims,
} from "@auth0/nextjs-auth0/server";

import { addUserToDb } from "./users";

export const auth0 = new Auth0Client({
  async beforeSessionSaved(session) {
    const { sub, email } = session.user;

    if (email) {
      try {
        await addUserToDb({ auth0Id: sub, email });
      } catch (error) {
        console.error("Could not persist user on session save:", error);
      }
    }

    return { ...session, user: filterDefaultIdTokenClaims(session.user) };
  },
});
