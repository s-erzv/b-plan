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
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-[#0E0E1A] border border-dashed border-white/[0.07]">
        <FolderOpen className="w-10 h-10 text-[#3a3a55] mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#6B6B8A]">Belum ada arsip.</p>
        <p className="text-xs text-[#4a4a65] mt-1 max-w-xs leading-relaxed">
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
          className="group relative bg-[#0E0E1A] p-5 rounded-2xl border border-white/[0.07] hover:border-violet-500/30 transition-all cursor-pointer flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-display font-bold text-white text-base leading-tight group-hover:text-violet-300 transition-colors truncate">
                {p.productName}
              </h4>
              <p className="text-xs text-[#6B6B8A] mt-0.5 truncate">
                {p.targetAudience}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                disabled={deletingId === p.id}
                onClick={(e) => handleDeleteClick(e, p.id, p.productName)}
                className="p-2 rounded-lg bg-[#161625] border border-white/[0.06] text-[#6B6B8A] hover:text-red-400 hover:bg-red-900/20 hover:border-red-700/25 transition-all disabled:opacity-50"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="p-2 rounded-lg bg-[#161625] border border-white/[0.06] text-[#6B6B8A] group-hover:text-violet-300 group-hover:bg-violet-900/20 group-hover:border-violet-700/25 transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-violet-900/20 text-violet-300 border border-violet-700/20">
              {p.businessCategory || "Umum"}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B6B8A]">
              <Calendar className="w-3 h-3" />
              {formatDate(p.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
