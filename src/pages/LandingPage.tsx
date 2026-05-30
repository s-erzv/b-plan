import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Sparkles, Calendar, Image, Video, BookMarked, ArrowRight,
  Zap, CheckCircle, TrendingUp, Users, Clock, Star,
  Instagram, Play
} from "lucide-react";

/* ── Bento card ─────────────────────────────────────────── */
const BentoCard: React.FC<{
  className?: string;
  children: React.ReactNode;
  accent?: "violet" | "green" | "amber" | "dark";
}> = ({ className = "", children, accent = "dark" }) => {
  const accentMap = {
    violet: "bg-violet-700/20 border-violet-500/20",
    green: "bg-[#00E87A]/10 border-[#00E87A]/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    dark: "bg-[#0E0E1A] border-white/[0.07]",
  };
  return (
    <div className={`rounded-2xl border p-6 overflow-hidden relative ${accentMap[accent]} ${className}`}>
      {children}
    </div>
  );
};

/* ── Step badge ─────────────────────────────────────────── */
const StepBadge: React.FC<{ n: number }> = ({ n }) => (
  <span className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-display font-black text-violet-300 text-base flex-shrink-0">
    {n}
  </span>
);

/* ── Testimonial ─────────────────────────────────────────── */
const Testimonial: React.FC<{
  quote: string;
  name: string;
  role: string;
  initial: string;
  color: string;
}> = ({ quote, name, role, initial, color }) => (
  <div className="card-dark rounded-2xl p-6 flex flex-col gap-4">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-[#A0A0C0] text-sm leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm text-white ${color}`}>
        {initial}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{name}</p>
        <p className="text-[#6B6B8A] text-xs">{role}</p>
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    el.addEventListener("mousemove", handleMouse);
    return () => el.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="min-h-screen bg-[#06060C] text-[#F0F0F8] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 60% 50% at var(--mx, 50%) var(--my, 40%), rgba(124,58,237,0.18) 0%, transparent 70%), #06060C`,
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-700/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#00E87A]/8 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 tag tag-violet mb-8 animate-[fade-up_0.6s_ease_forwards]">
            <Zap className="w-3 h-3 fill-current" />
            AI Content Planner untuk UMKM Indonesia
          </div>

          {/* Headline */}
          <h1
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6"
            style={{ animationDelay: "100ms" }}
          >
            <span className="block text-white">Konten Sosmed</span>
            <span className="block text-white">UMKM Kamu,</span>
            <span className="block text-gradient-green">Jalan Sendiri.</span>
          </h1>

          {/* Sub */}
          <p className="text-[#6B6B8A] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            B-Plan generate kalender konten 7 hari — lengkap caption Bahasa Indonesia, hashtag trending, visual AI, dan langsung sync ke Google Calendar kamu. Sekali klik.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/masuk"
              className="group flex items-center gap-2 px-7 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-base transition-all hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5"
            >
              Buat Kalender Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#cara-kerja"
              className="flex items-center gap-2 px-6 py-4 rounded-xl border border-white/[0.1] text-[#A0A0C0] hover:text-white hover:border-white/20 font-semibold text-base transition-all"
            >
              <Play className="w-4 h-4" />
              Lihat Cara Kerja
            </a>
          </div>

          {/* Social Proof bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { n: "500+", label: "UMKM Aktif" },
              { n: "7.000+", label: "Konten Dibuat" },
              { n: "4.9/5", label: "Rating Pengguna" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-black text-2xl text-white">{s.n}</p>
                <p className="text-xs text-[#6B6B8A] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating preview cards */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-4">
          <div className="relative flex items-center justify-center">
            {/* Center card */}
            <div className="card-dark rounded-2xl p-5 w-72 shadow-2xl shadow-black/60 z-20 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#00E87A]" />
                <span className="text-xs text-[#6B6B8A] font-medium">Hari 1 — Edukasi</span>
              </div>
              <p className="text-white text-xs leading-relaxed font-medium">
                "Tau gak sih kenapa kopi robusta Gayo lebih nikmat pas pagi hari? ☕ Kandungan kafeinnya..."
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {["#kopigayo", "#umkmkopi", "#kopilokal"].map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-900/40 text-violet-300 font-medium">{t}</span>
                ))}
              </div>
            </div>

            {/* Left card (blur/behind) */}
            <div className="absolute -left-4 sm:left-8 top-4 card-dark rounded-2xl p-4 w-52 opacity-50 scale-90 border border-white/[0.06] z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-[#6B6B8A]">Hari 2 — Promo</span>
              </div>
              <p className="text-white text-[11px] leading-relaxed">
                "Flash sale hari ini! Beli 2 gratis 1 sampai jam 21.00 🔥"
              </p>
            </div>

            {/* Right card (blur/behind) */}
            <div className="absolute -right-4 sm:right-8 top-4 card-dark rounded-2xl p-4 w-52 opacity-50 scale-90 border border-white/[0.06] z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs text-[#6B6B8A]">Hari 3 — BTS</span>
              </div>
              <p className="text-white text-[11px] leading-relaxed">
                "Intip dapur produksi kami yuk! 👀 Setiap produk dibuat dengan..."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-[#0E0E1A]/60 py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Users className="w-5 h-5" />, value: "64M+", label: "UMKM di Indonesia" },
              { icon: <Calendar className="w-5 h-5" />, value: "7 Hari", label: "Konten Auto per Minggu" },
              { icon: <TrendingUp className="w-5 h-5" />, value: "4 Platform", label: "IG, TikTok, FB, Twitter" },
              { icon: <Clock className="w-5 h-5" />, value: "<60 Detik", label: "Waktu Generate Konten" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="text-violet-400">{s.icon}</div>
                <p className="font-display font-black text-3xl text-white">{s.value}</p>
                <p className="text-sm text-[#6B6B8A]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ─────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag tag-amber mb-6 inline-flex">Masalah UMKM Hari Ini</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-6">
                Habis waktu buat konten,<br />
                <span className="text-gradient-violet">bukan untuk jualan.</span>
              </h2>
              <p className="text-[#6B6B8A] text-lg leading-relaxed">
                Pemilik UMKM rata-rata menghabiskan 2–3 jam per hari hanya untuk memikirkan caption dan konten sosmed. Waktu yang seharusnya bisa dipakai untuk fokus pada produk dan pelanggan.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { emoji: "😓", text: "Bingung mau posting apa setiap hari" },
                { emoji: "⏰", text: "Buang waktu nulis caption dari nol" },
                { emoji: "📉", text: "Engagement rendah karena konten tidak konsisten" },
                { emoji: "💸", text: "Mahal hire tim konten atau social media manager" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 card-dark rounded-xl p-4 border border-white/[0.07]">
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="text-[#A0A0C0] text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ───────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#0A0A14]/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-violet mb-5 inline-flex">Fitur Unggulan</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight">
              Semua yang kamu butuhkan,<br />
              <span className="text-gradient-green">sudah ada di sini.</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Big card: AI Content */}
            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-violet-700/25 to-violet-900/10 border border-violet-500/20 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-500/30 flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6 text-violet-300" />
                </div>
                <h3 className="font-display font-black text-2xl text-white mb-3">
                  AI Content Calendar Generator
                </h3>
                <p className="text-[#8B8BAA] text-base leading-relaxed mb-6 max-w-lg">
                  Isi profil produk UMKM kamu sekali, Gemini AI langsung buatkan 7 hari konten lengkap — tema, caption Bahasa Indonesia, dan hashtag trending yang relevan.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Caption BI", "7 Hari Konten", "Hashtag Lokal", "Tone Kustom", "Kategori Bisnis"].map(f => (
                    <span key={f} className="flex items-center gap-1.5 text-xs font-semibold text-violet-300 bg-violet-900/30 border border-violet-700/30 px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />{f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Gen */}
            <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#00E87A]/15 border border-[#00E87A]/20 flex items-center justify-center mb-4">
                  <Image className="w-6 h-6 text-[#00E87A]" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Generate Gambar Promosi AI
                </h3>
                <p className="text-[#6B6B8A] text-sm leading-relaxed">
                  Gemini 2.5 sulap ide visual jadi gambar promosi siap pakai untuk feed Instagram & TikTok dalam hitungan detik.
                </p>
                <div className="mt-4 rounded-xl border border-white/[0.06] overflow-hidden bg-[#161625] aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#00E87A]/10 flex items-center justify-center mx-auto mb-2">
                      <Image className="w-5 h-5 text-[#00E87A]" />
                    </div>
                    <p className="text-[10px] text-[#6B6B8A]">Gemini Imagen 2.5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Gen */}
            <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Video Reels AI (Veo 3.1)
                </h3>
                <p className="text-[#6B6B8A] text-sm leading-relaxed">
                  Buat video promosi audio-visual untuk Reels & TikTok menggunakan teknologi Veo 3.1 terbaru Google — tanpa perlu kamera.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 tag tag-amber">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Beta
                </div>
              </div>
            </div>

            {/* Calendar Sync */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/15 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/25 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Sync Google Calendar
                </h3>
                <p className="text-[#6B6B8A] text-sm leading-relaxed">
                  Jadwalkan setiap postingan langsung ke Google Calendar kamu. Ada reminder otomatis 30 menit sebelum waktu upload.
                </p>
              </div>
            </div>

            {/* Archive */}
            <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-4">
                <BookMarked className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Arsip & Manajemen Konten
              </h3>
              <p className="text-[#6B6B8A] text-sm leading-relaxed">
                Simpan semua rencana konten ke arsip. Load ulang kapan saja untuk referensi atau generate ulang dengan profil yang sama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="cara-kerja" className="py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-green mb-5 inline-flex">Cara Kerja</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight">
              3 langkah, konten<br />
              <span className="text-gradient-violet">selesai seminggu.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 relative">
            {/* Connecting line */}
            <div className="absolute left-[17px] top-16 bottom-16 w-px bg-gradient-to-b from-violet-600 via-violet-600/30 to-transparent hidden sm:block" />

            {[
              {
                n: 1,
                title: "Isi Profil Produk UMKM Kamu",
                desc: "Masukkan nama produk, target audiens, kategori bisnis, dan gaya komunikasi yang kamu inginkan. Proses ini cuma butuh 2 menit.",
                tag: "Setup Sekali",
                tagStyle: "tag-violet",
              },
              {
                n: 2,
                title: "AI Generate Kalender 7 Hari",
                desc: "Gemini AI akan menganalisis profil produkmu dan merancang 7 tema konten yang relevan — lengkap dengan caption siap-posting, hashtag trending lokal, dan konsep visual.",
                tag: "< 60 Detik",
                tagStyle: "tag-green",
              },
              {
                n: 3,
                title: "Generate Visual, Jadwalkan & Posting",
                desc: "Buat gambar atau video promosi AI, lalu jadwalkan langsung ke Google Calendar kamu. Kamu tinggal terima reminder dan posting.",
                tag: "Otomatis",
                tagStyle: "tag-amber",
              },
            ].map((step, idx) => (
              <div key={step.n} className="flex gap-6 items-start">
                <StepBadge n={step.n} />
                <div className="card-dark rounded-2xl p-6 flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display font-bold text-xl text-white leading-tight">{step.title}</h3>
                    <span className={`tag ${step.tagStyle} whitespace-nowrap flex-shrink-0`}>{step.tag}</span>
                  </div>
                  <p className="text-[#6B6B8A] text-base leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#0A0A14]/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="tag tag-violet mb-5 inline-flex">Testimoni</span>
            <h2 className="font-display font-black text-4xl text-white">
              UMKM berbicara.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Testimonial
              quote="Sebelum pakai B-Plan, saya bisa berjam-jam cuma buat mikirin caption. Sekarang tinggal klik, langsung jadi 7 hari konten yang relevan banget sama produk saya!"
              name="Rina Kusuma"
              role="Owner, Rein Skincare Jakarta"
              initial="R"
              color="bg-violet-600"
            />
            <Testimonial
              quote="Hashtag-nya niche banget, engagement Instagram saya naik 40% dalam 2 minggu pertama. Fitur sync Google Calendar juga bikin saya nggak pernah lupa posting lagi."
              name="Budi Santoso"
              role="Pemilik, Warung Kopi Nusantara"
              initial="B"
              color="bg-emerald-600"
            />
            <Testimonial
              quote="Awalnya skeptis, tapi caption yang di-generate ternyata natural banget bahasa Indonesianya, nggak kaku kayak terjemahan. Cocok banget buat UMKM fashion kayak saya."
              name="Sari Dewi"
              role="Founder, Batik Sari Collection"
              initial="S"
              color="bg-amber-600"
            />
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-700 to-violet-900 p-12 sm:p-16 text-center">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#00E87A]/10 blur-2xl" />

            <div className="relative z-10">
              <span className="tag tag-green mb-6 inline-flex">Gratis, Tanpa Kartu Kredit</span>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">
                Mulai sekarang.<br />Konten jalan, bisnis tumbuh.
              </h2>
              <p className="text-violet-200 text-lg mb-10 max-w-lg mx-auto">
                Bergabung bersama ratusan UMKM Indonesia yang sudah menyederhanakan strategi konten mereka bersama B-Plan.
              </p>
              <Link
                to="/masuk"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-violet-700 font-display font-black text-base hover:bg-violet-50 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
              >
                <Zap className="w-5 h-5 fill-current" />
                Mulai Gratis — Pakai Google
              </Link>
              <p className="text-violet-300 text-xs mt-4">Cukup dengan akun Google kamu. Tidak perlu daftar manual.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
