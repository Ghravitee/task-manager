import { supabase } from "../../lib/supabase";
import type { Task, TaskFilters } from "../../types";

// ─── Fetch ────────────────────────────────────────────────────

export async function fetchTasks(
  projectId: string,
  filters?: TaskFilters,
): Promise<Task[]> {
  let query = supabase
    .from("tasks")
    .select(
      `
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      creator:profiles!tasks_created_by_fkey(*)
    `,
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.priority && filters.priority !== "all") {
    query = query.eq("priority", filters.priority);
  }
  if (filters?.assignee_id && filters.assignee_id !== "all") {
    query = query.eq("assignee_id", filters.assignee_id);
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Task[];
}

// ─── Create ───────────────────────────────────────────────────

export async function createTask(
  projectId: string,
  userId: string,
  input: {
    title: string;
    description?: string;
    priority: string;
    assignee_id?: string;
    due_date?: string;
  },
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      project_id: projectId,
      created_by: userId,
      status: "todo",
      title: input.title,
      description: input.description ?? null,
      priority: input.priority,
      assignee_id: input.assignee_id ?? null,
      due_date: input.due_date ?? null,
    })
    .select(
      `
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      creator:profiles!tasks_created_by_fkey(*)
    `,
    )
    .single();

  if (error) throw error;
  return data as Task;
}

// ─── Delete ───────────────────────────────────────────────────

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) throw error;
}

// ─── Fetch single ─────────────────────────────────────────────

export async function fetchTask(taskId: string): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      creator:profiles!tasks_created_by_fkey(*)
    `,
    )
    .eq("id", taskId)
    .single();

  if (error) throw error;
  return data as Task;
}

// ─── Update ───────────────────────────────────────────────────

export async function updateTask(
  taskId: string,
  input: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    assignee_id?: string | null;
    due_date?: string | null;
  },
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", taskId)
    .select(
      `
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      creator:profiles!tasks_created_by_fkey(*)
    `,
    )
    .single();

  if (error) throw error;
  return data as Task;
}

export async function fetchAssignedTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      project:projects(
        id,
        name,
        workspace_id
      )
    `,
    )
    .eq("assignee_id", userId)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Task[];
}
