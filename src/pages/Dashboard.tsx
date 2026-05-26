import { useState } from "react";
import { Plus, LayoutDashboard } from "lucide-react";
import { useWorkspaces } from "../features/workspaces/hooks/useWorkspaces";
import { WorkspaceCard } from "../features/workspaces/components/WorkspaceCard";
import { WorkspaceForm } from "../features/workspaces/components/WorkspaceForm";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { profile } = useAuth();
  const { data: workspaces, isLoading, isError } = useWorkspaces();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const hasWorkspaces = workspaces && workspaces.length > 0;

  return (
    <>
      <Navbar
        title="Dashboard"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus size={16} />
            New Workspace
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            Welcome back
            {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h2>
          <p className="mt-1 text-gray-400">
            {hasWorkspaces
              ? "Here are your workspaces."
              : "Create your first workspace to get started."}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-xl border border-white/10 bg-gray-900"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            Failed to load workspaces. Please refresh the page.
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && !hasWorkspaces && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-cyan-500/10">
              <LayoutDashboard size={28} className="text-cyan-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              No workspaces yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-400">
              Create your first workspace to start organising your team's work
              and collaborating in real time.
            </p>
            <Button className="mt-6" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} />
              Create your first workspace
            </Button>
          </div>
        )}

        {/* Workspace grid */}
        {hasWorkspaces && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </div>

      {/* Create workspace modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create workspace"
      >
        <WorkspaceForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </>
  );
}
