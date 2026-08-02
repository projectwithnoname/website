import { redirect } from "next/navigation";

import StatusIcon from "@/components/status-icon";
import { mintExtensionToken } from "@/lib/extension-token";
import { getUser } from "@/lib/session";

import ConnectExtension from "./ConnectExtension";

export default async function GetStarted({
  searchParams,
}: {
  searchParams: Promise<{ check?: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login?returnTo=/get-started");
  }

  if (!user.emailVerified) {
    
    const { check } = await searchParams;

    redirect(check ? "/verify-email?again=1" : "/verify-email");
  }

  return (
    <>
      <StatusIcon name="success" />

      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">You&apos;re all set</h1>

      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
        Signed in as {user.email}.
      </p>

      <ConnectExtension
        extensionId={process.env.EXTENSION_ID ?? ""}
        token={mintExtensionToken(user)}
        user={{ sub: user.sub, email: user.email, name: user.name, picture: user.picture }}
      />
    </>
  );
}
