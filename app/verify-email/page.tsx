import Link from "next/link";
import { redirect } from "next/navigation";

import StatusIcon from "@/components/status-icon";
import { getUser } from "@/lib/session";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ again?: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.emailVerified) {
    redirect("/get-started");
  }

  const { again } = await searchParams;

  return (
    <>
      <StatusIcon name="email" />

      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
        Verify your email
      </h1>

      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
        {again
          ? "Still not verified. Open the link we sent to "
          : "We sent a link to "}
        <strong className="font-bold text-foreground">{user.email}</strong>
        {again ? ", then try again." : ". Open it, then come back here."}
      </p>

      <Link
        href="/get-started?check=1"
        className="mt-12 text-2xl font-bold underline underline-offset-8"
      >
        I&apos;ve verified my email
      </Link>

      <a
        href="/auth/logout"
        className="mt-8 text-lg font-medium text-muted-foreground underline underline-offset-4"
      >
        Use a different account
      </a>
    </>
  );
}
