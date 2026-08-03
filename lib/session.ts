import { auth0 } from "./auth0";

export interface AppUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

const isVerifiedLive = async (): Promise<boolean> => {
  try {
    const { token } = await auth0.getAccessToken();

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return false;
    }

    const profile: { email_verified?: boolean } = await response.json();

    return profile.email_verified === true;
  } catch {
    return false;
  }
};

export const getUser = async (): Promise<AppUser | null> => {
  const session = await auth0.getSession();

  if (!session) {
    return null;
  }

  const { user } = session;

  return {
    sub: user.sub,
    email: user.email ?? "",
    name: user.name ?? user.email ?? "",
    picture: user.picture,
    emailVerified: user.email_verified === true || (await isVerifiedLive()),
  };
};
