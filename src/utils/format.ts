import type { TaskStatus, TaskPriority, WorkspaceRole } from "../types/index";

export function formatStatus(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    todo: "Todo",
    in_progress: "In Progress",
    done: "Done",
  };
  return map[status];
}

export function formatPriority(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return map[priority];
}

export function formatRole(role: WorkspaceRole): string {
  const map: Record<WorkspaceRole, string> = {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
  };
  return map[role];
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
