import { useMutation } from "@tanstack/react-query";
import { acceptInvite } from "../service";
import { useAuth } from "../../../context/AuthContext";

export function useAcceptInvite() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: (token: string) => acceptInvite(token, user?.id ?? ""),
  });
}
