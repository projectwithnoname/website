# Highlighter — Website

Sign-up and sign-in for the extension. Auth0 handles the login; once your email
is verified, `/get-started` hands a token to the Chrome extension.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Setup

Needs a `.env.local` with:

```
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=            # openssl rand -hex 32
EXTENSION_TOKEN_SECRET=  # openssl rand -hex 32
EXTENSION_ID=            # from extension/public/manifest.json key
```

In the Auth0 dashboard, allow `http://localhost:3000/auth/callback` as a
callback URL and `http://localhost:3000` as a logout URL.

## Notes

Login routes (`/auth/login`, `/auth/logout`, `/auth/callback`) are mounted by
the Auth0 SDK in [proxy.ts](proxy.ts). There are no files for them.
