import { useNavigate } from "react-router-dom";
import { Trash2, LayoutList } from "lucide-react";
import { type ProjectWithStats } from "../../../types/index";

interface ProjectCardProps {
  project: ProjectWithStats;
  workspaceId: string;
  onDelete: (projectId: string) => void;
  isDeleting?: boolean;
}

export function ProjectCard({
  project,
  workspaceId,
  onDelete,
  isDeleting,
}: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/workspace/${workspaceId}/project/${project.id}`)
      }
      className="bg-gray-900 border border-white/10 rounded-xl p-5 cursor-pointer
                 hover:border-cyan-500/40 hover:bg-gray-800 transition-all duration-200
                 flex flex-col gap-3 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2">
          {project.name}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded
                     text-gray-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
          aria-label="Delete project"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-2 border-t border-white/5 flex items-center gap-1.5 text-gray-500 text-xs">
        <LayoutList size={13} />
        <span>
          {project.task_count} {project.task_count === 1 ? "task" : "tasks"}
        </span>
      </div>
    </div>
  );
}
