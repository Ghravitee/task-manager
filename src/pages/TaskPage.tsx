// src/pages/TaskPage.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  User,
  Flag,
  Circle,
  Edit2,
  X,
  Check,
  Trash2,
  Send,
} from "lucide-react";
import { useTask } from "../features/tasks/hooks/useTask";
import { useUpdateTask } from "../features/tasks/hooks/useUpdateTask";
import { useComments } from "../features/comments/hooks/useComments";
import { useCreateComment } from "../features/comments/hooks/useCreateComment";
import { useUpdateComment } from "../features/comments/hooks/useUpdateComment";
import { useDeleteComment } from "../features/comments/hooks/useDeleteComment";
import { useCommentsRealtime } from "../features/comments/hooks/useCommentsRealtime";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { BackButton } from "../components/ui/BackButton";
import { Avatar } from "../components/ui/Avatar";
// import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CalendarPicker } from "../components/ui/CalendarPicker"; // ← new
import type { TaskStatus, TaskPriority } from "../types";
import { useWorkspaceMembers } from "../features/workspaces/hooks/useWorkspaceMembers";

// ─── Constants ────────────────────────────────────────────────

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

// ─── Page ─────────────────────────────────────────────────────

export function TaskPage() {
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();
  const { user, profile } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();
  const { data: members = [] } = useWorkspaceMembers(workspaceId!);

  // ─── Data ──────────────────────────────────────────────────
  const { data: task, isLoading: taskLoading } = useTask(taskId!);
  const { data: comments = [] } = useComments(taskId!);
  useCommentsRealtime(taskId!);

  // ─── Mutations ─────────────────────────────────────────────
  const { mutateAsync: updateTask, isPending: isSaving } = useUpdateTask(
    taskId!,
    projectId!,
  );
  const { mutateAsync: createComment, isPending: isCommenting } =
    useCreateComment(taskId!, user?.id ?? "");
  const { mutateAsync: updateComment } = useUpdateComment(taskId!);
  const { mutateAsync: deleteComment } = useDeleteComment(taskId!);

  // ─── UI state ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  // Add this with the other UI state
  const [savingField, setSavingField] = useState<"status" | "priority" | null>(
    null,
  );

  // ─── Edit form state ────────────────────────────────────────
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("todo");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssigneeId, setEditAssigneeId] = useState("");

  // ─── Derived ───────────────────────────────────────────────
  const isCreator = user?.id === task?.created_by;
  const canEditDetails = isCreator;
  // ─── Edit handlers ──────────────────────────────────────────
  const handleStartEdit = () => {
    if (!task) return;
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date ?? "");
    setEditAssigneeId(task.assignee_id ?? "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toastError("Title is required.");
      return;
    }
    try {
      await updateTask({
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        status: editStatus,
        priority: editPriority,
        due_date: editDueDate || null,
        assignee_id: editAssigneeId || null,
      });
      toastSuccess("Task updated.");
      setIsEditing(false);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update task.");
    }
  };

  // ─── Comment handlers ───────────────────────────────────────
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    try {
      await createComment(commentText.trim());
      setCommentText("");
    } catch {
      toastError("Failed to post comment.");
    }
  };

  const handleStartEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(content);
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!editingCommentText.trim()) return;
    try {
      await updateComment({ commentId, content: editingCommentText.trim() });
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch {
      toastError("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch {
      toastError("Failed to delete comment.");
    }
  };

  const handleStatusChange = async (status: TaskStatus) => {
    setSavingField("status");
    try {
      await updateTask({ status });
      toastSuccess("Status updated.");
    } catch {
      toastError("Failed to update status.");
    } finally {
      setSavingField(null);
    }
  };

  const handlePriorityChange = async (priority: TaskPriority) => {
    setSavingField("priority");
    try {
      await updateTask({ priority });
      toastSuccess("Priority updated.");
    } catch {
      toastError("Failed to update priority.");
    } finally {
      setSavingField(null);
    }
  };

  // ─── Loading ───────────────────────────────────────────────
  if (taskLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Task not found.</p>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Back button */}
      <BackButton
        to={`/workspace/${workspaceId}/project/${projectId}`}
        label="Back to project"
      />

      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
              />
            ) : (
              <h1 className="text-2xl font-bold text-white">{task.title}</h1>
            )}
          </div>
          {/* Edit / Save / Cancel */}
          {canEditDetails && (
            <div className="flex shrink-0 items-center gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X size={14} /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    isLoading={isSaving}
                  >
                    <Check size={14} /> Save
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleStartEdit}>
                  <Edit2 size={14} /> Edit
                </Button>
              )}
            </div>
          )}
        </div>
        {/* Tabs */}
        <div className="mb-6 flex border-b border-white/10">
          {(["details", "comments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "border-b-2 border-cyan-500 text-cyan-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {tab === "comments" && comments.length > 0 && (
                <span className="ml-1.5 rounded-full bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">
                  {comments.length}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* ── Details tab ──────────────────────────────────────── */}
        {activeTab === "details" && (
          <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-gray-900 p-6">
            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-fit">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Circle size={12} /> Status
                </span>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as TaskStatus)
                    }
                    className="rounded-lg border border-white/10 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(e.target.value as TaskStatus)
                    }
                    disabled={savingField === "status"}
                    className="rounded-lg border border-white/10 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 w-fit"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex flex-col gap-1.5 w-fit">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Flag size={12} /> Priority
                </span>
                {isEditing ? (
                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(e.target.value as TaskPriority)
                    }
                    className="rounded-lg border border-white/10 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    {PRIORITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={task.priority}
                    onChange={(e) =>
                      handlePriorityChange(e.target.value as TaskPriority)
                    }
                    disabled={savingField === "priority"}
                    className="rounded-lg border border-white/10 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 w-fit"
                  >
                    {PRIORITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            {/* Assignee */}
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <User size={12} /> Assignee
              </span>
              {isEditing ? (
                <select
                  value={editAssigneeId}
                  onChange={(e) => setEditAssigneeId(e.target.value)}
                  className="rounded-lg border border-white/10 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.profile?.full_name ?? member.profile?.email}
                    </option>
                  ))}
                </select>
              ) : task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    src={task.assignee.avatar_url}
                    name={task.assignee.full_name}
                    size="xs"
                  />
                  <span className="text-sm text-gray-300">
                    {task.assignee.full_name ?? task.assignee.email}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Unassigned</span>
              )}
            </div>
            {/* Due date — CalendarPicker replaces the plain date input */}
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar size={12} /> Due date
              </span>
              {isEditing ? (
                <CalendarPicker
                  value={editDueDate}
                  onChange={setEditDueDate}
                  placeholder="Pick a due date"
                />
              ) : task.due_date ? (
                <span className="text-sm text-gray-300">
                  {new Date(task.due_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ) : (
                <span className="text-sm text-gray-500">No due date</span>
              )}
            </div>
            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-500">Description</span>
              {isEditing ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              ) : task.description ? (
                <p className="whitespace-pre-wrap text-sm text-gray-300">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  No description provided.
                </p>
              )}
            </div>
            {/* Creator */}
            {task.creator && (
              <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                <span className="text-xs text-gray-500">Created by</span>
                <Avatar
                  src={task.creator.avatar_url}
                  name={task.creator.full_name}
                  size="xs"
                />
                <span className="text-xs text-gray-400">
                  {task.creator.full_name ?? task.creator.email}
                </span>
              </div>
            )}
          </div>
        )}
        {/* ── Comments tab ─────────────────────────────────────── */}
        {activeTab === "comments" && (
          <div className="flex flex-col gap-4">
            {/* Comment input */}
            <div className="flex gap-3">
              <Avatar
                src={profile?.avatar_url}
                name={profile?.full_name}
                size="sm"
              />
              <div className="flex flex-1 flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  className="w-full resize-none rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    isLoading={isCommenting}
                    disabled={!commentText.trim()}
                  >
                    <Send size={13} /> Comment
                  </Button>
                </div>
              </div>
            </div>
            {/* Comments list */}
            {comments.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No comments yet. Be the first to comment.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {comments.map((comment) => {
                  const isOwner = comment.user_id === user?.id;
                  const isEditingThis = editingCommentId === comment.id;
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar
                        src={comment.profile?.avatar_url}
                        name={comment.profile?.full_name}
                        size="sm"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        {/* Comment header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">
                              {comment.profile?.full_name ??
                                comment.profile?.email}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                          {/* Edit / Delete — own comments only */}
                          {isOwner && !isEditingThis && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleStartEditComment(
                                    comment.id,
                                    comment.content,
                                  )
                                }
                                className="rounded p-1 text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="rounded p-1 text-gray-500 transition hover:bg-white/5 hover:text-red-400"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                        {/* Comment body */}
                        {isEditingThis ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) =>
                                setEditingCommentText(e.target.value)
                              }
                              rows={2}
                              className="w-full resize-none rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleSaveEditComment(comment.id)
                                }
                              >
                                <Check size={13} /> Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingCommentId(null)}
                              >
                                <X size={13} /> Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm text-gray-300">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPage;
