import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkspaces, createWorkspace, deleteWorkspace } from "../service";
import { useToast } from "../../../hooks/useToast";
import type { CreateWorkspaceInput } from "../types";

export const WORKSPACES_KEY = ["workspaces"];

export function useWorkspaces() {
  return useQuery({
    queryKey: WORKSPACES_KEY,
    queryFn: fetchWorkspaces,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => createWorkspace(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      toastSuccess("Workspace created successfully.");
    },
    onError: (err: Error) => {
      toastError(err.message ?? "Failed to create workspace.");
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      toastSuccess("Workspace deleted.");
    },
    onError: (err: Error) => {
      toastError(err.message ?? "Failed to delete workspace.");
    },
  });
}
