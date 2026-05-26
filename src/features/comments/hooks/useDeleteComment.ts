import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../service";

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Remove the deleted comment from cache directly
      queryClient.setQueryData<import("../../../types").TaskComment[]>(
        ["comments", taskId],
        (prev) => prev?.filter((c) => c.id !== commentId) ?? [],
      );
    },
  });
}
