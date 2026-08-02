import { redirect } from "next/navigation";

import StatusIcon from "@/components/status-icon";
import { auth0 } from "@/lib/auth0";
import { getExtensionId } from "@/lib/extension/config";
import { mintToken } from "@/lib/extension/tokens";
import { toExtensionUser } from "@/lib/extension/user";

import Bridge from "./Bridge";

/**
 * The handoff point between the website session and the extension.
 *
 * The extension opens this page in a tab with a `state` nonce it generated. Once
 * Auth0 has a verified session we mint a short-lived pairing code and let the
 * client bridge push it into the extension's service worker.
 */
const ConnectExtension = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { state, fresh } = await searchParams;

  // The nonce ties this page load to the sign-in the extension actually started,
  // so a random tab pointed at this URL can't pair a different account.
  if (typeof state !== "string" || !state) {
    return (
      <>
        <StatusIcon name="error" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Nothing to connect</h1>
        <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">
          Start the sign-in from the extension&apos;s side panel.
        </p>
      </>
    );
  }

  const returnTo = `/extension/connect?state=${encodeURIComponent(state)}`;

  // The extension asks for a fresh sign-in every time, because its sign-out
  // cannot reach this origin's session cookie: pairing off a leftover session
  // would hand back the account the user just signed out of. `prompt=login`
  // makes Auth0 ask for credentials even when its own SSO session is alive, and
  // `returnTo` drops the flag so the trip back through here uses the session
  // that login just established rather than looping.
  if (fresh) {
    redirect(`/auth/login?prompt=login&returnTo=${encodeURIComponent(returnTo)}`);
  }

  const session = await auth0.getSession();

  if (!session) {
    redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  // Matches the gate in /get-started: an unverified account must not pair.
  //
  // A fresh sign-up always lands here, so the pairing nonce has to survive the
  // detour — dropping it would strand the extension waiting for a code that
  // never comes, forcing the user to restart sign-in from the side panel.
  if (!session.user.email_verified) {
    redirect(`/verify-email?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const { token: code } = mintToken("pair", toExtensionUser(session.user));

  return <Bridge extensionId={getExtensionId()} code={code} state={state} />;
};

export default ConnectExtension;
