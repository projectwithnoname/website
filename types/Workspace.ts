export interface CreateWorkspace {
  name: string;
  memberIds: string[];
}

export interface PublicWorkspace extends CreateWorkspace {
  id: string;
  createdAt: string;
  createdById: string;
  memberIds: string[];
}
