import { prisma } from "@/prisma";
import { CreateHighlight } from "@/types/Highlight";

export const addHighlightToDb = async ( auth0Id: string,data: CreateHighlight) => {
  return prisma.highlight.create({
    data: {
      ...data,
      createdBy: { connect: { auth0Id } },
    },
  });
};
