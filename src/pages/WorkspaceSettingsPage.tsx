// src/pages/WorkspaceSettingsPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings, LogOut, Trash2, ShieldAlert } from "lucide-react";
import { useWorkspaces } from "../features/workspaces/hooks/useWorkspaces";
import { useWorkspaceMembers } from "../features/workspaces/hooks/useWorkspaceMembers";
import { useRenameWorkspace } from "../features/workspaces/hooks/useRenameWorkspace";
import { useTransferOwnership } from "../features/workspaces/hooks/useTransferOwnership";
import { useLeaveWorkspace } from "../features/workspaces/hooks/useLeaveWorkspace";
import { useDeleteWorkspace } from "../features/workspaces/hooks/useDeleteWorkspace";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { cn } from "../utils/cn";

export default function WorkspaceSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const { data: workspaces } = useWorkspaces();
  const { data: members } = useWorkspaceMembers(workspaceId!);

  const workspace = workspaces?.find((w) => w.id === workspaceId);
  const currentMember = members?.find((m) => m.user_id === profile?.id);
  const isOwner = workspace?.owner_id === profile?.id;
  const isAdminOrOwner =
    currentMember?.role === "owner" || currentMember?.role === "admin";

  // ─── Rename ───────────────────────────────────────────────
  const [newName, setNewName] = useState(workspace?.name ?? "");
  const { mutate: rename, isPending: isRenaming } = useRenameWorkspace(
    workspaceId!,
  );

  const handleRename = () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === workspace?.name) return;
    rename(trimmed);
  };

  // ─── Transfer ownership ───────────────────────────────────
  const [selectedNewOwner, setSelectedNewOwner] = useState("");
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { mutate: transfer, isPending: isTransferring } = useTransferOwnership(
    workspaceId!,
  );

  const transferableMembers = members?.filter((m) => m.user_id !== profile?.id);

  const handleTransfer = () => {
    if (!selectedNewOwner) return;
    transfer(selectedNewOwner, {
      onSuccess: () => {
        setIsTransferOpen(false);
        setSelectedNewOwner("");
      },
    });
  };

  // ─── Leave ────────────────────────────────────────────────
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const { mutate: leave, isPending: isLeaving } = useLeaveWorkspace();

  const handleLeave = () => {
    leave(workspaceId!, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  // ─── Delete ───────────────────────────────────────────────
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const { mutate: deleteWs, isPending: isDeleting } = useDeleteWorkspace();

  const handleDelete = () => {
    if (deleteConfirm !== workspace?.name) return;
    deleteWs(workspaceId!, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  if (!workspace) return null;

  return (
    <>
      <Navbar title="Workspace Settings" />

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* General — rename */}
        {isAdminOrOwner && (
          <section className="rounded-xl border border-white/10 bg-gray-900">
            <div className="border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-white">General</h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-gray-400">
                  Workspace name
                </label>
                <div className="flex gap-3">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename()}
                    placeholder="Workspace name"
                  />
                  <Button
                    onClick={handleRename}
                    isLoading={isRenaming}
                    disabled={
                      !newName.trim() || newName.trim() === workspace.name
                    }
                    size="md"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Owner zone */}
        {isOwner && (
          <section className="rounded-xl border border-amber-500/20 bg-gray-900">
            <div className="border-b border-amber-500/20 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-400" />
                <h2 className="text-sm font-semibold text-white">Ownership</h2>
              </div>
            </div>
            <div className="px-6 py-5 space-y-1">
              <p className="text-sm text-gray-400">
                Transfer ownership of this workspace to another member. You will
                be demoted to admin.
              </p>
              <div className="pt-3">
                <Button
                  variant="outline"
                  onClick={() => setIsTransferOpen(true)}
                >
                  Transfer ownership
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Danger zone */}
        <section className="rounded-xl border border-red-500/20 bg-gray-900">
          <div className="border-b border-red-500/20 px-6 py-4">
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-red-400" />
              <h2 className="text-sm font-semibold text-white">Danger zone</h2>
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {/* Leave */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Leave workspace
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {isOwner
                    ? "Transfer ownership before leaving."
                    : "You will lose access to this workspace."}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsLeaveOpen(true)}
              >
                <LogOut size={14} />
                Leave
              </Button>
            </div>

            {/* Delete — owner only */}
            {isOwner && (
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    Delete workspace
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Permanently delete this workspace and all its data.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Transfer ownership modal */}
      <Modal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Transfer ownership"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Select a member to transfer ownership to. You will become an admin.
          </p>
          <select
            value={selectedNewOwner}
            onChange={(e) => setSelectedNewOwner(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2",
              "text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30",
            )}
          >
            <option value="" disabled>
              Select a member
            </option>
            {transferableMembers?.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.profile?.full_name ?? m.profile?.email ?? m.user_id}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsTransferOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              isLoading={isTransferring}
              disabled={!selectedNewOwner}
            >
              Transfer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave modal */}
      <Modal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        title="Leave workspace"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Are you sure you want to leave{" "}
            <span className="font-medium text-white">{workspace.name}</span>?
            You will lose access immediately.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsLeaveOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLeave}
              isLoading={isLeaving}
            >
              Leave workspace
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteConfirm("");
        }}
        title="Delete workspace"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            This action is permanent and cannot be undone. Type{" "}
            <span className="font-medium text-white">{workspace.name}</span> to
            confirm.
          </p>
          <Input
            placeholder={workspace.name}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteConfirm("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={deleteConfirm !== workspace.name}
            >
              Delete workspace
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
