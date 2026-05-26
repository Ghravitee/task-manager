import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTasks } from "../features/tasks/hooks/useTasks";
import { useCreateTask } from "../features/tasks/hooks/useCreateTask";
import { useDeleteTask } from "../features/tasks/hooks/useDeleteTask";
import { KanbanBoard } from "../features/tasks/components/KanbanBoard";
import { TaskFiltersBar } from "../features/tasks/components/TaskFilters";
import { TaskForm } from "../features/tasks/components/TaskForm";
import { BackButton } from "../components/ui/BackButton";
import { Button } from "../components/ui/Button";
import { type TaskFilters } from "../types";
import { useTasksRealtime } from "../features/tasks/hooks/useTasksRealtime";
import { useProject } from "../features/projects/hooks/useProject";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useProject(projectId!);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});

  const workspaceId = project?.workspace_id ?? "";

  const { data: tasks, isLoading, isError } = useTasks(projectId!, filters);
  const createTask = useCreateTask(projectId!);
  const deleteTask = useDeleteTask(projectId!);
  useTasksRealtime(projectId!);

  function handleCreate(input: {
    title: string;
    description?: string;
    priority: string;
    assignee_id?: string;
    due_date?: string;
  }) {
    createTask.mutate(input, {
      onSuccess: () => setShowForm(false),
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BackButton
        to={project ? `/workspace/${project.workspace_id}` : "/dashboard"}
        label="Back to projects"
      />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-1.5" />
          New task
        </Button>
      </div>

      {/* Filters */}
      <TaskFiltersBar onChange={setFilters} />

      {/* States */}
      {isLoading && (
        <div className="text-gray-500 text-sm">Loading tasks...</div>
      )}
      {isError && (
        <div className="text-red-400 text-sm">Failed to load tasks.</div>
      )}

      {/* Board */}
      {!isLoading && !isError && (
        <KanbanBoard
          tasks={tasks ?? []}
          workspaceId={workspaceId}
          onDeleteTask={(id) => deleteTask.mutate(id)}
          deletingTaskId={deleteTask.isPending ? deleteTask.variables : null}
        />
      )}

      {/* Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={createTask.isPending}
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
}
