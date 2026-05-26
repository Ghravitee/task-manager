import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useProjects } from "../features/projects/hooks/useProjects";
import { useCreateProject } from "../features/projects/hooks/useCreateProject";
import { useDeleteProject } from "../features/projects/hooks/useDeleteProject";
import { ProjectCard } from "../features/projects/components/ProjectCard";
import { ProjectForm } from "../features/projects/components/ProjectForm";
import { Button } from "../components/ui/Button";
import { BackButton } from "../components/ui/BackButton";

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [showForm, setShowForm] = useState(false);

  const { data: projects, isLoading, isError } = useProjects(workspaceId!);
  const createProject = useCreateProject(workspaceId!);
  const deleteProject = useDeleteProject(workspaceId!);

  function handleCreate(input: { name: string; description?: string }) {
    createProject.mutate(input, {
      onSuccess: () => setShowForm(false),
    });
  }

  function handleDelete(projectId: string) {
    deleteProject.mutate(projectId);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/dashboard" label="All workspaces" />
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">
            {projects?.length ?? 0} project{projects?.length !== 1 ? "s" : ""}{" "}
            in this workspace
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-1.5" />
          New project
        </Button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="text-gray-500 text-sm">Loading projects...</div>
      )}

      {isError && (
        <div className="text-red-400 text-sm">Failed to load projects.</div>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium text-gray-400 mb-1">
            No projects yet
          </p>
          <p className="text-sm">Create your first project to get started.</p>
        </div>
      )}

      {/* Grid */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              workspaceId={workspaceId!}
              onDelete={handleDelete}
              isDeleting={
                deleteProject.isPending &&
                deleteProject.variables === project.id
              }
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <ProjectForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={createProject.isPending}
        />
      )}
    </div>
  );
}
