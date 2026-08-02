"use client";

import { useEffect, useState } from "react";

import StatusIcon, { type StatusIconName } from "@/components/status-icon";

/**
 * Minimal shape of the `chrome.runtime` bridge that `externally_connectable`
 * injects into this page. Only present when the page origin is listed in the
 * extension's manifest, so every access has to be guarded.
 */
interface ChromeRuntimeBridge {
  runtime?: {
    lastError?: { message?: string };
    sendMessage: (
      extensionId: string,
      message: unknown,
      callback: (response: unknown) => void,
    ) => void;
  };
}

declare const chrome: ChromeRuntimeBridge | undefined;

type Status = "sending" | "delivered" | "unavailable" | "rejected";

interface BridgeProps {
  extensionId: string;
  code: string;
  state: string;
}

const MESSAGES: Record<Status, { icon: StatusIconName | null; title: string; detail: string }> = {
  sending: {
    icon: null,
    title: "Connecting…",
    detail: "Handing the pairing code to the extension.",
  },
  delivered: {
    icon: "success",
    title: "Extension connected",
    detail: "You can close this tab.",
  },
  unavailable: {
    icon: "error",
    title: "Couldn't reach the extension",
    detail:
      "Make sure it's installed and enabled, then reopen the side panel and try again.",
  },
  rejected: {
    icon: "error",
    title: "Connection refused",
    detail: "Reopen the side panel and start the sign-in again.",
  },
};

/**
 * Hands the one-time pairing code to the extension's service worker. The code
 * is worthless on its own — the worker still has to exchange it at
 * /api/extension/token over its own TLS connection.
 */
const Bridge = ({ extensionId, code, state }: BridgeProps) => {
  const [status, setStatus] = useState<Status>("sending");

  useEffect(() => {
    let cancelled = false;

    const deliver = (): Promise<Status> =>
      new Promise((resolve) => {
        // `chrome.runtime` only exists here if this origin is listed under
        // `externally_connectable` in the extension's manifest.
        if (typeof chrome === "undefined" || !chrome.runtime) {
          resolve("unavailable");
          return;
        }

        chrome.runtime.sendMessage(extensionId, { type: "AUTH_PAIRING_CODE", code, state }, (response) => {
          // A missing or disabled extension surfaces here, not as a thrown error.
          if (chrome?.runtime?.lastError) {
            resolve("unavailable");
            return;
          }

          const accepted =
            typeof response === "object" && response !== null && "ok" in response && response.ok === true;

          resolve(accepted ? "delivered" : "rejected");
        });
      });

    deliver().then((next) => {
      if (!cancelled) {
        setStatus(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [extensionId, code, state]);

  const { icon, title, detail } = MESSAGES[status];

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center">
      {icon && <StatusIcon name={icon} />}
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-6 max-w-md text-xl font-medium text-muted-foreground">{detail}</p>
    </div>
  );
};

export default Bridge;
