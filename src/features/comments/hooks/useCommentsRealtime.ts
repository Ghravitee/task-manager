import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import type { TaskComment } from "../../../types";

export function useCommentsRealtime(taskId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`comments:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_comments",
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // Refetch on insert — we need the joined profile data
            // that raw realtime payload doesn't include
            queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
          }

          if (payload.eventType === "UPDATE") {
            queryClient.setQueryData<TaskComment[]>(
              ["comments", taskId],
              (prev) =>
                prev?.map((c) =>
                  c.id === payload.new.id ? { ...c, ...payload.new } : c,
                ) ?? [],
            );
          }

          if (payload.eventType === "DELETE") {
            queryClient.setQueryData<TaskComment[]>(
              ["comments", taskId],
              (prev) => prev?.filter((c) => c.id !== payload.old.id) ?? [],
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);
}
