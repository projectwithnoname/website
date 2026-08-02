import { redirect } from "next/navigation";

import StatusIcon from "@/components/status-icon";
import { auth0 } from "@/lib/auth0";

export default async function GetStarted() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (!session.user.email_verified) {
    redirect("/verify-email");
  }

  return (
    <>
      <StatusIcon name="success" />

      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">You're verified</h1>

      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
        Signed in as {session.user.email}. Open the extension's side panel to connect it to
        this account.
      </p>
    </>
  );
}
