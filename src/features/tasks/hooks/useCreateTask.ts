import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { createTask } from "../service";

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: (input: {
      title: string;
      description?: string;
      priority: string;
      assignee_id?: string;
      due_date?: string;
    }) => createTask(projectId, profile!.id, input),

    onSuccess: () => {
      // Invalidate all task queries for this project regardless of filters
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
