import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

interface ProjectFormProps {
  onSubmit: (data: { name: string; description?: string }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  onSubmit,
  onClose,
  isLoading,
}: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  }

  return (
    <Modal title="New Project" onClose={onClose} isOpen={true}>
      <div className="flex flex-col gap-4">
        <Input
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Website Redesign"
          autoFocus
        />
        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this project about?"
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
            isLoading={isLoading}
          >
            Create project
          </Button>
        </div>
      </div>
    </Modal>
  );
}
