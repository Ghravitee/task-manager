import { useNavigate } from "react-router-dom";
import { Trash2, CalendarDays } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar";
// import { Badge } from "../../../components/ui/Badge";
import { type Task } from "../../../types";

interface TaskCardProps {
  task: Task;
  workspaceId: string;
  onDelete: (taskId: string) => void;
  isDeleting?: boolean;
}

const priorityStyles: Record<string, string> = {
  low: "bg-gray-500/20 text-gray-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-orange-500/20 text-orange-400",
  urgent: "bg-red-500/20 text-red-400",
};

export function TaskCard({
  task,
  onDelete,
  workspaceId,
  isDeleting,
}: TaskCardProps) {
  const navigate = useNavigate();

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      onClick={() =>
        navigate(
          `/workspace/${workspaceId}/project/${task.project_id}/task/${task.id}`,
        )
      }
      className="group flex flex-col gap-3 rounded-lg border border-white/10
                 bg-gray-800 p-3 transition-all duration-200 cursor-pointer
                 hover:border-cyan-500/40 hover:bg-gray-700/60
                 sm:p-3.5"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <p
          className="min-w-0 flex-1 text-sm font-medium leading-snug
                     text-white line-clamp-2 wrap-break-words"
        >
          {task.title}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          disabled={isDeleting}
          className="shrink-0 rounded p-1 text-gray-500 transition-all
                     hover:bg-red-500/10 hover:text-red-400
                     opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                     disabled:opacity-30"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Priority badge */}
      <span
        className={`self-start rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-medium ${priorityStyles[task.priority]}`}
      >
        {task.priority}
      </span>

      {/* Footer */}
      <div
        className="mt-auto flex flex-col gap-3 pt-1
                   sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Due date */}
        <div className="min-h-5">
          {formattedDate ? (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <CalendarDays size={11} />
              {formattedDate}
            </span>
          ) : null}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <div className="flex min-w-0 flex-col gap-1 text-xs sm:items-end">
            <span className="text-white/50">Assigned to</span>

            <div className="flex items-center gap-2 min-w-0">
              <p className="truncate text-white text-xs sm:text-sm">
                {task.assignee.full_name}
              </p>

              <Avatar
                src={task.assignee.avatar_url}
                name={task.assignee.full_name}
                size="xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
