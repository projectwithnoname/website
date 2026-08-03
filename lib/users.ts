import { prisma } from "@/prisma";
import { PublicUser, CreateUser } from "@/types/User";

export const getUsersFromDb = async (): Promise<PublicUser[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
};

export const addUserToDb = async (data: CreateUser) => {
  return prisma.user.upsert({
    where: { auth0Id: data.auth0Id },
    create: {
      auth0Id: data.auth0Id,
      email: data.email,
    },
    update: {
      email: data.email,
    },
  });
};

export const verifieUserStatus = async (auth0Id: string, newValue: boolean) => {
  return prisma.user.updateMany({
    where: { auth0Id, validated: { not: newValue } },
    data: { validated: newValue },
  });
};
