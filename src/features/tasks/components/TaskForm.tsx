import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Avatar } from "../../../components/ui/Avatar";
import { useWorkspaceMembers } from "../../workspaces/hooks/useWorkspaceMembers";
import { CalendarPicker } from "../../../components/ui/CalendarPicker";

interface TaskFormProps {
  workspaceId: string;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: string;
    assignee_id?: string;
    due_date?: string;
  }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const priorityOptions = ["low", "medium", "high", "urgent"];

export function TaskForm({
  workspaceId,
  onSubmit,
  onClose,
  isLoading,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const { data: members = [] } = useWorkspaceMembers(workspaceId);

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assignee_id: assigneeId || undefined,
      due_date: dueDate || undefined,
    });
  }

  return (
    <Modal title="New Task" onClose={onClose} isOpen={true}>
      <div className="flex flex-col gap-4">
        <Input
          label="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design landing page"
          autoFocus
        />
        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any extra details..."
        />

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2
                       text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Assignee (optional)</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2
                       text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.profile?.full_name ?? member.profile?.email}
              </option>
            ))}
          </select>

          {/* Preview selected assignee */}
          {assigneeId && (
            <div className="flex items-center gap-2 mt-1">
              {(() => {
                const selected = members.find((m) => m.user_id === assigneeId);
                return selected ? (
                  <>
                    <Avatar
                      src={selected.profile?.avatar_url}
                      name={selected.profile?.full_name}
                      size="xs"
                    />
                    <span className="text-xs text-gray-400">
                      {selected.profile?.full_name ?? selected.profile?.email}
                    </span>
                  </>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Due date */}
        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Due date (optional)</label>

          <CalendarPicker
            value={dueDate}
            onChange={setDueDate}
            placeholder="Select due date"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            isLoading={isLoading}
          >
            Create task
          </Button>
        </div>
      </div>
    </Modal>
  );
}
