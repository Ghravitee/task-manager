import { useState } from "react";
import { useCreateWorkspace } from "../hooks/useWorkspaces";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

interface WorkspaceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function WorkspaceForm({ onSuccess, onCancel }: WorkspaceFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }

    createWorkspace({ name: name.trim() }, { onSuccess });
  };

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Workspace name"
        placeholder="e.g. Acme Inc, My Team, Side Project"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError("");
        }}
        error={error}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        autoFocus
      />

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} isLoading={isPending}>
          Create workspace
        </Button>
      </div>
    </div>
  );
}
