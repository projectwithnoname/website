import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./lib/generated/prisma/client";

const globalForClient = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForClient.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") globalForClient.prisma = prisma;
