// features/projects/service.ts
import { supabase } from "../../lib/supabase";
import { type Project, type ProjectWithStats } from "../../types/index";

export async function fetchProjects(
  workspaceId: string,
): Promise<ProjectWithStats[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, tasks(count)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    workspace_id: row.workspace_id,
    name: row.name,
    description: row.description,
    created_by: row.created_by,
    created_at: row.created_at,
    task_count: (row.tasks as unknown as { count: number }[])[0]?.count ?? 0,
    completed_count: 0, // populated later when ProjectPage loads full task data
  }));
}

// ─── Create ───────────────────────────────────────────────────

export async function createProject(
  workspaceId: string,
  userId: string,
  input: { name: string; description?: string },
): Promise<ProjectWithStats> {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      workspace_id: workspaceId,
      created_by: userId,
      name: input.name,
      description: input.description ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return { ...data, task_count: 0, completed_count: 0 };
}

// ─── Delete ───────────────────────────────────────────────────

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}

export async function fetchProject(projectId: string): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return data as Project;
}
