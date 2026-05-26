import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../service";
import type { TaskComment } from "../../../types";

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateComment(commentId, content),
    onSuccess: (updatedComment: TaskComment) => {
      // Patch just the edited comment in the cache — no refetch needed
      queryClient.setQueryData<TaskComment[]>(
        ["comments", taskId],
        (prev) =>
          prev?.map((c) => (c.id === updatedComment.id ? updatedComment : c)) ??
          [],
      );
    },
  });
}
