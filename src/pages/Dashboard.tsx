import { useState } from "react";
import {
  Plus,
  LayoutDashboard,
  CheckCheck,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import { useWorkspaces } from "../features/workspaces/hooks/useWorkspaces";
import { useAssignedTasks } from "../features/tasks/hooks/useAssignedTasks";
import { WorkspaceCard } from "../features/workspaces/components/WorkspaceCard";
import { WorkspaceForm } from "../features/workspaces/components/WorkspaceForm";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "../utils/cn";

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError,
  } = useWorkspaces();
  const { data: assignedTasks, isLoading: tasksLoading } = useAssignedTasks();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const hasWorkspaces = workspaces && workspaces.length > 0;

  // ─── Derived stats ────────────────────────────────────────
  const totalAssigned = assignedTasks?.length ?? 0;
  const totalDone =
    assignedTasks?.filter((t) => t.status === "done").length ?? 0;
  const totalUrgent =
    assignedTasks?.filter((t) => t.priority === "urgent").length ?? 0;

  const stats = [
    {
      label: "Assigned to me",
      value: totalAssigned,
      icon: <ListTodo size={18} className="text-cyan-400" />,
    },
    {
      label: "Completed",
      value: totalDone,
      icon: <CheckCheck size={18} className="text-emerald-400" />,
    },
    {
      label: "Urgent",
      value: totalUrgent,
      icon: <AlertCircle size={18} className="text-red-400" />,
    },
  ];

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

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-10">
        {/* Welcome message */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome back
            {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h2>
          <p className="mt-1 text-gray-400">
            {hasWorkspaces
              ? "Here's what's going on across your workspaces."
              : "Create your first workspace to get started."}
          </p>
        </div>

        {/* Stats row */}
        {!tasksLoading && totalAssigned > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-gray-900 px-5 py-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workspaces section */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Workspaces
          </h3>

          {/* Loading */}
          {workspacesLoading && (
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
          {!workspacesLoading && !isError && !hasWorkspaces && (
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

        {/* Recently assigned section */}
        {!tasksLoading && totalAssigned > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Recently assigned to me
            </h3>
            <div className="overflow-hidden rounded-xl border border-white/10">
              {assignedTasks!.map((task, index) => (
                <button
                  key={task.id}
                  onClick={() =>
                    navigate(
                      `/workspace/${task.project!.workspace_id}/project/${task.project!.id}/task/${task.id}`,
                    )
                  }
                  className={cn(
                    "flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/5",
                    index !== assignedTasks!.length - 1 &&
                      "border-b border-white/10",
                  )}
                >
                  {/* Title + project */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {task.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {task.project?.name}
                    </p>
                  </div>

                  {/* Badges + due date */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={task.priority}>{task.priority}</Badge>
                    <Badge variant={task.status}>
                      {task.status.replace("_", " ")}
                    </Badge>
                    {task.due_date && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(task.due_date), "MMM d")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
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
