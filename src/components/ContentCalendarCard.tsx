import React, { useState } from "react";
import { ContentDay } from "../types";
import {
  Copy, Check, Calendar, Sparkles, CheckCircle, Video,
  Film, Download, RefreshCw, PlayCircle, ImageIcon, ChevronDown, ChevronUp,
  Hash, Clock
} from "lucide-react";

interface ContentCalendarCardProps {
  dayInfo: ContentDay;
  productName: string;
  accessToken: string | null;
  onAlert: (msg: string, type: "success" | "error" | "info") => void;
}

const dayThemeColors: Record<string, { dot: string; badge: string }> = {
  edu: { dot: "bg-blue-400", badge: "bg-blue-900/30 text-blue-300 border-blue-700/30" },
  tips: { dot: "bg-blue-400", badge: "bg-blue-900/30 text-blue-300 border-blue-700/30" },
  promo: { dot: "bg-rose-400", badge: "bg-rose-900/30 text-rose-300 border-rose-700/30" },
  diskon: { dot: "bg-rose-400", badge: "bg-rose-900/30 text-rose-300 border-rose-700/30" },
  sell: { dot: "bg-rose-400", badge: "bg-rose-900/30 text-rose-300 border-rose-700/30" },
  behind: { dot: "bg-amber-400", badge: "bg-amber-900/30 text-amber-300 border-amber-700/30" },
  proses: { dot: "bg-amber-400", badge: "bg-amber-900/30 text-amber-300 border-amber-700/30" },
  dapur: { dot: "bg-amber-400", badge: "bg-amber-900/30 text-amber-300 border-amber-700/30" },
  testi: { dot: "bg-emerald-400", badge: "bg-emerald-900/30 text-emerald-300 border-emerald-700/30" },
  review: { dot: "bg-emerald-400", badge: "bg-emerald-900/30 text-emerald-300 border-emerald-700/30" },
  rekomen: { dot: "bg-emerald-400", badge: "bg-emerald-900/30 text-emerald-300 border-emerald-700/30" },
};

