import { auth0 } from "@/lib/auth0";

const LoginPage = async () => {
  const session = await auth0.getSession();

  if (session) {
    return (
      <>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">You're signed in</h1>

        <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
          Signed in as {session.user.email}.
        </p>

        <a href="/auth/logout" className="mt-12 text-3xl font-bold underline underline-offset-8">
          Log out
        </a>
      </>
    );
  }

  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">Sign in</h1>

      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
        We'll email you a verification link before your account is ready.
      </p>

      <a
        href="/auth/login?returnTo=/get-started"
        className="mt-12 text-3xl font-bold underline underline-offset-8"
      >
        Log in
      </a>
    </>
  );
};

export default LoginPage;
