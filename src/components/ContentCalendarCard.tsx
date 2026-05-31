import React, { useState } from "react";
import { ContentDay } from "../types";
import {
  Copy, Check, Calendar, Sparkles, CheckCircle, Video,
  Film, Download, RefreshCw, PlayCircle, ImageIcon, ChevronDown, ChevronUp,
  Hash, Clock,
} from "lucide-react";

interface ContentCalendarCardProps {
  dayInfo: ContentDay;
  productName: string;
  accessToken: string | null;
  onAlert: (msg: string, type: "success" | "error" | "info") => void;
}

const dayThemeColors: Record<string, { dot: string; color: string }> = {
  edu:     { dot: "#3B82F6", color: "rgba(59,130,246,0.12)"  },
  tips:    { dot: "#3B82F6", color: "rgba(59,130,246,0.12)"  },
  promo:   { dot: "#EF4444", color: "rgba(239,68,68,0.12)"   },
  diskon:  { dot: "#EF4444", color: "rgba(239,68,68,0.12)"   },
  sell:    { dot: "#EF4444", color: "rgba(239,68,68,0.12)"   },
  behind:  { dot: "#F59E0B", color: "rgba(245,158,11,0.12)"  },
  proses:  { dot: "#F59E0B", color: "rgba(245,158,11,0.12)"  },
  dapur:   { dot: "#F59E0B", color: "rgba(245,158,11,0.12)"  },
  testi:   { dot: "#10B981", color: "rgba(16,185,129,0.12)"  },
  review:  { dot: "#10B981", color: "rgba(16,185,129,0.12)"  },
  rekomen: { dot: "#10B981", color: "rgba(16,185,129,0.12)"  },
};

function getThemeStyle(theme: string) {
  const lower = theme.toLowerCase();
  for (const [key, val] of Object.entries(dayThemeColors)) {
    if (lower.includes(key)) return val;
  }
  return { dot: "#A78BFA", color: "rgba(167,139,250,0.12)" };
}

