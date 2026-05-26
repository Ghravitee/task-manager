import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../service";

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchComments(taskId),
    enabled: !!taskId,
  });
}
