import { type Task } from "../../../types";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  workspaceId: string;
  onDeleteTask: (taskId: string) => void;
  deletingTaskId?: string | null;
}

const COLUMNS: { title: string; status: string }[] = [
  { title: "Todo", status: "todo" },
  { title: "In Progress", status: "in_progress" },
  { title: "Done", status: "done" },
];

export function KanbanBoard({
  tasks,
  workspaceId,
  onDeleteTask,
  deletingTaskId,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(({ title, status }) => (
        <KanbanColumn
          key={status}
          title={title}
          workspaceId={workspaceId}
          tasks={tasks.filter((t) => t.status === status)}
          onDeleteTask={onDeleteTask}
          deletingTaskId={deletingTaskId}
        />
      ))}
    </div>
  );
}
