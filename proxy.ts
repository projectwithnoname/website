import { auth0 } from "./lib/auth0";

/** Mounts Auth0's /auth/* routes and keeps the session cookie rolling. */
export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
