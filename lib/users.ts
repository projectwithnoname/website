import { prisma } from "@/prisma";
import {PublicUser, CreateUser} from "@/types/User";

export const getUsersFromDb = async () :Promise<PublicUser[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
    },
  });
};

export const addUserToDb = async (data: CreateUser) => {


    const user = await prisma.user.create({
        data: {
            email: data.email,
            authOId:data.auth0Id,
        }
    })

    return user;
}
    