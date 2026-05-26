import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import type { TaskFilters as TTaskFilters } from "../../../types";
import { useDebounce } from "../../../hooks/useDebounce";
import { useState, useEffect, useCallback } from "react";

interface TaskFiltersProps {
  onChange: (filters: TTaskFilters) => void;
}

const statusOptions = ["all", "todo", "in_progress", "done"];
const priorityOptions = ["all", "low", "medium", "high", "urgent"];

export function TaskFiltersBar({ onChange }: TaskFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const priority = searchParams.get("priority") ?? "all";
  const assigneeId = searchParams.get("assignee") ?? "all";
  const searchRaw = searchParams.get("search") ?? "";

  // Local state only for the search input so we can debounce it
  const [searchInput, setSearchInput] = useState(searchRaw);
  const debouncedSearch = useDebounce(searchInput, 300);

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === "all" || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams],
  ); // setSearchParams is stable — from React Router

  // Sync debounced search into URL
  useEffect(() => {
    setParam("search", debouncedSearch);
  }, [debouncedSearch, setParam]);

  // Notify parent whenever URL params change
  useEffect(() => {
    onChange({
      status: status !== "all" ? (status as TTaskFilters["status"]) : "all",
      priority:
        priority !== "all" ? (priority as TTaskFilters["priority"]) : "all",
      assignee_id: assigneeId !== "all" ? assigneeId : "all",
      search: searchRaw || undefined,
    });
  }, [status, priority, assigneeId, searchRaw, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="bg-gray-800 border border-white/10 rounded-lg pl-8 pr-3 py-2
                     text-sm text-white placeholder:text-gray-500
                     focus:outline-none focus:border-cyan-500/50 w-52"
        />
      </div>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setParam("status", e.target.value)}
        className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2
                   text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s === "all" ? "All statuses" : s.replace("_", " ")}
          </option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={priority}
        onChange={(e) => setParam("priority", e.target.value)}
        className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2
                   text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
      >
        {priorityOptions.map((p) => (
          <option key={p} value={p}>
            {p === "all" ? "All priorities" : p}
          </option>
        ))}
      </select>
    </div>
  );
}