function getThemeStyle(theme: string) {
  const lower = theme.toLowerCase();
  for (const [key, val] of Object.entries(dayThemeColors)) {
    if (lower.includes(key)) return val;
  }
  return { dot: "bg-violet-400", badge: "bg-violet-900/30 text-violet-300 border-violet-700/30" };
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#0E0E1A] border border-white/[0.07] text-[#F0F0F8] text-xs outline-none focus:border-violet-500/40 transition-all";

export const ContentCalendarCard: React.FC<ContentCalendarCardProps> = ({
  dayInfo, productName, accessToken, onAlert
}) => {
  const { day, theme, visual_concept, caption, hashtags } = dayInfo;
  const themeStyle = getThemeStyle(theme);

  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("10:00");
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + day);
    return d.toISOString().split("T")[0];
  });
  const [calendarLink, setCalendarLink] = useState<string | null>(null);

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState("");

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<"1:1" | "9:16" | "16:9" | "4:3">("1:1");
  const [imageError, setImageError] = useState<string | null>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${caption}\n\n${hashtags.join(" ")}`);
    setCopiedCaption(true);
    onAlert(`Caption Hari ${day} berhasil disalin!`, "success");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    setImageUrl(null);
    try {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visualConcept: visual_concept, productName, aspectRatio: imageAspectRatio }),
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body.error || "Gagal membuat gambar.");
      setImageUrl(body.imageUrl);
      onAlert(`Gambar Hari ${day} selesai!`, "success");
    } catch (err: any) {
      setImageError(err.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoUrl(null);
    setVideoProgress("Menyelaraskan ide dengan model AI...");
    try {
      const resp = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visualConcept: visual_concept, productName, aspectRatio }),
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body.error || "Gagal membuat video.");
      const { operationName } = body;
      setVideoProgress("AI sedang merender video...");
      const poll = setInterval(async () => {
        try {
          const sr = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName }),
          });
          const sb = await sr.json();
          if (!sr.ok) throw new Error(sb.error || "Status error.");
          if (sb.done) {
            clearInterval(poll);
            setVideoUrl(`/api/video-download?operationName=${encodeURIComponent(operationName)}`);
            setIsGeneratingVideo(false);
            onAlert(`Video Hari ${day} selesai!`, "success");
          } else {
            setVideoProgress("Veo 3.1 sedang merancang visual...");
          }
        } catch (err: any) {
          clearInterval(poll);
          setVideoError(err.message);
          setIsGeneratingVideo(false);
        }
      }, 7000);
    } catch (err: any) {
      setVideoError(err.message);
      setIsGeneratingVideo(false);
    }
  };

  const handleScheduleEvent = async () => {
    if (!accessToken) {
      onAlert("Koneksi Google kedaluwarsa. Masuk kembali.", "error");
      return;
    }
    const confirmed = window.confirm(`Jadwalkan Hari ${day} ("${theme}") ke Google Calendar pada ${scheduledDate} pukul ${scheduledTime}?`);
    if (!confirmed) return;
    setIsScheduling(true);
    try {
      const startMs = new Date(`${scheduledDate}T${scheduledTime}:00`).getTime();
      if (isNaN(startMs)) throw new Error("Tanggal/waktu tidak valid.");
      const endMs = startMs + 30 * 60 * 1000;
      const eventPayload = {
        summary: `[B-Plan] ${productName} — Hari ${day}: ${theme}`,
        description: `📅 B-Plan Social Media Planner\n\n📌 Tema: ${theme}\n\n🎬 Konsep Visual:\n${visual_concept}\n\n✍️ Caption:\n${caption}\n\n🏷️ Hashtags:\n${hashtags.join(" ")}`,
        start: { dateTime: new Date(startMs).toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta" },
        end: { dateTime: new Date(endMs).toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta" },
        colorId: "5",
        reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
      };
      const r = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      });
      if (!r.ok) {
        const ed = await r.json();
        throw new Error(ed?.error?.message || "Gagal membuat event.");
      }
      const result = await r.json();
      setCalendarLink(result.htmlLink || "https://calendar.google.com");
      onAlert(`Hari ${day} berhasil dijadwalkan!`, "success");
    } catch (err: any) {
      onAlert(`Gagal: ${err.message}`, "error");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] flex flex-col overflow-hidden hover:border-white/[0.12] transition-colors">

      {/* Card Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161625] border border-white/[0.08] flex items-center justify-center font-display font-black text-white text-sm">
            {day}
          </div>
          <div>
            <p className="text-xs text-[#6B6B8A] font-medium">Hari {day}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${themeStyle.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${themeStyle.dot}`} />
          {theme}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">

        {/* Visual Concept */}
        <div>
          <p className="text-[10px] font-semibold text-[#6B6B8A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-400" />
            Konsep Visual
          </p>
          <div className="p-3.5 rounded-xl bg-[#161625] border border-white/[0.06] text-[#A0A0C0] text-xs leading-relaxed italic">
            "{visual_concept}"
          </div>
        </div>

        {/* Caption */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-[#6B6B8A] uppercase tracking-wider">Caption & CTA</p>
            <button
              onClick={handleCopyCaption}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                copiedCaption
                  ? "bg-emerald-900/30 text-emerald-300 border border-emerald-700/30"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-[#A0A0C0] hover:text-white border border-white/[0.06]"
              }`}
            >
              {copiedCaption ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedCaption ? "Tersalin!" : "Salin"}
            </button>
          </div>
          <div className="p-4 rounded-xl bg-[#161625] border border-white/[0.06] text-[#D0D0E8] text-sm leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
            {caption}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <p className="text-[10px] font-semibold text-[#6B6B8A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Hash className="w-3 h-3" />
            Hashtag
          </p>
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigator.clipboard.writeText(tag);
                  onAlert(`Salin: ${tag}`, "info");
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-violet-900/20 border border-violet-700/25 text-violet-300 hover:bg-violet-900/40 transition-colors font-medium"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </button>
            ))}
          </div>
        </div>

        {/* Media Generation (collapsible) */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <button
            onClick={() => setShowMedia(!showMedia)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#161625] hover:bg-[#1a1a2e] transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-[#A0A0C0]">Generate Visual AI</span>
              <span className="tag tag-violet text-[9px] py-0.5">Gambar + Video</span>
            </div>
            {showMedia ? <ChevronUp className="w-4 h-4 text-[#6B6B8A]" /> : <ChevronDown className="w-4 h-4 text-[#6B6B8A]" />}
          </button>

          {showMedia && (
            <div className="p-4 flex flex-col gap-5 bg-[#0E0E1A]">
              {/* Image Gen */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#A0A0C0] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Gambar Promosi (Gemini 2.5)
                  </p>
                  <span className="text-[9px] text-emerald-400 bg-emerald-900/20 border border-emerald-700/25 px-2 py-0.5 rounded-full">Gemini</span>
                </div>
                {imageUrl ? (
                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden bg-[#161625]">
                      <img src={imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-auto object-cover max-h-[280px]" />
                    </div>
                    <a href={imageUrl} download={`BPlan_Day${day}.png`} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors">
                      <Download className="w-3.5 h-3.5" /> Unduh Gambar
                    </a>
                  </div>
                ) : isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                    <p className="text-xs text-[#6B6B8A]">AI sedang menggambar...</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1">
                      {(["1:1", "9:16", "16:9", "4:3"] as const).map((r) => (
                        <button key={r} onClick={() => setImageAspectRatio(r)} className={`text-[10px] px-2 py-1 rounded-lg font-semibold border transition-all ${imageAspectRatio === r ? "bg-emerald-600 text-white border-emerald-600" : "bg-[#161625] text-[#6B6B8A] border-white/[0.06] hover:border-white/[0.1]"}`}>{r}</button>
                      ))}
                    </div>
                    <button onClick={handleGenerateImage} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap">
                      <PlayCircle className="w-3.5 h-3.5" /> Buat Gambar
                    </button>
                  </div>
                )}
                {imageError && <p className="text-[10px] text-red-400 bg-red-900/20 border border-red-700/25 rounded-lg px-3 py-2">{imageError}</p>}
              </div>

              <div className="h-px bg-white/[0.05]" />

              {/* Video Gen */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#A0A0C0] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-violet-400" />
                    Video Promosi (Veo 3.1)
                  </p>
                  <span className="text-[9px] text-amber-400 bg-amber-900/20 border border-amber-700/25 px-2 py-0.5 rounded-full">Beta</span>
                </div>
                {videoUrl ? (
                  <div className="flex flex-col gap-2">
                    <video controls className="w-full aspect-video rounded-xl border border-white/[0.07] bg-black" src={videoUrl} />
                    <a href={videoUrl} download={`BPlan_Video_Day${day}.mp4`} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors">
                      <Download className="w-3.5 h-3.5" /> Unduh Video
                    </a>
                  </div>
                ) : isGeneratingVideo ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
                    <p className="text-xs text-[#6B6B8A]">{videoProgress}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1">
                      {(["9:16", "16:9"] as const).map((r) => (
                        <button key={r} onClick={() => setAspectRatio(r)} className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold border transition-all ${aspectRatio === r ? "bg-violet-600 text-white border-violet-600" : "bg-[#161625] text-[#6B6B8A] border-white/[0.06] hover:border-white/[0.1]"}`}>{r}</button>
                      ))}
                    </div>
                    <button onClick={handleGenerateVideo} className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap">
                      <PlayCircle className="w-3.5 h-3.5" /> Buat Video
                    </button>
                  </div>
                )}
                {videoError && <p className="text-[10px] text-red-400 bg-red-900/20 border border-red-700/25 rounded-lg px-3 py-2">{videoError}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Google Calendar (collapsible) */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#161625] hover:bg-[#1a1a2e] transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-[#A0A0C0]">Jadwalkan ke Google Calendar</span>
              {calendarLink && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </div>
            {showCalendar ? <ChevronUp className="w-4 h-4 text-[#6B6B8A]" /> : <ChevronDown className="w-4 h-4 text-[#6B6B8A]" />}
          </button>

          {showCalendar && (
            <div className="p-4 bg-[#0E0E1A]">
              {calendarLink ? (
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/25">
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Dijadwalkan: {scheduledDate} pukul {scheduledTime}
                  </div>
                  <a href={calendarLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 underline hover:text-emerald-300 transition-colors">
                    Buka di Google Calendar →
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-[#6B6B8A] mb-1.5">Tanggal</p>
                      <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#6B6B8A] mb-1.5">Pukul</p>
                      <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <button
                    onClick={handleScheduleEvent}
                    disabled={isScheduling || !accessToken}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#161625] hover:bg-[#1e1e35] border border-white/[0.08] text-white text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isScheduling ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menjadwalkan...</>
                    ) : (
                      <><Calendar className="w-3.5 h-3.5 text-blue-400" /> Jadwalkan ke Calendar</>
                    )}
                  </button>
                  {!accessToken && (
                    <p className="text-[10px] text-amber-400 text-center">Koneksi Google diperlukan. Masuk ulang.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
