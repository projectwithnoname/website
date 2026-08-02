import { redirect } from "next/navigation";

import StatusIcon from "@/components/status-icon";
import { auth0 } from "@/lib/auth0";
import Link from "next/link";

const DEFAULT_RETURN_TO = "/get-started";

const safeReturnTo = (value: string | string[] | undefined): string => {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return DEFAULT_RETURN_TO;
  }

  if (value.startsWith("//") || value.startsWith("/\\")) {
    return DEFAULT_RETURN_TO;
  }

  return value;
};

const VerifyEmail = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { returnTo } = await searchParams;
  const destination = safeReturnTo(returnTo);
  const session = await auth0.getSession();

  if (session?.user.email_verified) {
    redirect(destination);
  }

  return (
    <>
      <StatusIcon name="email" />

      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">Verify your email</h1>

      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
        We sent you a link. Open it, then come back here to finish setting up your account.
      </p>

      <Link
        // href={`/auth/login?prompt=login&returnTo=${encodeURIComponent(destination)}`}
        href={"/auth/login?returnTo=/get-started"}
        className="mt-12 text-2xl font-bold underline underline-offset-8"
      >
        I've verified my email
      </Link>

    </>
  );
};

export default VerifyEmail;
