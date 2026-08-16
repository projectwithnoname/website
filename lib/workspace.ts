import { prisma } from "@/prisma";
import { CreateWorkspace, PublicWorkspace } from "@/types/Workspace";

export const getWorkspacesFromDb = async (auth0Id: string): Promise<PublicWorkspace[]> => {
  const user = await prisma.user.findUnique({
    where: { auth0Id },
    select: { id: true },
  });

  if (!user) return [];

  const workspaces = await prisma.workspace.findMany({
    where: { memberIds: { has: user.id } },
    select: {
      id: true,
      name: true,
      createdById: true,
      memberIds: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return workspaces.map((workspace) => ({
    ...workspace,
    createdAt: workspace.createdAt.toISOString(),
  }));
};

export const createWorkspaceInDb = async (createdById: string, data: CreateWorkspace): Promise<PublicWorkspace> => {
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      createdById,
      memberIds: data.memberIds,
    },
    select: {
      id: true,
      name: true,
      createdById: true,
      memberIds: true,
      createdAt: true,
    },
  });

  return { ...workspace, createdAt: workspace.createdAt.toISOString() };
};