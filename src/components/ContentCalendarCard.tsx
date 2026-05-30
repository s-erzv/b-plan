import React, { useState } from "react";
import { ContentDay, SavedCalendar } from "../types";
import { Copy, Check, Calendar, Clock, Sparkles, CheckCircle, Video, Film, Download, RefreshCw, PlayCircle, ImageIcon } from "lucide-react";

interface ContentCalendarCardProps {
  dayInfo: ContentDay;
  productName: string;
  accessToken: string | null;
  onAlert: (msg: string, type: "success" | "error" | "info") => void;
}

export const ContentCalendarCard: React.FC<ContentCalendarCardProps> = ({
  dayInfo,
  productName,
  accessToken,
  onAlert
}) => {
  const { day, theme, visual_concept, caption, hashtags } = dayInfo;
  
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("10:00");
  const [scheduledDate, setScheduledDate] = useState(() => {
    // Current date plus 'day' offset
    const date = new Date();
    date.setDate(date.getDate() + day);
    return date.toISOString().split("T")[0];
  });
  
  const [calendarLink, setCalendarLink] = useState<string | null>(null);

  // Veo video generation states
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<string>("");

  // Nano Banana image generation states
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<"1:1" | "9:16" | "16:9" | "4:3">("1:1");
  const [imageError, setImageError] = useState<string | null>(null);

  // Copy caption to clipboard helper
  const handleCopyCaption = () => {
    const textToCopy = `${caption}\n\n${hashtags.join(" ")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCaption(true);
    onAlert(`Kop teks untuk Hari ${day} berhasil disalin!`, "success");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    setImageUrl(null);

    try {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          visualConcept: visual_concept,
          productName,
          aspectRatio: imageAspectRatio
        })
      });

      const body = await resp.json();
      if (!resp.ok) {
        throw new Error(body.error || "Gagal membuat gambar promosi.");
      }

      setImageUrl(body.imageUrl);
      setIsGeneratingImage(false);
      onAlert(`Gambar promosi Hari ${day} selesai dikonsep menggunakan Nano Banana!`, "success");
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || "Terdapat kendala transmisi.");
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          visualConcept: visual_concept,
          productName,
          aspectRatio
        })
      });

      const body = await resp.json();
      if (!resp.ok) {
        throw new Error(body.error || "Gagal memulai pembuatan video.");
      }

      const { operationName } = body;
      setVideoProgress("AI sedang melukis & merender video promosi...");

      // Poll check status
      const pollInterval = setInterval(async () => {
        try {
          const statusResp = await fetch("/api/video-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ operationName })
          });

          const statusBody = await statusResp.json();
          if (!statusResp.ok) {
            throw new Error(statusBody.error || "Gagal memperbarui status rendering.");
          }

          if (statusBody.done) {
            clearInterval(pollInterval);
            const downloadUrl = `/api/video-download?operationName=${encodeURIComponent(operationName)}`;
            setVideoUrl(downloadUrl);
            setIsGeneratingVideo(false);
            onAlert(`Yey! Video promosi Hari ${day} selesai dikonsep!`, "success");
          } else {
            // Update UI indicating it is still rendering
            setVideoProgress("Model Veo sedang merancang transisi & detail video...");
          }
        } catch (err: any) {
          console.error("Polling error:", err);
          clearInterval(pollInterval);
          setVideoError(err.message || String(err));
          setIsGeneratingVideo(false);
        }
      }, 7000);

    } catch (err: any) {
      console.error(err);
      setVideoError(err.message || "Terdapat kendala transmisi.");
      setIsGeneratingVideo(false);
    }
  };

  // Schedule to Google Calendar (mutating)
  const handleScheduleEvent = async () => {
    if (!accessToken) {
      onAlert("Koneksi Google telah kedaluwarsa. Silakan masuk kembali.", "error");
      return;
    }

    // Step 3 Confirmation Dialog mandate:
    const confirmMsg = `Yakin ingin menjadwalkan konten Hari ${day} ("${theme}") ke Google Calendar Anda pada tanggal ${scheduledDate} pukul ${scheduledTime}?`;
    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

    setIsScheduling(true);

    try {
      const startDateTimeStr = `${scheduledDate}T${scheduledTime}:00`;
      const startSecs = new Date(startDateTimeStr).getTime();
      
      if (isNaN(startSecs)) {
        throw new Error("Format tanggal atau waktu tidak valid.");
      }

      const endSecs = startSecs + 30 * 60 * 1000; // 30 minutes duration
      const endDateTimeStr = new Date(endSecs).toISOString();
      const startDateTimeISO = new Date(startSecs).toISOString();

      const eventPayload = {
        summary: `[Medsos UMKM] ${productName} - Hari ${day}: ${theme}`,
        description: `📅 PERENCANA KONTEN MEDIA SOSIAL\n\n📌 **Tema:** ${theme}\n\n🎬 **Konsep Visual:**\n${visual_concept}\n\n✍️ **Caption:**\n${caption}\n\n🏷️ **Hashtags:**\n${hashtags.join(" ")}`,
        start: {
          dateTime: startDateTimeISO,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta"
        },
        end: {
          dateTime: endDateTimeStr,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta"
        },
        colorId: "5", // Yellow/Gold calendar event color for Social Media
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 30 }
          ]
        }
      };

      const url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Gagal membuat agenda di Google Calendar.");
      }

      const result = await response.json();
      setCalendarLink(result.htmlLink || "https://calendar.google.com");
      onAlert(`Sukses! Konten Hari ${day} telah dijadwalkan ke Google Calendar Anda!`, "success");
    } catch (error: any) {
      console.error("Calendar scheduling error:", error);
      onAlert(`Gagal menjadwalkan ke Calendar: ${error.message || error}`, "error");
    } finally {
      setIsScheduling(false);
    }
  };

  // Determine badge colors based on theme keywords with bold outlines
  const getThemeBadgeStyle = (themeName: string) => {
    const lowercase = themeName.toLowerCase();
    if (lowercase.includes("edu") || lowercase.includes("tips") || lowercase.includes("manfaat")) {
      return "bg-blue-100 text-blue-800 border-blue-400";
    }
    if (lowercase.includes("promo") || lowercase.includes("sell") || lowercase.includes("diskon") || lowercase.includes("belanja")) {
      return "bg-rose-100 text-rose-800 border-rose-400";
    }
    if (lowercase.includes("behind") || lowercase.includes("proses") || lowercase.includes("dapur") || lowercase.includes("pembuatan")) {
      return "bg-amber-100 text-amber-800 border-amber-400";
    }
    if (lowercase.includes("rekomendasi") || lowercase.includes("testi") || lowercase.includes("review")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-400";
    }
    return "bg-indigo-100 text-indigo-800 border-indigo-400";
  };

  return (
    <div
      id={`content-day-card-${day}`}
      className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Visual Header */}
      <div className="px-6 py-4 bg-slate-50 border-b-2 border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-display font-extrabold text-sm border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {day}
          </span>
          <h3 className="font-display font-extrabold text-gray-900 text-lg">Hari {day}</h3>
        </div>
        <span className={`px-3 py-1 font-sans text-xs font-bold rounded-full border-2 ${getThemeBadgeStyle(theme)}`}>
          {theme}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-5">
        {/* Visual Concept Block */}
        <div>
          <h4 className="flex items-center gap-2 font-display text-xs font-extrabold text-slate-800 tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Ide Visual & Audio
          </h4>
          <div className="p-4 bg-slate-50 rounded-xl text-slate-800 font-sans text-sm leading-relaxed border-2 border-slate-200 italic">
            "{visual_concept}"
          </div>
        </div>

        {/* Veo Video Generator Feature */}
        <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl flex flex-col gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 font-display text-xs font-black text-slate-900 uppercase tracking-wider">
              <Film className="w-4 h-4 text-indigo-650" /> Video Promosi AI (Veo 3.1)
            </h4>
            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-400 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </div>

          {videoUrl ? (
            <div className="flex flex-col gap-2">
              <video
                controls
                referrerPolicy="no-referrer"
                className="w-full aspect-video rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-black"
                src={videoUrl}
              />
              <a
                href={videoUrl}
                download={`UMKM_SocialMedia_Promo_Day_${day}.mp4`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition duration-150"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Video Promosi
              </a>
            </div>
          ) : isGeneratingVideo ? (
            <div className="p-4 bg-indigo-50/50 border-2 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center text-center gap-3">
              <RefreshCw className="w-6 h-6 text-indigo-650 animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-slate-850">Sedang Membuat Video...</p>
                <p className="text-[10px] font-bold text-slate-500 max-w-xs">{videoProgress}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-slate-650 text-left">
                Sulap ide visual menjadi video promosi audio-visual siap tayang menggunakan AI Generatif Veo 3.1 terbaik Google!
              </p>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase">Rasio Aspek</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAspectRatio("9:16")}
                      className={`px-2.5 py-1 text-[10px] font-extrabold border-2 rounded-lg transition-all ${
                        aspectRatio === "9:16"
                          ? "bg-slate-900 text-white border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      9:16
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio("16:9")}
                      className={`px-2.5 py-1 text-[10px] font-extrabold border-2 rounded-lg transition-all ${
                        aspectRatio === "16:9"
                          ? "bg-slate-900 text-white border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      16:9
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] cursor-pointer transition flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" /> Bikin Video
                </button>
              </div>

              {videoError && (
                <div className="p-3 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg text-[10px] text-left font-black">
                  Gagal Memulai: {videoError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nano Banana Image Generator Feature */}
        <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl flex flex-col gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 font-display text-xs font-black text-slate-900 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-emerald-650" /> Gambar Promosi AI (Nano Banana)
            </h4>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border-2 border-emerald-400 px-2 py-0.5 rounded-full">
              Gemini 2.5
            </span>
          </div>

          {imageUrl ? (
            <div className="flex flex-col gap-2">
              <div className="relative border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-slate-100 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={`Promosi Hari ${day}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[320px]"
                />
              </div>
              <a
                href={imageUrl}
                download={`UMKM_SocialMedia_Promo_Day_${day}.png`}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition duration-150 text-center cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Gambar Promosi
              </a>
            </div>
          ) : isGeneratingImage ? (
            <div className="p-4 bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center text-center gap-3">
              <RefreshCw className="w-6 h-6 text-emerald-650 animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-slate-850">Sedang Membuat Gambar...</p>
                <p className="text-[10px] font-bold text-slate-500 max-w-xs">AI Gemini sedang menggambar ide visual terbaik Anda...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-slate-650 text-left">
                Buat desain visual promosi feeds (Facebook/Instagram/TikTok) memukau dalam semenit berbasis ide tulisan Anda!
              </p>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase">Rasio Aspek</span>
                  <div className="flex gap-1.5">
                    {(["1:1", "9:16", "16:9", "4:3"] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`px-2 py-0.5 text-[10px] font-extrabold border-2 rounded-lg transition-all ${
                          imageAspectRatio === ratio
                            ? "bg-slate-900 text-white border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateImage}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PlayCircle className="w-4 h-4" /> Bikin Gambar
                </button>
              </div>

              {imageError && (
                <div className="p-3 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg text-[10px] text-left font-black">
                  Gagal Memulai: {imageError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Caption Block */}
        <div id={`caption-section-day-${day}`} className="relative flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-display text-xs font-extrabold text-slate-800 tracking-wider uppercase">
              Teks Caption & CTA
            </h4>
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-white transition px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Tersalin
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Salin Caption
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-white border-2 border-slate-900 rounded-xl text-gray-800 font-sans text-sm leading-relaxed flex-1 whitespace-pre-line text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {caption}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <h4 className="font-display text-xs font-extrabold text-slate-800 tracking-wider uppercase mb-2">
            Hashtags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-50 text-slate-800 border-2 border-slate-950 rounded-lg text-xs font-bold cursor-pointer hover:bg-indigo-500 hover:text-white transition duration-150"
                onClick={() => {
                  navigator.clipboard.writeText(tag);
                  onAlert(`Salin tagar "${tag}"`, "info");
                }}
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Google Calendar Scheduler Block */}
        <div className="mt-2 pt-5 border-t-2 border-slate-900 flex flex-col gap-3 bg-slate-50/50 -mx-6 -mb-6 p-6">
          <h4 className="flex items-center gap-2 font-display text-xs font-extrabold text-gray-900 uppercase">
            <Calendar className="w-4 h-4 text-slate-900" /> Penjadwalan Google Calendar
          </h4>
          
          {calendarLink ? (
            <div className="p-4 bg-emerald-50 text-emerald-900 border-2 border-emerald-500 rounded-xl flex flex-col gap-2 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                <span>Terjadwal pada {scheduledDate} pukul {scheduledTime}!</span>
              </div>
              <a
                href={calendarLink}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-xs font-extrabold text-emerald-800 underline hover:text-emerald-950 transition-all text-left"
              >
                Buka Acara di Kalender Anda &rarr;
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider text-left">Tanggal</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs text-gray-800 font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider text-left">Waktu Post</span>
                  <div className="relative">
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs text-gray-800 font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleScheduleEvent}
                disabled={isScheduling || !accessToken}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white hover:bg-slate-850 active:bg-slate-900 rounded-xl text-xs font-extrabold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] cursor-pointer transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScheduling ? "Menyimpan ke Kalender..." : "Jadwalkan Postingan ke Google Calendar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
