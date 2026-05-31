import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  saveBusinessProfile, loadBusinessProfiles, saveCalendar,
  loadSavedCalendars, deleteCalendarProfile,
} from "../firebase";
import { BusinessProfile, ContentDay, SavedCalendar } from "../types";
import { ContentCalendarCard } from "../components/ContentCalendarCard";
import { SavedPlannerList } from "../components/SavedPlannerList";
import {
  Sparkles, Calendar, Bookmark, LogOut, RefreshCw, ArrowRight,
  Zap, Briefcase, ChevronDown, ChevronUp,
  LayoutGrid, Archive, Plus, CheckCircle, AlertCircle, Info, X,
  CalendarPlus, Sun, Moon,
} from "lucide-react";
import { Link } from "react-router-dom";

const LOADING_MESSAGES = [
  "Menganalisis profil produk Anda...",
  "Memilah demografi target audiens...",
  "Memformulasi hook promosi interaktif...",
  "Merancang ide visual Instagram & TikTok...",
  "Menambahkan tagar trending lokal Indonesia...",
  "Menyusun tata bahasa caption terbaik...",
  "Menyelesaikan draf kalender konten 7 hari...",
];

interface DashboardPageProps {
  user: User;
  accessToken: string | null;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, accessToken, onLogout }) => {
  const [productName, setProductName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Food & Beverage");
  const [tone, setTone] = useState("Casual & Akrab");
  const [usp, setUsp] = useState("");
  const [specialOffer, setSpecialOffer] = useState("");
  const [keywords, setKeywords] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [generatedCalendar, setGeneratedCalendar] = useState<ContentDay[] | null>(null);
  const [savedCalendars, setSavedCalendars] = useState<SavedCalendar[]>([]);
  const [activeTab, setActiveTab] = useState<"buat" | "arsip">("buat");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isBulkScheduling, setIsBulkScheduling] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bp-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bp-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const triggerToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => { fetchUserData(); }, []);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIndex((p) => (p + 1) % LOADING_MESSAGES.length);
      }, 3500);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const fetchUserData = async () => {
    try {
      const [plans, profiles] = await Promise.all([loadSavedCalendars(), loadBusinessProfiles()]);
      setSavedCalendars(plans);
      if (profiles.length > 0) {
        const p = profiles[0];
        setProductName(p.productName || "");
        setTargetAudience(p.targetAudience || "");
        if (p.businessCategory) setBusinessCategory(p.businessCategory);
        if (p.tone) setTone(p.tone);
        setUsp(p.usp || "");
        setSpecialOffer(p.specialOffer || "");
        setKeywords(p.keywords || "");
      }
    } catch (err) {
      console.error("Gagal load data:", err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !targetAudience.trim()) {
      setErrorText("Nama Produk dan Target Audiens wajib diisi.");
      return;
    }
    setIsGenerating(true);
    setErrorText(null);
    setGeneratedCalendar(null);

    try {
      await saveBusinessProfile({
        id: "active_profile",
        productName: productName.trim(),
        targetAudience: targetAudience.trim(),
        businessCategory,
        tone,
        usp: usp.trim(),
        specialOffer: specialOffer.trim(),
        keywords: keywords.trim(),
      });
    } catch {}

    try {
      const res = await fetch("/api/generate-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, targetAudience, businessCategory, tone, usp, specialOffer, keywords }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal membuat rencana konten.");
      if (result.success && Array.isArray(result.data)) {
        setGeneratedCalendar(result.data);
        triggerToast("Kalender konten 7 hari berhasil dibuat!", "success");
        setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
      } else {
        throw new Error("Format respons tidak valid.");
      }
    } catch (err: any) {
      setErrorText(err.message || "Terdapat kendala jaringan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedCalendar) return;
    try {
      await saveCalendar({
        id: "calendar_" + Date.now(),
        productName: productName.trim(),
        targetAudience: targetAudience.trim(),
        businessCategory,
        tone,
        usp: usp.trim(),
        specialOffer: specialOffer.trim(),
        keywords: keywords.trim(),
        items: generatedCalendar,
      });
      triggerToast("Kalender berhasil disimpan ke Arsip!", "success");
      fetchUserData();
    } catch {
      triggerToast("Gagal menyimpan kalender.", "error");
    }
  };

  const handleAddAllToCalendar = async () => {
    if (!accessToken || !generatedCalendar) return;
    const confirmed = window.confirm(
      `Jadwalkan semua 7 hari konten "${productName}" ke Google Calendar?\n\nEvent akan dijadwalkan mulai besok pukul 09.00 WIB, satu hari per posting.`
    );
    if (!confirmed) return;

    setIsBulkScheduling(true);
    let successCount = 0;
    let errorCount = 0;

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);
    baseDate.setHours(0, 0, 0, 0);

    for (const dayItem of generatedCalendar) {
      try {
        const postDate = new Date(baseDate);
        postDate.setDate(baseDate.getDate() + (dayItem.day - 1));
        const dateStr = postDate.toISOString().split("T")[0];

        const startMs = new Date(`${dateStr}T09:00:00`).getTime();
        const endMs = startMs + 30 * 60 * 1000;

        const eventPayload = {
          summary: `[B-Plan] ${productName} — Hari ${dayItem.day}: ${dayItem.theme}`,
          description: `📅 B-Plan Social Media Planner\n\n📌 Tema: ${dayItem.theme}\n\n🎬 Konsep Visual:\n${dayItem.visual_concept}\n\n✍️ Caption:\n${dayItem.caption}\n\n🏷️ Hashtags:\n${dayItem.hashtags.join(" ")}`,
          start: {
            dateTime: new Date(startMs).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
          },
          end: {
            dateTime: new Date(endMs).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
          },
          colorId: "5",
          reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
        };

        const r = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventPayload),
          }
        );

        if (r.ok) successCount++;
        else errorCount++;
      } catch {
        errorCount++;
      }
    }

    setIsBulkScheduling(false);

    if (errorCount === 0) {
      triggerToast(`Semua ${successCount} hari konten berhasil dijadwalkan ke Google Calendar! 🎉`, "success");
    } else if (successCount > 0) {
      triggerToast(`${successCount} berhasil, ${errorCount} gagal. Cek koneksi Google kamu.`, "info");
    } else {
      triggerToast("Gagal menjadwalkan. Coba masuk ulang ke akun Google.", "error");
    }
  };

  const handleSelectHistory = (sel: SavedCalendar) => {
    setProductName(sel.productName);
    setTargetAudience(sel.targetAudience);
    if (sel.businessCategory) setBusinessCategory(sel.businessCategory);
    if (sel.tone) setTone(sel.tone);
    setUsp(sel.usp || "");
    setSpecialOffer(sel.specialOffer || "");
    setKeywords(sel.keywords || "");
    setGeneratedCalendar(sel.items);
    setActiveTab("buat");
    triggerToast(`Kalender dimuat: ${sel.productName}`, "info");
    setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCalendarProfile(id);
      setSavedCalendars((p) => p.filter((c) => c.id !== id));
      triggerToast("Kalender dihapus.", "success");
    } catch {
      triggerToast("Gagal menghapus kalender.", "error");
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all font-sans"
    + " bg-[var(--bg-3)] border border-[var(--border-2)] text-[var(--text)] placeholder:text-[var(--text-2)]"
    + " focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(245,158,11,0.12)]";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── TOP BAR ──────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 h-16 flex items-center px-5 sm:px-8 backdrop-blur-xl"
        style={{
          background: "var(--bg-nav)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">

          <Link to="/" className="flex items-center">
            <img src="/2.png" alt="B-Plan" className="h-8 w-auto" />
          </Link>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setActiveTab("buat")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={activeTab === "buat" ? {
                background: "var(--gold)", color: "var(--gold-fg)",
              } : {
                color: "var(--text-2)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buat Konten</span>
            </button>
            <button
              onClick={() => setActiveTab("arsip")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={activeTab === "arsip" ? {
                background: "var(--gold)", color: "var(--gold-fg)",
              } : {
                color: "var(--text-2)",
              }}
            >
              <Archive className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Arsip</span>
              {savedCalendars.length > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.3)" }}
                >
                  {savedCalendars.length}
                </span>
              )}
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
              style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-7 h-7 rounded-full ring-1 ring-white/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
                >
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                {user.displayName?.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg transition-all hover:text-red-400 hover:bg-red-500/10"
              style={{ color: "var(--text-2)" }}
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-5 sm:px-8 py-8">

        {activeTab === "buat" ? (
          <div className="flex flex-col gap-8">

            {/* ── FORM AT TOP ────────────────────────────── */}
            <section
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              {/* Panel header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--gold-dim)", border: "1px solid rgba(245,158,11,0.25)" }}
                  >
                    <Briefcase className="w-4 h-4" style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-base" style={{ color: "var(--text)" }}>
                      Profil Produk UMKM
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      Lengkapi profil untuk hasil konten yang optimal
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="p-6">
                {/* Main fields — 3 columns + button */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Nama Produk */}
                  <div className="lg:col-span-1 flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
                      Nama Produk / Merek <span style={{ color: "var(--gold)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Kopi Susu Gula Aren..."
                      className={inputCls}
                    />
                  </div>

                  {/* Kategori */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
                      Kategori Bisnis
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      <option value="Food & Beverage">Makanan & Minuman</option>
                      <option value="Fashion & Apparels">Pakaian & Fashion</option>
                      <option value="Beauty & Personal Care">Kecantikan & Kosmetik</option>
                      <option value="Handicrafts & Home Decor">Kriya & Dekorasi</option>
                      <option value="Services & Consultancy">Jasa & Konsultasi</option>
                      <option value="Other">Lainnya</option>
                    </select>
                  </div>

                  {/* Gaya */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
                      Gaya Komunikasi
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      <option value="Casual & Akrab">Casual & Akrab</option>
                      <option value="Profesional & Terpercaya">Profesional & Informatif</option>
                      <option value="Humoris & Viral">Humoris & Viral</option>
                      <option value="Estetik & Puitis">Estetik & Menginspirasi</option>
                      <option value="Persuasif & Hard Selling">Persuasif & Hard Selling</option>
                    </select>
                  </div>

                  {/* Generate btn */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider opacity-0 select-none">
                      Action
                    </label>
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-white font-display font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                      style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
                    >
                      {isGenerating ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Mengolah...</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Generate 7 Hari</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Target Audiens — full width */}
                <div className="mb-4">
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "var(--text-2)" }}>
                    Target Audiens <span style={{ color: "var(--gold)" }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Contoh: Mahasiswa, pekerja muda 22–30 tahun yang butuh energi harian dan suka kopi premium..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Optional fields toggle */}
                <button
                  type="button"
                  onClick={() => setShowOptional(!showOptional)}
                  className="flex items-center gap-2 text-xs font-semibold transition-colors mb-3"
                  style={{ color: "var(--text-2)" }}
                >
                  {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {showOptional ? "Sembunyikan" : "Tampilkan"} opsional (USP, promo, kata kunci)
                </button>

                {showOptional && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
                        Keunggulan (USP)
                        <span className="ml-1.5 normal-case text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-3)", color: "var(--text-2)" }}>Opsional</span>
                      </label>
                      <input
                        type="text"
                        value={usp}
                        onChange={(e) => setUsp(e.target.value)}
                        placeholder="Organik, Buatan Tangan..."
                        className={inputCls}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
                        Promo Aktif
                        <span className="ml-1.5 normal-case text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-3)", color: "var(--text-2)" }}>Opsional</span>
                      </label>
                      <input
                        type="text"
                        value={specialOffer}
                        onChange={(e) => setSpecialOffer(e.target.value)}
                        placeholder="Beli 2 Gratis 1..."
                        className={inputCls}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-2)" }}>
                        Kata Kunci
                        <span className="ml-1.5 normal-case text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-3)", color: "var(--text-2)" }}>Opsional</span>
                      </label>
                      <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="kopi lokal, anti ngantuk..."
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                {errorText && (
                  <div
                    className="mt-4 flex items-start gap-3 p-4 rounded-xl text-sm"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {errorText}
                  </div>
                )}
              </form>
            </section>

            {/* ── RESULTS BELOW FORM ──────────────────────── */}
            <section id="results-anchor">
              {isGenerating ? (
                <div
                  className="rounded-2xl p-16 flex flex-col items-center justify-center min-h-80 gap-8"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                >
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-full border-2 border-t-violet-500 animate-spin"
                      style={{ borderColor: "var(--border-2)", borderTopColor: "#7C3AED" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-violet-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="font-display font-black text-xl" style={{ color: "var(--text)" }}>
                      AI sedang merancang konten kamu
                    </h3>
                    <p className="text-sm min-h-5 transition-all" style={{ color: "var(--text-2)" }}>
                      {LOADING_MESSAGES[loadingMsgIndex]}
                    </p>
                    <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "var(--text-2)", opacity: 0.6 }}>
                      Gemini AI memformulasi strategi konten berbasis demografi dan profil produkmu...
                    </p>
                  </div>
                </div>
              ) : generatedCalendar ? (
                <div className="flex flex-col gap-5">
                  {/* Results header */}
                  <div
                    className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, var(--card-bg) 100%)",
                      border: "1px solid rgba(124,58,237,0.2)",
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                          Kalender Siap
                        </span>
                      </div>
                      <h3 className="font-display font-black text-xl" style={{ color: "var(--text)" }}>
                        7 Hari Konten: {productName}
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>
                        {businessCategory} • {tone}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Add All to Calendar */}
                      <button
                        onClick={handleAddAllToCalendar}
                        disabled={isBulkScheduling || !accessToken}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-px hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                        style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
                        title={!accessToken ? "Koneksi Google diperlukan" : "Jadwalkan semua 7 hari ke Google Calendar"}
                      >
                        {isBulkScheduling ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> Menjadwalkan...</>
                        ) : (
                          <><CalendarPlus className="w-4 h-4" /> Tambah Semua ke Calendar</>
                        )}
                      </button>

                      {/* Save to Archive */}
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: "var(--bg-3)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-3)")}
                      >
                        <Bookmark className="w-4 h-4" />
                        Simpan ke Arsip
                      </button>
                    </div>
                  </div>

                  {!accessToken && (
                    <div
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.25)",
                        color: "#F59E0B",
                      }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      Koneksi Google kedaluwarsa. Masuk ulang untuk menggunakan fitur Google Calendar.
                    </div>
                  )}

                  {/* 7-day content grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {generatedCalendar.map((day) => (
                      <ContentCalendarCard
                        key={day.day}
                        dayInfo={day}
                        productName={productName}
                        accessToken={accessToken}
                        onAlert={triggerToast}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div
                  className="rounded-2xl p-16 flex flex-col items-center justify-center min-h-80 text-center gap-5"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px dashed var(--border-2)",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--gold-dim)", border: "1px solid rgba(245,158,11,0.25)" }}
                  >
                    <Calendar className="w-7 h-7 text-violet-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl" style={{ color: "var(--text)" }}>
                      Belum ada konten
                    </h3>
                    <p className="text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      Isi profil produk di atas, lalu klik{" "}
                      <span className="font-semibold" style={{ color: "var(--gold)" }}>Generate 7 Hari</span>{" "}
                      untuk memulai.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {["Caption BI", "7 Hari Konten", "Hashtag Lokal", "Konsep Visual"].map((f) => (
                      <span key={f} className="tag tag-gold text-xs">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* ── ARSIP TAB ─────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="mb-6">
                <h2 className="font-display font-black text-2xl mb-1" style={{ color: "var(--text)" }}>
                  Arsip Kalender
                </h2>
                <p className="text-sm" style={{ color: "var(--text-2)" }}>
                  Rencana konten yang pernah kamu buat dan simpan.
                </p>
              </div>
              <SavedPlannerList
                planners={savedCalendars}
                onSelect={handleSelectHistory}
                onDelete={handleDelete}
              />
            </div>

            <div className="lg:col-span-7">
              <div
                className="rounded-2xl p-10 flex flex-col gap-6 h-full justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--gold-dim) 0%, var(--card-bg) 100%)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--gold-dim)", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  <Archive className="w-6 h-6" style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl mb-3" style={{ color: "var(--text)" }}>
                    Cara pakai Arsip
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      "Klik kalender di daftar kiri untuk memuat kembali konten dan profil produknya.",
                      "Kamu bisa copy caption, generate visual AI, atau jadwalkan ulang ke Google Calendar.",
                      "Kalender yang dihapus dari arsip tidak dapat dikembalikan.",
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-2)" }}>
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 font-semibold" style={{ color: "var(--gold)" }}
                          style={{ background: "var(--violet-dim)", border: "1px solid rgba(124,58,237,0.3)" }}
                        >
                          {i + 1}
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("buat")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-display font-bold text-sm transition-all hover:opacity-90 w-fit"
                  style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
                >
                  <Plus className="w-4 h-4" />
                  Buat Kalender Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── TOAST ────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl animate-[fade-up_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-sm backdrop-blur-xl`}
          style={
            toast.type === "success"
              ? { background: "rgba(6,78,59,0.92)", borderColor: "rgba(16,185,129,0.3)", color: "#A7F3D0" }
              : toast.type === "error"
              ? { background: "rgba(69,10,10,0.92)", borderColor: "rgba(239,68,68,0.3)", color: "#FECACA" }
              : { background: "var(--bg-nav)", borderColor: "rgba(124,58,237,0.3)", color: "#C4B5FD" }
          }
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />
          )}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
