import { type Task } from "../../../types";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  deletingTaskId?: string | null;
  workspaceId: string;
}

const columnStyles: Record<string, string> = {
  Todo: "border-t-gray-500",
  "In Progress": "border-t-amber-500",
  Done: "border-t-emerald-500",
};

export function KanbanColumn({
  title,
  tasks,
  workspaceId,
  onDeleteTask,
  deletingTaskId,
}: KanbanColumnProps) {
  return (
    <div
      className={`flex flex-col gap-3 bg-gray-900/60 rounded-xl p-4 border-t-2 h-fit ${columnStyles[title]}`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      {tasks.length === 0 ? (
        <p className="text-xs text-gray-600 text-center py-6">No tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            isDeleting={deletingTaskId === task.id}
            workspaceId={workspaceId}
          />
        ))
      )}
    </div>
  );
}
