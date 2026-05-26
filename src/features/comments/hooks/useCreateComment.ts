import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../service";

export function useCreateComment(taskId: string, userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment(taskId, userId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
