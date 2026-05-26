// features/tasks/hooks/useTasksRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export function useTasksRealtime(projectId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`tasks:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          // Any change to tasks in this project → invalidate the cache
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
      )
      .subscribe();

    // Cleanup when component unmounts or projectId changes
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);
}
