import { supabase } from "../../lib/supabase";
import type { TaskComment } from "../../types";

// ─── Fetch ────────────────────────────────────────────────────

export async function fetchComments(taskId: string): Promise<TaskComment[]> {
  const { data, error } = await supabase
    .from("task_comments")
    .select(`*, profile:profiles(*)`)
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as TaskComment[];
}

// ─── Create ───────────────────────────────────────────────────

export async function createComment(
  taskId: string,
  userId: string,
  content: string,
): Promise<TaskComment> {
  const { data, error } = await supabase
    .from("task_comments")
    .insert({ task_id: taskId, user_id: userId, content })
    .select(`*, profile:profiles(*)`)
    .single();

  if (error) throw error;
  return data as TaskComment;
}

// ─── Update ───────────────────────────────────────────────────

export async function updateComment(
  commentId: string,
  content: string,
): Promise<TaskComment> {
  const { data, error } = await supabase
    .from("task_comments")
    .update({ content })
    .eq("id", commentId)
    .select(`*, profile:profiles(*)`)
    .single();

  if (error) throw error;
  return data as TaskComment;
}

// ─── Delete ───────────────────────────────────────────────────

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from("task_comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
}
