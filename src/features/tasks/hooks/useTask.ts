import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../service";

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(taskId),
    enabled: !!taskId,
  });
}
