import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../service";
import type { Task } from "../../../types";

export function useUpdateTask(taskId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof updateTask>[1]) =>
      updateTask(taskId, input),
    onSuccess: (updatedTask: Task) => {
      // Update the single task cache directly — no refetch needed
      queryClient.setQueryData(["task", taskId], updatedTask);
      // Also invalidate the tasks list so Kanban stays in sync
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
