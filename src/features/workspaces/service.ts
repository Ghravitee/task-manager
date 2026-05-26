import { supabase } from "../../lib/supabase";
import type {
  WorkspaceInvite,
  WorkspaceMember,
  WorkspaceRole,
} from "../../types";
import type { WorkspaceWithRole, CreateWorkspaceInput } from "./types";

// ─── Fetch all workspaces for the current user ─────────────────

export async function fetchWorkspaces(): Promise<WorkspaceWithRole[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get all workspace IDs the user is a member of
  const { data: memberships, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id);

  if (membershipError) throw new Error(membershipError.message);
  if (!memberships?.length) return [];

  const workspaceIds = memberships.map((m) => m.workspace_id);

  // Fetch the actual workspaces
  const { data: workspaces, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", workspaceIds)
    .order("created_at", { ascending: false });

  if (workspaceError) throw new Error(workspaceError.message);

  // Get member counts for each workspace
  const { data: memberCounts } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .in("workspace_id", workspaceIds);

  // Map role and member count onto each workspace
  return (workspaces ?? []).map((workspace) => {
    const membership = memberships.find((m) => m.workspace_id === workspace.id);
    const memberCount =
      memberCounts?.filter((m) => m.workspace_id === workspace.id).length ?? 0;

    return {
      ...workspace,
      created_at: workspace.created_at ?? new Date().toISOString(),
      role: (membership?.role ?? "member") as WorkspaceRole,
      member_count: memberCount,
    };
  });
}

// ─── Create a workspace ────────────────────────────────────────

export async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Create the workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({ name: input.name, owner_id: user.id })
    .select()
    .single();

  if (workspaceError) throw new Error(workspaceError.message);

  // Add the creator as owner in workspace_members
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) throw new Error(memberError.message);
}

// ─── Delete a workspace ────────────────────────────────────────

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) throw new Error(error.message);
}

// ─── Fetch workspace members ───────────────────────────────────

export async function fetchWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const { data, error } = await supabase
    .from("workspace_members")
    .select(`*, profile:profiles(*)`)
    .eq("workspace_id", workspaceId);

  if (error) throw new Error(error.message);
  return (data ?? []) as WorkspaceMember[];
}

// ─── Invites ──────────────────────────────────────────────────

export async function createInvite(
  workspaceId: string,
  userId: string,
): Promise<WorkspaceInvite> {
  const { data, error } = await supabase
    .from("workspace_invites")
    .insert({ workspace_id: workspaceId, created_by: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as WorkspaceInvite;
}

export async function fetchInvites(
  workspaceId: string,
): Promise<WorkspaceInvite[]> {
  const { data, error } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as WorkspaceInvite[];
}

export async function fetchInviteByToken(
  token: string,
): Promise<WorkspaceInvite & { workspace: { name: string } }> {
  const { data, error } = await supabase
    .from("workspace_invites")
    .select("*, workspace:workspaces(name)")
    .eq("token", token)
    .single();

  if (error) throw new Error("Invite not found or has expired.");
  return data as WorkspaceInvite & { workspace: { name: string } };
}

export async function acceptInvite(
  token: string,
  userId: string,
): Promise<string> {
  // Fetch the invite
  const invite = await fetchInviteByToken(token);

  // Check expiry
  if (new Date(invite.expires_at) < new Date()) {
    throw new Error("This invite link has expired.");
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", invite.workspace_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    // Already a member — just return the workspace_id to redirect
    return invite.workspace_id;
  }

  console.log("existing membership:", existing);
  console.log("userId:", userId);
  console.log("workspace_id:", invite.workspace_id);

  // Insert as member
  // Replace the insert block in acceptInvite
  const { error } = await supabase.from("workspace_members").insert({
    workspace_id: invite.workspace_id,
    user_id: userId,
    role: "member",
  });

  // 23505 is Postgres unique violation — treat it as success
  if (error && error.code !== "23505") throw new Error(error.message);
  return invite.workspace_id;
}

export async function deleteInvite(inviteId: string): Promise<void> {
  const { error } = await supabase
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId);

  if (error) throw new Error(error.message);
}
