export default function SignIn() {
  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
        Sign in
      </h1>

      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
        The extension needs an account to sync your highlights to.
      </p>

      <a
        href="/auth/login?screen_hint=signup&returnTo=/get-started"
        className="mt-12 text-3xl font-bold underline underline-offset-8"
      >
        Create an account
      </a>

      <a
        href="/auth/login?returnTo=/get-started"
        className="mt-8 text-xl font-medium text-muted-foreground underline underline-offset-4"
      >
        I already have an account
      </a>
    </>
  );
}
