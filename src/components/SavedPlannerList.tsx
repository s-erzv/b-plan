import React, { useState } from "react";
import { SavedCalendar } from "../types";
import { Calendar, Trash2, ArrowUpRight, FolderOpen } from "lucide-react";

interface SavedPlannerListProps {
  planners: SavedCalendar[];
  onSelect: (planner: SavedCalendar) => void;
  onDelete: (id: string) => void;
}

export const SavedPlannerList: React.FC<SavedPlannerListProps> = ({ planners, onSelect, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Hapus kalender konten "${name}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  if (planners.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center rounded-2xl"
        style={{ background: "var(--card-bg)", border: "1px dashed var(--border-2)" }}
      >
        <FolderOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-2)", opacity: 0.4 }} />
        <p className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>Belum ada arsip.</p>
        <p className="text-xs mt-1 max-w-xs leading-relaxed" style={{ color: "var(--text-2)", opacity: 0.6 }}>
          Buat kalender konten dan simpan ke arsip untuk melihatnya di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {planners.map((p) => (
        <div
          key={p.id}
          onClick={() => onSelect(p)}
          className="group relative p-5 rounded-2xl transition-all cursor-pointer flex flex-col gap-3"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4
                className="font-display font-bold text-base leading-tight truncate transition-colors"
                style={{ color: "var(--text)" }}
              >
                {p.productName}
              </h4>
              <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-2)" }}>
                {p.targetAudience}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                disabled={deletingId === p.id}
                onClick={(e) => handleDeleteClick(e, p.id, p.productName)}
                className="p-2 rounded-lg transition-all disabled:opacity-50 hover:text-red-400"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.25)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-3)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                }}
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div
                className="p-2 rounded-lg transition-all"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.22)" }}
            >
              {p.businessCategory || "Umum"}
            </span>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-2)" }}>
              <Calendar className="w-3 h-3" />
              {formatDate(p.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
