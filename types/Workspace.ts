export interface CreateWorkspace {
  name: string;
}

export interface PublicWorkspace extends CreateWorkspace {
  id: string;
  createdAt: string;
  createdById: string;
  memberIds: string[];
}
