import { useQuery } from "@tanstack/react-query";
import { fetchInvites } from "../service";

export function useInvites(workspaceId: string) {
  return useQuery({
    queryKey: ["invites", workspaceId],
    queryFn: () => fetchInvites(workspaceId),
    enabled: !!workspaceId,
  });
}
