import { useState } from "react";
import { useParams } from "react-router-dom";
import { Copy, Check, Trash2, Plus, Shield, User } from "lucide-react";
import { useWorkspaceMembers } from "../features/workspaces/hooks/useWorkspaceMembers";
import { useInvites } from "../features/workspaces/hooks/useInvites";
import { useCreateInvite } from "../features/workspaces/hooks/useCreateInvite";
import { useDeleteInvite } from "../features/workspaces/hooks/useDeleteInvite";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { BackButton } from "../components/ui/BackButton";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";

export default function WorkspaceMembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: members = [], isLoading: membersLoading } = useWorkspaceMembers(
    workspaceId!,
  );
  const { data: invites = [], isLoading: invitesLoading } = useInvites(
    workspaceId!,
  );
  const { mutate: createInvite, isPending: isCreating } = useCreateInvite(
    workspaceId!,
  );
  const { mutate: deleteInvite } = useDeleteInvite(workspaceId!);

  // Current user's role in this workspace
  const myRole = members.find((m) => m.user_id === user?.id)?.role;
  const canManage = myRole === "owner" || myRole === "admin";

  const handleCopyLink = async (token: string, inviteId: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(inviteId);
    toastSuccess("Invite link copied.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateInvite = () => {
    createInvite(undefined, {
      onError: (err) => toastError(err.message ?? "Failed to create invite."),
    });
  };

  const handleDeleteInvite = (inviteId: string) => {
    deleteInvite(inviteId, {
      onError: (err) => toastError(err.message ?? "Failed to delete invite."),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <BackButton to={`/workspace/${workspaceId}`} label="Back to projects" />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <p className="mt-1 text-sm text-gray-400">
          Manage who has access to this workspace
        </p>
      </div>

      {/* ── Members list ─────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Members · {members.length}
        </h2>
        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-gray-900 p-4">
          {membersLoading ? (
            <p className="text-sm text-gray-500">Loading members...</p>
          ) : (
            members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={member.profile?.avatar_url}
                    name={member.profile?.full_name}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.profile?.full_name ?? member.profile?.email}
                      {member.user_id === user?.id && (
                        <span className="ml-1.5 text-xs text-gray-500">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.profile?.email}
                    </p>
                  </div>
                </div>
                <Badge variant={member.role as "owner" | "admin" | "member"}>
                  {member.role === "owner" ? (
                    <span className="flex items-center gap-1">
                      <Shield size={10} /> {member.role}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <User size={10} /> {member.role}
                    </span>
                  )}
                </Badge>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Invite links ─────────────────────────────────────── */}
      {canManage && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Invite links
            </h2>
            <Button
              size="sm"
              onClick={handleCreateInvite}
              isLoading={isCreating}
            >
              <Plus size={14} /> Generate link
            </Button>
          </div>

          {invitesLoading ? (
            <p className="text-sm text-gray-500">Loading invites...</p>
          ) : invites.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-gray-900 px-4 py-8 text-center">
              <p className="text-sm text-gray-500">
                No active invite links. Generate one to invite people.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-gray-900 p-4">
              {invites.map((invite) => {
                const expired = new Date(invite.expires_at) < new Date();
                const link = `${window.location.origin}/invite/${invite.token}`;
                const isCopied = copiedId === invite.id;

                return (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-gray-800 px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-gray-400">{link}</p>
                      <p className="mt-0.5 text-xs text-gray-600">
                        {expired ? (
                          <span className="text-red-400">Expired</span>
                        ) : (
                          <>
                            Expires{" "}
                            {new Date(invite.expires_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {!expired && (
                        <button
                          onClick={() =>
                            handleCopyLink(invite.token, invite.id)
                          }
                          className="rounded p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                          aria-label="Copy invite link"
                        >
                          {isCopied ? (
                            <Check size={14} className="text-emerald-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="rounded p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-red-400"
                        aria-label="Delete invite"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
