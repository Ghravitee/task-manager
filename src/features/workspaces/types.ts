import type { Workspace, WorkspaceRole } from "../../types";

export interface CreateWorkspaceInput {
  name: string;
}

export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole;
  member_count: number;
}
