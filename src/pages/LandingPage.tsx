import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Sparkles, Calendar, Image, Video, BookMarked, ArrowRight,
  Zap, CheckCircle, TrendingUp, Users, Clock, Star, Play,
} from "lucide-react";

/* ── Testimonial ─────────────────────────────────────── */
const Testimonial: React.FC<{
  quote: string; name: string; role: string; initial: string; color: string;
}> = ({ quote, name, role, initial, color }) => (
  <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>"{quote}"</p>
    <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm text-white ${color}`}>
        {initial}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{name}</p>
        <p className="text-xs" style={{ color: "var(--text-2)" }}>{role}</p>
      </div>
    </div>
  </div>
);

/* ── Section label ───────────────────────────────────── */
const SectionLabel: React.FC<{ n: string }> = ({ n }) => (
  <span
    className="font-display font-black text-xs tracking-[0.22em] uppercase mb-5 block"
    style={{ color: "var(--lime)" }}
  >
    — {n}
  </span>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-28 pb-16 overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Orb */}
        <div
          className="absolute top-1/3 right-1/4 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.11) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,255,71,0.06) 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-center min-h-[calc(100vh-8rem)]">

            {/* Left */}
            <div className="flex flex-col justify-center">
              <div className="tag tag-lime mb-8 w-fit animate-[fade-up_0.6s_ease_forwards]">
                <Zap className="w-3 h-3" />
                AI Content Planner untuk UMKM Indonesia
              </div>

              <h1 className="font-display font-black leading-[0.90] tracking-tight mb-7 animate-[fade-up_0.7s_ease_forwards]">
                <span className="block" style={{ fontSize: "clamp(52px,7.5vw,104px)", color: "var(--text)" }}>
                  Konten
                </span>
                <span className="block" style={{ fontSize: "clamp(52px,7.5vw,104px)", color: "var(--text)" }}>
                  UMKM Kamu,
                </span>
                <span className="block" style={{ fontSize: "clamp(52px,7.5vw,104px)", color: "var(--lime)" }}>
                  Jalan Sendiri.
                </span>
              </h1>

              <p
                className="text-lg sm:text-xl max-w-xl leading-relaxed mb-10"
                style={{ color: "var(--text-2)" }}
              >
                B-Plan generate kalender konten 7 hari — lengkap caption Bahasa Indonesia,
                hashtag trending, visual AI, dan sync ke Google Calendar. Sekali klik.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/masuk"
                  className="group flex items-center gap-2 px-7 py-4 rounded-xl text-white font-display font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: "var(--violet)", boxShadow: "0 4px 24px rgba(124,58,237,0.28)" }}
                >
                  Buat Kalender Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#cara-kerja"
                  className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all"
                  style={{ color: "var(--text-2)", border: "1px solid var(--border-2)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-3)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Play className="w-4 h-4" />
                  Lihat Cara Kerja
                </a>
              </div>

              {/* Micro stats */}
              <div className="flex flex-wrap gap-10">
                {[
                  { n: "500+", label: "UMKM Aktif" },
                  { n: "7.000+", label: "Konten Dibuat" },
                  { n: "4.9 / 5", label: "Rating Pengguna" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-black text-2xl" style={{ color: "var(--text)" }}>{s.n}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating preview */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="animate-[float_5s_ease-in-out_infinite] relative">
                {/* Main card */}
                <div
                  className="rounded-2xl p-5 w-80 shadow-2xl"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border-2)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--lime)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                      Hari 1 — Edukasi
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed font-medium mb-4" style={{ color: "var(--text)" }}>
                    "Tau gak sih kenapa kopi robusta Gayo lebih nikmat pas pagi hari? ☕ Kandungan kafeinnya..."
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["#kopigayo", "#umkmkopi", "#kopilokal"].map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--violet-dim)", color: "#A78BFA" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    className="mt-4 pt-4 flex items-center justify-between"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" style={{ color: "var(--lime)" }} />
                      <span className="text-xs" style={{ color: "var(--text-2)" }}>Senin, 09.00 WIB</span>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "var(--lime)", color: "var(--lime-fg)" }}
                    >
                      Terjadwal ✓
                    </span>
                  </div>
                </div>

                {/* Satellite top-right */}
                <div
                  className="absolute -top-8 -right-14 rounded-xl p-3 w-44 shadow-lg opacity-75"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px]" style={{ color: "var(--text-2)" }}>Hari 2 — Promo</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text)" }}>
                    "Flash sale hari ini! Beli 2 gratis 1 🔥"
                  </p>
                </div>

                {/* Satellite bottom-left */}
                <div
                  className="absolute -bottom-10 -left-14 rounded-xl p-3 w-44 shadow-lg opacity-75"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-[10px]" style={{ color: "var(--text-2)" }}>Hari 3 — BTS</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text)" }}>
                    "Intip dapur produksi kami yuk! 👀"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: <Users className="w-4 h-4" />, value: "64M+", label: "UMKM di Indonesia" },
              { icon: <Calendar className="w-4 h-4" />, value: "7 Hari", label: "Konten Auto per Minggu" },
              { icon: <TrendingUp className="w-4 h-4" />, value: "4 Platform", label: "IG, TikTok, FB, Twitter" },
              { icon: <Clock className="w-4 h-4" />, value: "<60 Detik", label: "Waktu Generate Konten" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 py-8 text-center"
                style={i > 0 ? { borderLeft: "1px solid var(--border)" } : {}}
              >
                <div style={{ color: "var(--lime)" }}>{s.icon}</div>
                <p className="font-display font-black text-2xl sm:text-3xl" style={{ color: "var(--text)" }}>
                  {s.value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM (01) ─────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionLabel n="01" />
              <h2 className="font-display font-black leading-[0.92] mb-6"
                style={{ fontSize: "clamp(40px,5.5vw,72px)", color: "var(--text)" }}>
                Habis waktu<br />buat konten,<br />
                <span className="text-gradient-violet">bukan jualan.</span>
              </h2>
              <p className="text-lg leading-relaxed max-w-sm" style={{ color: "var(--text-2)" }}>
                Pemilik UMKM rata-rata menghabiskan 2–3 jam per hari hanya untuk memikirkan
                caption dan konten sosmed.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:pt-14">
              {[
                { emoji: "😓", text: "Bingung mau posting apa setiap hari" },
                { emoji: "⏰", text: "Buang waktu nulis caption dari nol" },
                { emoji: "📉", text: "Engagement rendah karena konten tidak konsisten" },
                { emoji: "💸", text: "Mahal hire tim konten atau social media manager" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--lime)",
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES (02) ────────────────────────────────── */}
      <section
        className="py-24 px-5 sm:px-8"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-2)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <SectionLabel n="02" />
              <h2 className="font-display font-black leading-[0.92]"
                style={{ fontSize: "clamp(40px,5.5vw,72px)", color: "var(--text)" }}>
                Semua yang<br />kamu butuhkan.
              </h2>
            </div>
            <p className="text-base leading-relaxed max-w-xs" style={{ color: "var(--text-2)" }}>
              Dari generate konten hingga visual AI dan jadwal posting — satu platform, beres.
            </p>
          </div>

          {/* Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Lime hero card */}
            <div
              className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "var(--lime)" }}
            >
              <div
                className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-15"
                style={{ background: "var(--lime-fg)" }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(0,0,0,0.13)" }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: "var(--lime-fg)" }} />
                </div>
                <h3 className="font-display font-black text-3xl mb-3" style={{ color: "var(--lime-fg)" }}>
                  AI Content Calendar Generator
                </h3>
                <p className="text-base leading-relaxed mb-6 max-w-lg" style={{ color: "var(--lime-fg)", opacity: 0.68 }}>
                  Isi profil UMKM sekali, Gemini AI buatkan 7 hari konten — tema, caption Bahasa
                  Indonesia, dan hashtag trending.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Caption BI", "7 Hari Konten", "Hashtag Lokal", "Tone Kustom"].map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(0,0,0,0.13)", color: "var(--lime-fg)" }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Violet card */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: "var(--violet)" }}
            >
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                style={{ background: "white" }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  Generate Gambar Promosi AI
                </h3>
                <p className="text-sm leading-relaxed text-white opacity-75">
                  Gemini 2.5 sulap ide visual jadi gambar siap pakai untuk Instagram & TikTok.
                </p>
                <div
                  className="mt-5 rounded-xl overflow-hidden aspect-video flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <Image className="w-8 h-8 opacity-40 text-white" />
                </div>
              </div>
            </div>

            {/* Video */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.13)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <Video className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>
                Video Reels AI{" "}
                <span className="text-xs font-bold text-amber-400">(Veo 3.1)</span>
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>
                Video promosi audio-visual untuk Reels & TikTok — tanpa kamera.
              </p>
              <div className="tag tag-amber w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Beta
              </div>
            </div>

            {/* Calendar */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.13)", border: "1px solid rgba(59,130,246,0.2)" }}
              >
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>
                Sync Google Calendar
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                Jadwalkan postingan langsung ke Google Calendar. Reminder otomatis 30 menit sebelum upload.
              </p>
            </div>

            {/* Archive */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.13)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <BookMarked className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text)" }}>
                Arsip Konten
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                Simpan semua rencana konten. Load ulang kapan saja untuk referensi atau generate ulang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (03) ────────────────────────────── */}
      <section
        id="cara-kerja"
        className="py-24 px-5 sm:px-8"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SectionLabel n="03" />
            <h2 className="font-display font-black leading-[0.92]"
              style={{ fontSize: "clamp(40px,5.5vw,72px)", color: "var(--text)" }}>
              3 langkah,<br />konten selesai<br />seminggu.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                n: "01",
                title: "Isi Profil UMKM",
                desc: "Masukkan nama produk, target audiens, kategori bisnis, dan gaya komunikasi. Cuma 2 menit.",
                tag: "Setup Sekali",
                tagStyle: "tag-violet",
              },
              {
                n: "02",
                title: "AI Generate Kalender",
                desc: "Gemini AI rancang 7 tema konten — caption siap-posting, hashtag trending lokal, dan konsep visual.",
                tag: "< 60 Detik",
                tagStyle: "tag-lime",
              },
              {
                n: "03",
                title: "Generate Visual & Jadwalkan",
                desc: "Buat gambar/video AI, jadwalkan ke Google Calendar. Tinggal terima reminder dan posting.",
                tag: "Otomatis",
                tagStyle: "tag-amber",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                {/* Big decorative numeral */}
                <div
                  className="font-display font-black select-none mb-4"
                  style={{
                    fontSize: "96px",
                    lineHeight: "0.85",
                    color: "var(--border-2)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.n}
                </div>
                <div className="flex-1">
                  <span className={`tag ${step.tagStyle} mb-4`}>{step.tag}</span>
                  <h3 className="font-display font-black text-xl mb-3" style={{ color: "var(--text)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (04) ────────────────────────────── */}
      <section
        className="py-24 px-5 sm:px-8"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-2)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SectionLabel n="04" />
            <h2 className="font-display font-black leading-[0.92]"
              style={{ fontSize: "clamp(40px,5.5vw,72px)", color: "var(--text)" }}>
              UMKM<br />berbicara.
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
              quote="Awalnya skeptis, tapi caption yang di-generate ternyata natural banget bahasa Indonesianya. Cocok banget buat UMKM fashion kayak saya."
              name="Sari Dewi"
              role="Founder, Batik Sari Collection"
              initial="S"
              color="bg-amber-600"
            />
          </div>
        </div>
      </section>

      {/* ── CTA — LIME SECTION ───────────────────────────── */}
      <section
        className="px-5 sm:px-8 py-20 sm:py-28"
        style={{ borderTop: "1px solid var(--border)", background: "var(--lime)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div>
              <h2
                className="font-display font-black leading-[0.88]"
                style={{ fontSize: "clamp(48px,7vw,100px)", color: "var(--lime-fg)" }}
              >
                Mulai sekarang.<br />
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationThickness: "3px",
                    textUnderlineOffset: "6px",
                  }}
                >
                  Bisnis tumbuh.
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-start gap-5 lg:pb-2 flex-shrink-0">
              <p className="text-base leading-relaxed max-w-xs" style={{ color: "var(--lime-fg)", opacity: 0.62 }}>
                Bergabung bersama ratusan UMKM Indonesia yang sudah menyederhanakan strategi
                konten mereka bersama B-Plan.
              </p>
              <Link
                to="/masuk"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-black text-base transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-xl"
                style={{ background: "var(--lime-fg)", color: "var(--lime)" }}
              >
                <Zap className="w-5 h-5 fill-current" />
                Mulai Gratis — Pakai Google
              </Link>
              <p className="text-xs" style={{ color: "var(--lime-fg)", opacity: 0.48 }}>
                Gratis. Tidak perlu kartu kredit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
