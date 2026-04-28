"use client";

import { useState, useTransition } from "react";
import { LayoutList, Columns, ChevronUp, ChevronDown, Trash2, Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import {
  addMilestoneAction,
  toggleMilestoneAction,
  deleteMilestoneAction,
  reorderMilestonesAction,
} from "@/app/(dashboard)/projects/actions";
import type { ProjectMilestone } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface MilestoneBoardProps {
  projectId: string;
  initialMilestones: ProjectMilestone[];
}

type View = "table" | "board";

export default function MilestoneBoard({ projectId, initialMilestones }: MilestoneBoardProps) {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [view, setView] = useState<View>(() => {
    if (typeof window === "undefined") return "table";
    return (localStorage.getItem(`milestone-view-${projectId}`) as View) || "table";
  });
  const [isPending, startTransition] = useTransition();
  const [addTitle, setAddTitle] = useState("");
  const [addDueDate, setAddDueDate] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const toast = useToast();
  const [addError, setAddError] = useState<string | null>(null);

  function switchView(v: View) {
    setView(v);
    localStorage.setItem(`milestone-view-${projectId}`, v);
  }

  function handleToggle(milestoneId: string, current: boolean) {
    const newCompleted = !current;
    // Optimistic update
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? { ...m, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
          : m
      )
    );
    startTransition(() => {
      toggleMilestoneAction(milestoneId, newCompleted, projectId);
    });
  }

  function handleDelete(milestoneId: string) {
    setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
    startTransition(() => {
      deleteMilestoneAction(milestoneId, projectId);
    });
  }

  function handleMove(idx: number, direction: "up" | "down") {
    const newList = [...milestones];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newList.length) return;
    [newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]];
    setMilestones(newList);
    startTransition(() => {
      reorderMilestonesAction(newList.map((m) => m.id), projectId);
    });
  }

  async function handleAdd() {
    if (!addTitle.trim()) return;
    setAddLoading(true);
    setAddError(null);
    toast.loading("Adding milestone...");
    const fd = new FormData();
    fd.append("title", addTitle.trim());
    if (addDueDate) fd.append("due_date", addDueDate);
    const result = await addMilestoneAction(projectId, fd);
    if (result?.error) {
      toast.error(result.error);
      setAddError(result.error);
    } else {
      // Optimistic add with temp id
      setMilestones((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          project_id: projectId,
          title: addTitle.trim(),
          due_date: addDueDate || null,
          completed: false,
          completed_at: null,
          sort_order: prev.length,
        },
      ]);
      setAddTitle("");
      setAddDueDate("");
      toast.success("Milestone added!");
    }
    setAddLoading(false);
  }

  const total = milestones.length;
  const done = milestones.filter((m) => m.completed).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  // Board columns
  const doneMilestones = milestones.filter((m) => m.completed);
  const incomplete = milestones.filter((m) => !m.completed);
  const inProgress = incomplete.slice(0, 1);
  const todo = incomplete.slice(1);

  return (
    <div>
      {/* Header with progress + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold text-teal">{progress}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500">{done}/{total} complete</span>
        </div>
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => switchView("table")}
            className={`p-1.5 rounded transition-colors ${view === "table" ? "bg-teal/20 text-teal" : "text-gray-500 hover:text-foreground"}`}
            title="Table view"
          >
            <LayoutList className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => switchView("board")}
            className={`p-1.5 rounded transition-colors ${view === "board" ? "bg-teal/20 text-teal" : "text-gray-500 hover:text-foreground"}`}
            title="Board view"
          >
            <Columns className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="space-y-1">
          {milestones.length === 0 && (
            <p className="text-sm text-gray-500 py-4 text-center">No milestones yet. Add one below.</p>
          )}
          {milestones.map((m, idx) => (
            <div
              key={m.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                m.completed
                  ? "border-teal/20 bg-teal/5"
                  : "border-border hover:border-teal/30"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(m.id, m.completed)}
                className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  m.completed
                    ? "bg-teal border-teal"
                    : "border-[#555] hover:border-teal"
                }`}
              >
                {m.completed && <Check className="h-3 w-3 text-foreground" />}
              </button>

              {/* Title + due date */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${m.completed ? "line-through text-gray-500" : "text-white"}`}>
                  {m.title}
                </span>
                {m.due_date && (
                  <span className="ml-2 text-xs text-gray-500">{formatDate(m.due_date)}</span>
                )}
              </div>

              {/* Reorder + delete */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0 || isPending}
                  className="p-1 text-gray-500 hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === milestones.length - 1 || isPending}
                  className="p-1 text-gray-500 hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Board View */}
      {view === "board" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "To Do", color: "border-gray-600", items: todo, dot: "bg-gray-500" },
            { label: "In Progress", color: "border-amber-500/50", items: inProgress, dot: "bg-amber-400" },
            { label: "Done", color: "border-teal/50", items: doneMilestones, dot: "bg-teal" },
          ].map((col) => (
            <div key={col.label} className={`rounded-lg border ${col.color} bg-card p-3`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-2 w-2 rounded-full ${col.dot}`} />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{col.label}</span>
                <span className="ml-auto text-xs text-gray-600">{col.items.length}</span>
              </div>
              <div className="space-y-2">
                {col.items.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-background rounded-lg border border-border group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${m.completed ? "line-through text-gray-500" : "text-white"}`}>
                        {m.title}
                      </p>
                      <button
                        onClick={() => handleToggle(m.id, m.completed)}
                        className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          m.completed
                            ? "bg-teal border-teal"
                            : "border-[#444] hover:border-teal"
                        }`}
                      >
                        {m.completed && <Check className="h-2.5 w-2.5 text-foreground" />}
                      </button>
                    </div>
                    {m.due_date && (
                      <p className="text-xs text-gray-600 mt-1">{formatDate(m.due_date)}</p>
                    )}
                  </div>
                ))}
                {col.items.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-3">Empty</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Milestone */}
      <div className="mt-4 pt-4 border-t border-border">
        {addError && (
          <p className="text-xs text-red-400 mb-2">{addError}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a milestone..."
            className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm placeholder-gray-600 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
          />
          <input
            type="date"
            value={addDueDate}
            onChange={(e) => setAddDueDate(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={addLoading || !addTitle.trim()}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal hover:bg-teal-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
