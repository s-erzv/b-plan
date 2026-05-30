import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  saveBusinessProfile, loadBusinessProfiles, saveCalendar,
  loadSavedCalendars, deleteCalendarProfile, getCachedAccessToken
} from "../firebase";
import { BusinessProfile, ContentDay, SavedCalendar } from "../types";
import { ContentCalendarCard } from "../components/ContentCalendarCard";
import { SavedPlannerList } from "../components/SavedPlannerList";
import {
  Sparkles, Calendar, Bookmark, LogOut, RefreshCw, ArrowRight,
  Zap, ChevronDown, Briefcase, Users, Tag, Megaphone, Hash,
  LayoutGrid, Archive, Plus, CheckCircle, AlertCircle, Info,
  X
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

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  badge?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, hint, required, badge, children }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-[#A0A0C0] uppercase tracking-wider">{label}</label>
      {required && <span className="text-xs text-violet-400 font-medium">*</span>}
      {badge && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#6B6B8A] border border-white/[0.06]">
          {badge}
        </span>
      )}
    </div>
    {children}
    {hint && <p className="text-[11px] text-[#4a4a65] leading-relaxed">{hint}</p>}
  </div>
);

const inputCls = "w-full px-4 py-3 rounded-xl bg-[#161625] border border-white/[0.08] text-[#F0F0F8] text-sm placeholder:text-[#3a3a55] outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all font-sans";

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [generatedCalendar, setGeneratedCalendar] = useState<ContentDay[] | null>(null);
  const [savedCalendars, setSavedCalendars] = useState<SavedCalendar[]>([]);
  const [activeTab, setActiveTab] = useState<"buat" | "arsip">("buat");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
        setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 100);
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
    setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 100);
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

  return (
    <div className="min-h-screen bg-[#06060C] text-[#F0F0F8] flex flex-col">

      {/* ── TOP BAR ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#06060C]/90 backdrop-blur-xl border-b border-white/[0.06] h-16 flex items-center px-5 sm:px-8">
        <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-black text-lg tracking-tight">
              <span className="text-gradient-violet">B–</span>
              <span className="text-[#F0F0F8]">Plan</span>
            </span>
          </Link>

          {/* Tabs — centered */}
          <div className="flex items-center gap-1 bg-[#0E0E1A] border border-white/[0.07] rounded-xl p-1">
            <button
              onClick={() => setActiveTab("buat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "buat"
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-900/50"
                  : "text-[#6B6B8A] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buat Konten</span>
            </button>
            <button
              onClick={() => setActiveTab("arsip")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "arsip"
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-900/50"
                  : "text-[#6B6B8A] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Arsip</span>
              {savedCalendars.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-900/50 text-violet-300 border border-violet-700/30">
                  {savedCalendars.length}
                </span>
              )}
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full ring-1 ring-white/20" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold text-white">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-sm text-[#A0A0C0] font-medium">{user.displayName?.split(" ")[0]}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-[#6B6B8A] hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-5 sm:px-8 py-8">

        {activeTab === "buat" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── FORM PANEL ─────────────────────────── */}
            <aside className="lg:col-span-4 xl:col-span-4">
              <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] overflow-hidden">
                {/* Panel header */}
                <div className="px-6 py-5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/25 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-violet-300" />
                    </div>
                    <h2 className="font-display font-black text-lg text-white">Profil Produk</h2>
                  </div>
                  <p className="text-xs text-[#6B6B8A] leading-relaxed">
                    Lengkapi info produk untuk kalender konten yang optimal.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleGenerate} className="p-6 flex flex-col gap-5">

                  <FormField label="Nama Produk / Merek" required hint="Contoh: Kopi Susu Gula Aren, Kripik Tempe Renyah">
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Nama produk atau merek usaha..."
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Target Audiens" required hint="Deskripsikan pembeli ideal kamu.">
                    <textarea
                      required
                      rows={3}
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Contoh: Mahasiswa, pekerja muda 22–30 tahun yang butuh energi harian..."
                      className={`${inputCls} resize-none`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 gap-5">
                    <FormField label="Kategori Bisnis">
                      <select
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        className={`${inputCls} appearance-none cursor-pointer`}
                      >
                        <option value="Food & Beverage">🍽️  Makanan & Minuman</option>
                        <option value="Fashion & Apparels">👗  Pakaian & Fashion</option>
                        <option value="Beauty & Personal Care">💄  Kecantikan & Kosmetik</option>
                        <option value="Handicrafts & Home Decor">🏺  Kriya & Dekorasi</option>
                        <option value="Services & Consultancy">💼  Jasa & Konsultasi</option>
                        <option value="Other">✨  Lainnya</option>
                      </select>
                    </FormField>

                    <FormField label="Gaya Komunikasi">
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className={`${inputCls} appearance-none cursor-pointer`}
                      >
                        <option value="Casual & Akrab">😊  Casual & Akrab</option>
                        <option value="Profesional & Terpercaya">🤝  Profesional & Informatif</option>
                        <option value="Humoris & Viral">😂  Humoris & Viral</option>
                        <option value="Estetik & Puitis">🌙  Estetik & Menginspirasi</option>
                        <option value="Persuasif & Hard Selling">🔥  Persuasif & Hard Selling</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/[0.05]" />
                    <span className="text-[11px] text-[#4a4a65] font-medium">Opsional</span>
                    <div className="flex-1 h-px bg-white/[0.05]" />
                  </div>

                  <FormField label="Keunggulan Produk (USP)" badge="Opsional" hint="Apa yang membuat produk kamu unik?">
                    <input
                      type="text"
                      value={usp}
                      onChange={(e) => setUsp(e.target.value)}
                      placeholder="Contoh: Organik, Gratis Ongkir, Buatan Tangan..."
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Promo / Diskon Aktif" badge="Opsional" hint="Kalau ada, AI akan memasukkannya di konten hard-selling.">
                    <input
                      type="text"
                      value={specialOffer}
                      onChange={(e) => setSpecialOffer(e.target.value)}
                      placeholder="Contoh: Beli 2 Gratis 1 s.d. akhir bulan..."
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Kata Kunci Wajib" badge="Opsional" hint="Pisahkan dengan koma.">
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Contoh: kopi lokal, anti ngantuk, booster pagi..."
                      className={inputCls}
                    />
                  </FormField>

                  {errorText && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-900/20 border border-red-500/25 text-red-300 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {errorText}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold text-sm transition-all hover:shadow-lg hover:shadow-violet-900/40 hover:-translate-y-px"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sedang Mengolah...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Kalender 7 Hari
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </aside>

            {/* ── RESULTS PANEL ──────────────────────── */}
            <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6">

              {isGenerating ? (
                /* Loading state */
                <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] p-16 flex flex-col items-center justify-center min-h-[480px] gap-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-violet-900 border-t-violet-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-violet-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="font-display font-black text-xl text-white">
                      AI sedang merancang konten kamu
                    </h3>
                    <p className="text-[#6B6B8A] text-sm min-h-[20px] transition-all">
                      {LOADING_MESSAGES[loadingMsgIndex]}
                    </p>
                    <p className="text-xs text-[#4a4a65] max-w-xs mx-auto leading-relaxed">
                      Gemini AI memformulasi strategi konten berbasis demografi dan profil produkmu...
                    </p>
                  </div>
                </div>
              ) : generatedCalendar ? (
                /* Results */
                <div id="results-anchor" className="flex flex-col gap-5">
                  {/* Result header */}
                  <div className="rounded-2xl bg-gradient-to-r from-violet-900/40 to-[#0E0E1A] border border-violet-500/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-[#00E87A] animate-pulse" />
                        <span className="text-xs text-[#00E87A] font-semibold uppercase tracking-wider">Kalender Siap</span>
                      </div>
                      <h3 className="font-display font-black text-xl text-white">
                        7 Hari Konten: {productName}
                      </h3>
                      <p className="text-sm text-[#6B6B8A] mt-1">
                        {businessCategory} • {tone}
                      </p>
                    </div>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-sm font-semibold transition-all whitespace-nowrap"
                    >
                      <Bookmark className="w-4 h-4" />
                      Simpan ke Arsip
                    </button>
                  </div>

                  {/* Content grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                <div className="rounded-2xl bg-[#0E0E1A] border border-dashed border-white/[0.1] p-16 flex flex-col items-center justify-center min-h-[480px] text-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-violet-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-white">Belum ada konten</h3>
                    <p className="text-[#6B6B8A] text-sm max-w-sm leading-relaxed">
                      Isi profil produk di panel kiri, lalu klik{" "}
                      <span className="text-violet-400 font-semibold">Generate Kalender 7 Hari</span>{" "}
                      untuk memulai.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {["Caption BI", "7 Hari Konten", "Hashtag Lokal", "Konsep Visual"].map((f) => (
                      <span key={f} className="tag tag-violet text-xs">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── ARSIP TAB ─────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="mb-6">
                <h2 className="font-display font-black text-2xl text-white mb-1">Arsip Kalender</h2>
                <p className="text-sm text-[#6B6B8A]">Rencana konten yang pernah kamu buat dan simpan.</p>
              </div>
              <SavedPlannerList
                planners={savedCalendars}
                onSelect={handleSelectHistory}
                onDelete={handleDelete}
              />
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-gradient-to-br from-violet-900/20 to-[#0E0E1A] border border-violet-500/15 p-10 flex flex-col gap-6 h-full justify-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/25 flex items-center justify-center">
                  <Archive className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2">Cara pakai Arsip</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      "Klik kalender di daftar kiri untuk melihat detail & memuat kembali kontennya.",
                      "Kamu bisa lihat caption lengkap, copy teks, generate ulang visual AI, atau jadwalkan ulang ke Google Calendar.",
                      "Kalender yang dihapus dari arsip tidak dapat dikembalikan.",
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-[#6B6B8A]">
                        <span className="w-5 h-5 rounded-full bg-violet-900/40 border border-violet-700/30 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("buat")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-sm transition-all w-fit"
                >
                  <Plus className="w-4 h-4" />
                  Buat Kalender Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── TOAST ──────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl animate-[slide-in_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
              : toast.type === "error"
              ? "bg-red-950/90 border-red-500/30 text-red-200"
              : "bg-[#0E0E1A]/95 border-violet-500/30 text-violet-200"
          } backdrop-blur-xl`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-violet-400 flex-shrink-0" />
          )}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
