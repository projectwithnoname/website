# AGENTS.md

Guidance for agents working in this repo. `.claude/CLAUDE.md` imports this file —
add new instructions here, not there.

## Commands

```bash
npm run dev     # next dev — http://localhost:3000
npm run build   # production build
npm run lint    # eslint
```

## What this app is

The account half of the Highlighter Chrome extension. It does two things and
nothing else: sign the user in via Auth0, and hand a signed token to the
extension once the account's email is verified. There is no database, no user
storage, and no highlight data here — highlights live in the extension's
`chrome.storage.local`.

## Auth flow

```
extension side panel "Sign in"
  → opens a tab at /sign-in
    → /auth/login?returnTo=/get-started      (mounted by the SDK, see below)
      → Auth0 Universal Login
        → /auth/callback  — sets the session cookie
          → /get-started
             ├─ no session        → back to /auth/login
             ├─ email unverified  → /verify-email
             └─ verified          → mintExtensionToken() → <ConnectExtension>
                                     → chrome.runtime.sendMessage(EXTENSION_ID)
```

### There are no `/api/auth/*` route files, and there must not be

`@auth0/nextjs-auth0` v4 mounts its routes in middleware. [proxy.ts](proxy.ts)
calls `auth0.middleware(request)`, which intercepts `/auth/login`,
`/auth/logout`, `/auth/callback`, `/auth/profile`, `/auth/access-token` and
`/auth/backchannel-logout` before they reach the App Router.

The v3 pattern (`app/api/auth/[auth0]/route.ts` exporting `handleAuth()`) is
gone. Do not add it back — a route file under `/auth/*` would be shadowed by the
middleware and never run, and one under `/api/auth/*` would be a second,
unmounted path with no state/PKCE validation. Most Auth0 tutorials online are
still v3; treat them as wrong for this repo.

`/auth/login` forwards any query param except `returnTo` and `challengeMode`
straight to Auth0's `/authorize`. That's how [app/sign-in/page.tsx](app/sign-in/page.tsx)
gets its signup variant (`?screen_hint=signup`), and how you force a re-prompt
during testing (`?prompt=login`).

### Email verification is checked live, not from the cookie

Verification happens out of band — the user clicks a link in their inbox and the
session cookie never hears about it. Auth0 only refreshes `email_verified` on a
real re-authentication, so a fresh sign-up's cookie keeps saying `false` long
after the user has verified.

[lib/session.ts](lib/session.ts) handles this: `getUser()` trusts a session that
already says verified (the claim only moves false → true) and otherwise calls
`/userinfo` for the live profile. Never read `session.user.email_verified`
directly — go through `getUser()`.

### Two cookies keep the user signed in, neither owned by the extension

1. `localhost:3000` — the SDK session cookie, rolling (the [proxy.ts](proxy.ts)
   matcher refreshes it on every request).
2. `{tenant}.auth0.com` — Auth0's own SSO cookie.

Either one alone logs the user straight back in with no visible prompt, which is
why reinstalling the extension does not sign anyone out — it only clears
`chrome.storage.local`. Genuinely signing out requires `/auth/logout` (see the
link on [app/verify-email/page.tsx](app/verify-email/page.tsx)), which clears
the local session and Auth0's.

That is also what the extension's "Sign out" button drives: it loads
`/auth/logout` in a background tab and closes it once the redirect lands back on
this origin. It passes no `returnTo`, so the landing page is `APP_BASE_URL` and
the existing Allowed Logout URL keeps working. Keeping that route reachable
matters to the extension, not just to this app.

### Extension handoff

[lib/extension-token.ts](lib/extension-token.ts) mints a 30-day HMAC-SHA256
token (`base64url(payload).base64url(signature)`, signed with
`EXTENSION_TOKEN_SECRET`). [app/get-started/ConnectExtension.tsx](app/get-started/ConnectExtension.tsx)
is the only client component in the app; it exists because
`chrome.runtime.sendMessage` needs a browser. A fresh token is minted on every
visit to `/get-started` — it is not cached or revocable yet.

The receiving end checks `sender.origin`, and the extension's
`externally_connectable` in `../extension/public/manifest.json` must list this
origin. `EXTENSION_ID` is derived from the pinned `key` in that same manifest;
if either changes, the handoff silently fails and the page shows "Install the
extension…".

## Conventions

- **Pages are server components** and start with `await getUser()`, then
  `redirect()` on anything unexpected. `ConnectExtension` is the one exception.
- **Layout owns the shape.** [app/layout.tsx](app/layout.tsx) centers a single
  column; pages supply only their own text and never their own wrapper.
- **Arrow functions with explicit return types** in `lib/`; `export default
  function` for pages.
- Comments explain *why*, not what — the existing ones in `lib/session.ts` are
  the house style.

## Environment

`.env.local` holds `APP_BASE_URL`, `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`,
`AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`, `EXTENSION_TOKEN_SECRET`, `EXTENSION_ID`.

**Ask before editing `.env.local`, and append rather than rewriting it.** In the
Auth0 dashboard, Allowed Callback URLs must include `{APP_BASE_URL}/auth/callback`
and Allowed Logout URLs must include `{APP_BASE_URL}`.
