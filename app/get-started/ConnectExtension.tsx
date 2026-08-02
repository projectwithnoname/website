"use client";

import { useEffect, useState } from "react";

declare const chrome:
  | {
      runtime?: {
        lastError?: { message?: string };
        sendMessage: (
          extensionId: string,
          message: unknown,
          callback: (response: unknown) => void,
        ) => void;
      };
    }
  | undefined;

interface ConnectExtensionProps {
  extensionId: string;
  token: string;
  user: { sub: string; email: string; name: string; picture?: string };
}

const MESSAGES = {
  sending: "Connecting the extension…",
  connected: "Extension connected. You can close this tab.",
  unavailable: "Install the extension, then reload this page to connect it.",
} as const;

type Status = keyof typeof MESSAGES;

const deliver = (props: ConnectExtensionProps): Promise<Status> =>
  new Promise((resolve) => {
    const { extensionId, token, user } = props;

    if (typeof chrome === "undefined" || !chrome.runtime) {
      resolve("unavailable");
      return;
    }

    chrome.runtime.sendMessage(extensionId, { type: "AUTH_TOKEN", token, user }, (response) => {
      const ok =
        !chrome?.runtime?.lastError &&
        typeof response === "object" &&
        response !== null &&
        "ok" in response &&
        response.ok === true;

      resolve(ok ? "connected" : "unavailable");
    });
  });

const ConnectExtension = (props: ConnectExtensionProps) => {
  const [status, setStatus] = useState<Status>("sending");
  const { extensionId, token, user } = props;

  useEffect(() => {
    let cancelled = false;

    deliver({ extensionId, token, user }).then((next) => {
      if (!cancelled) {
        setStatus(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [extensionId, token, user]);

  return (
    <p role="status" aria-live="polite" className="mt-12 text-lg font-medium">
      {MESSAGES[status]}
    </p>
  );
};

export default ConnectExtension;