export const ContentCalendarCard: React.FC<ContentCalendarCardProps> = ({
  dayInfo, productName, accessToken, onAlert,
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
    const confirmed = window.confirm(
      `Jadwalkan Hari ${day} ("${theme}") ke Google Calendar pada ${scheduledDate} pukul ${scheduledTime}?`
    );
    if (!confirmed) return;
    setIsScheduling(true);
    try {
      const startMs = new Date(`${scheduledDate}T${scheduledTime}:00`).getTime();
      if (isNaN(startMs)) throw new Error("Tanggal/waktu tidak valid.");
      const endMs = startMs + 30 * 60 * 1000;
      const eventPayload = {
        summary: `[B-Plan] ${productName} — Hari ${day}: ${theme}`,
        description: `B-Plan Social Media Planner\n\nTema: ${theme}\n\nKonsep Visual:\n${visual_concept}\n\nCaption:\n${caption}\n\nHashtags:\n${hashtags.join(" ")}`,
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

  const inputCls = "w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
    + " bg-[var(--bg-3)] border border-[var(--border-2)] text-[var(--text)]"
    + " focus:border-[var(--gold)] focus:ring-1 focus:ring-[rgba(245,158,11,0.15)]";

  const collapseHeaderCls = "w-full flex items-center justify-between px-4 py-3 transition-all text-left";

  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden transition-all hover:translate-y-[-2px]"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)")}
    >
      {/* ── Card Header ─────────────────────────────── */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-extrabold text-sm"
            style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
          >
            {day}
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--text-2)" }}>Hari {day}</span>
        </div>
        <div
          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: themeStyle.color, color: themeStyle.dot, border: `1px solid ${themeStyle.dot}28` }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: themeStyle.dot }} />
          {theme}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Visual Concept */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--text-2)" }}>
            <Sparkles className="w-3 h-3" style={{ color: "var(--gold)" }} />
            Konsep Visual
          </p>
          <div
            className="p-3.5 rounded-xl text-xs leading-relaxed italic"
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-2)" }}
          >
            "{visual_concept}"
          </div>
        </div>

        {/* Caption */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
              Caption & CTA
            </p>
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
              style={copiedCaption ? {
                background: "rgba(16,185,129,0.12)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.28)"
              } : {
                background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)"
              }}
            >
              {copiedCaption ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedCaption ? "Tersalin!" : "Salin"}
            </button>
          </div>
          <div
            className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line max-h-44 overflow-y-auto"
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {caption}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--text-2)" }}>
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
                className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.2)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--gold-dim)")}
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </button>
            ))}
          </div>
        </div>

        {/* Media Generation (collapsible) */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowMedia(!showMedia)}
            className={collapseHeaderCls}
            style={{ background: "var(--bg-3)" }}
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" style={{ color: "var(--gold)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>Generate Visual AI</span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.25)" }}
              >
                Gambar + Video
              </span>
            </div>
            {showMedia
              ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-2)" }} />
              : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-2)" }} />
            }
          </button>

          {showMedia && (
            <div className="p-4 flex flex-col gap-5" style={{ background: "var(--card-bg)" }}>
              {/* Image Gen */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-2)" }}>
                    <ImageIcon className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />
                    Gambar Promosi (Gemini 2.5)
                  </p>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "var(--green)", border: "1px solid rgba(16,185,129,0.25)" }}>
                    Gemini
                  </span>
                </div>
                {imageUrl ? (
                  <div className="flex flex-col gap-2">
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <img src={imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-auto object-cover max-h-[280px]" />
                    </div>
                    <a
                      href={imageUrl}
                      download={`BPlan_Day${day}.png`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: "var(--green)", color: "white" }}
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Gambar
                    </a>
                  </div>
                ) : isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "var(--green)" }} />
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>AI sedang menggambar...</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1">
                      {(["1:1", "9:16", "16:9", "4:3"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setImageAspectRatio(r)}
                          className="text-[10px] px-2 py-1 rounded-lg font-semibold border transition-all"
                          style={imageAspectRatio === r
                            ? { background: "var(--green)", color: "white", borderColor: "var(--green)" }
                            : { background: "var(--bg-3)", color: "var(--text-2)", borderColor: "var(--border)" }
                          }
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleGenerateImage}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-all hover:opacity-90"
                      style={{ background: "var(--green)", color: "white" }}
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Buat Gambar
                    </button>
                  </div>
                )}
                {imageError && (
                  <p className="text-[10px] rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.22)" }}>
                    {imageError}
                  </p>
                )}
              </div>

              <div className="h-px" style={{ background: "var(--border)" }} />

              {/* Video Gen */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--text-2)" }}>
                    <Video className="w-3.5 h-3.5" style={{ color: "#A78BFA" }} />
                    Video Promosi (Veo 3.1)
                  </p>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.25)" }}>
                    Beta
                  </span>
                </div>
                {videoUrl ? (
                  <div className="flex flex-col gap-2">
                    <video controls className="w-full aspect-video rounded-xl" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }} src={videoUrl} />
                    <a
                      href={videoUrl}
                      download={`BPlan_Video_Day${day}.mp4`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold"
                      style={{ background: "#A78BFA", color: "white" }}
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Video
                    </a>
                  </div>
                ) : isGeneratingVideo ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#A78BFA" }} />
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>{videoProgress}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1">
                      {(["9:16", "16:9"] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setAspectRatio(r)}
                          className="text-[10px] px-2.5 py-1 rounded-lg font-semibold border transition-all"
                          style={aspectRatio === r
                            ? { background: "#A78BFA", color: "white", borderColor: "#A78BFA" }
                            : { background: "var(--bg-3)", color: "var(--text-2)", borderColor: "var(--border)" }
                          }
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleGenerateVideo}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 whitespace-nowrap hover:opacity-90 transition-all"
                      style={{ background: "#A78BFA", color: "white" }}
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Buat Video
                    </button>
                  </div>
                )}
                {videoError && (
                  <p className="text-[10px] rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.22)" }}>
                    {videoError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Google Calendar (collapsible) */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={collapseHeaderCls}
            style={{ background: "var(--bg-3)" }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: "var(--blue)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>Jadwalkan ke Google Calendar</span>
              {calendarLink && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </div>
            {showCalendar
              ? <ChevronUp className="w-4 h-4" style={{ color: "var(--text-2)" }} />
              : <ChevronDown className="w-4 h-4" style={{ color: "var(--text-2)" }} />
            }
          </button>

          {showCalendar && (
            <div className="p-4" style={{ background: "var(--card-bg)" }}>
              {calendarLink ? (
                <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--green)" }}>
                    <CheckCircle className="w-4 h-4" />
                    Dijadwalkan: {scheduledDate} pukul {scheduledTime}
                  </div>
                  <a href={calendarLink} target="_blank" rel="noopener noreferrer" className="text-xs underline transition-colors" style={{ color: "var(--green)" }}>
                    Buka di Google Calendar →
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] mb-1.5 font-medium" style={{ color: "var(--text-2)" }}>Tanggal</p>
                      <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <p className="text-[10px] mb-1.5 font-medium" style={{ color: "var(--text-2)" }}>Pukul</p>
                      <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <button
                    onClick={handleScheduleEvent}
                    disabled={isScheduling || !accessToken}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ background: "var(--blue)", color: "white" }}
                  >
                    {isScheduling ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menjadwalkan...</>
                    ) : (
                      <><Calendar className="w-3.5 h-3.5" /> Jadwalkan ke Calendar</>
                    )}
                  </button>
                  {!accessToken && (
                    <p className="text-[10px] text-center" style={{ color: "var(--gold)" }}>
                      Koneksi Google diperlukan. Masuk ulang.
                    </p>
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
