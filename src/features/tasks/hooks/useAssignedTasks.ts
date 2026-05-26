import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { fetchAssignedTasks } from "../service";

export function useAssignedTasks() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["assigned-tasks", profile?.id],
    queryFn: async () => {
    
      const result = await fetchAssignedTasks(profile!.id);
    
      return result;
    },
    enabled: !!profile?.id,
  });
}
