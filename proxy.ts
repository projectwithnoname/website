import { auth0 } from "./lib/auth0";

export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    // /api/extension is excluded on purpose: those routes authenticate with a
    // bearer token rather than the Auth0 session cookie, and running session
    // rolling on them would attach Set-Cookie headers to cross-origin responses
    // the extension has no use for.
    "/((?!_next/static|_next/image|favicon.ico|api/extension).*)",
  ],
};