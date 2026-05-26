import { MoreHorizontal, Trash2, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../utils/cn";
import { Badge } from "../../../components/ui/Badge";
import { useNavigation } from "../../../hooks/useNavigation";
import { useDeleteWorkspace } from "../hooks/useWorkspaces";
import type { WorkspaceWithRole } from "../types";

interface WorkspaceCardProps {
  workspace: WorkspaceWithRole;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const { navigateTo } = useNavigation();
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative rounded-xl border border-white/10 bg-gray-900 p-6 transition hover:border-white/20">
      {/* Menu button — owners only */}
      {workspace.role === "owner" && (
        <div className="absolute right-4 top-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-lg p-1.5 text-gray-500 opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-white/10 bg-gray-800 py-1 shadow-xl">
                <button
                  onClick={() => {
                    deleteWorkspace(workspace.id);
                    setShowMenu(false);
                  }}
                  disabled={isPending}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition hover:bg-white/5"
                >
                  <Trash2 size={14} />
                  Delete workspace
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Workspace initial */}
      <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl font-bold text-cyan-400">
        {workspace.name[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3 className="font-semibold text-white">{workspace.name}</h3>
        <div className="mt-2 flex items-center gap-3">
          <Badge variant={workspace.role}>{workspace.role}</Badge>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            {workspace.member_count}{" "}
            {workspace.member_count === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      {/* Open button */}
      <button
        onClick={() => navigateTo(`/workspace/${workspace.id}`)}
        className={cn(
          "mt-6 flex w-full items-center justify-center gap-2",
          "rounded-lg border border-white/10 bg-white/5 py-2",
          "text-sm text-gray-300 transition",
          "hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-300",
        )}
      >
        Open workspace
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
