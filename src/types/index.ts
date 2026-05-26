// ─── Auth ─────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// ─── Workspaces ───────────────────────────────────────────────

export type WorkspaceRole = "owner" | "admin" | "member";

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
  profile?: Profile;
}

export interface WorkspaceWithRole extends Workspace {
  role: WorkspaceRole;
  member_count: number;
}

// ─── Projects ─────────────────────────────────────────────────

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ProjectWithStats extends Project {
  task_count: number;
  completed_count: number;
}

// ─── Tasks ────────────────────────────────────────────────────

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  created_by: string | null;
  due_date: string | null;
  created_at: string;
  assignee?: Profile;
  creator?: Profile;
}

export interface TaskFilters {
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  assignee_id?: string | "all";
  search?: string;
}

// ─── Comments ─────────────────────────────────────────────────

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

// ─── Pagination ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

// ─── Realtime ─────────────────────────────────────────────────

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE";

export interface RealtimePayload<T> {
  event: RealtimeEvent;
  new: T;
  old: T;
}

// ─── Invites ──────────────────────────────────────────────────

export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  token: string;
  created_by: string;
  expires_at: string;
  created_at: string;
}
