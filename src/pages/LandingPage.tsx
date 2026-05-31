import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Sparkles, Calendar, Image, Video, BookMarked, ArrowRight,
  Zap, CheckCircle, TrendingUp, Users, Clock, Star, Play,
  Instagram, LayoutGrid, Briefcase, Code2, Cpu,
} from "lucide-react";

/* ─── Section number label ──────────────────────────── */
const SectionLabel: React.FC<{ n: string; label: string }> = ({ n, label }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="font-display font-extrabold text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>
      {n}
    </span>
    <div className="h-px flex-1 max-w-[48px]" style={{ background: "var(--gold)", opacity: 0.4 }} />
    <span className="font-display font-bold text-xs tracking-widest uppercase" style={{ color: "var(--text-2)" }}>
      {label}
    </span>
  </div>
);

/* ─── Feature card ──────────────────────────────────── */
const FeatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: string;
  className?: string;
}> = ({ icon, title, desc, accent = "var(--gold)", className = "" }) => (
  <div
    className={`rounded-2xl p-6 relative overflow-hidden transition-all hover:-translate-y-0.5 ${className}`}
    style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
    >
      <div style={{ color: accent }}>{icon}</div>
    </div>
    <h3 className="font-display font-bold text-lg mb-2" style={{ color: "var(--text)" }}>{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{desc}</p>
  </div>
);

/* ─── Testimonial ───────────────────────────────────── */
const Testimonial: React.FC<{ quote: string; name: string; role: string; initial: string }> = ({ quote, name, role, initial }) => (
  <div className="rounded-2xl p-6 flex flex-col gap-4 h-full" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
    </div>
    <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>"{quote}"</p>
    <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm"
        style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
      >
        {initial}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{name}</p>
        <p className="text-xs" style={{ color: "var(--text-2)" }}>{role}</p>
      </div>
    </div>
  </div>
);

/* ─── Team card ─────────────────────────────────────── */
const TeamCard: React.FC<{
  name: string;
  role: string;
  initial: string;
  skills: string[];
  icon: React.ReactNode;
}> = ({ name, role, initial, skills, icon }) => (
  <div
    className="rounded-2xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-1"
    style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
  >
    <div className="flex items-start justify-between">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-xl"
        style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
      >
        {initial}
      </div>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--bg-3)", color: "var(--text-2)" }}>
        {icon}
      </div>
    </div>
    <div>
      <h3 className="font-display font-bold text-lg" style={{ color: "var(--text)" }}>{name}</h3>
      <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--gold)" }}>{role}</p>
    </div>
    <div className="flex flex-wrap gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
      {skills.map((s) => (
        <span
          key={s}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
          style={{ background: "var(--bg-3)", color: "var(--text-2)" }}
        >
          {s}
        </span>
      ))}
    </div>
  </div>
);

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO — full-viewport, 2-column
      ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at var(--mx, 60%) var(--my, 35%), rgba(245,158,11,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(59,130,246,0.06) 0%, transparent 65%),
            var(--bg)
          `,
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            opacity: 0.4,
          }}
        />

        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-center">

            {/* Left: Text */}
            <div className="flex flex-col">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 self-start mb-8 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest animate-[fade-up_0.5s_ease_forwards]"
                style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid rgba(245,158,11,0.25)" }}
              >
                <Sparkles className="w-3 h-3" />
                AI Content Planner No.1 untuk UMKM Indonesia
              </div>

              {/* H1 */}
              <h1
                className="font-display font-extrabold leading-[0.88] tracking-tight mb-8 animate-[fade-up_0.6s_ease_forwards]"
                style={{ fontSize: "clamp(56px, 7.8vw, 112px)" }}
              >
                <span className="block" style={{ color: "var(--text)" }}>Konten Sosmed</span>
                <span className="block" style={{ color: "var(--text)" }}>UMKM Kamu,</span>
                <span className="block text-gradient-gold-shimmer">Jalan Sendiri.</span>
              </h1>

              {/* Sub */}
              <p
                className="text-lg sm:text-xl leading-relaxed max-w-lg mb-10 animate-[fade-up_0.7s_ease_forwards]"
                style={{ color: "var(--text-2)" }}
              >
                B-Plan generate kalender konten 7 hari — caption Bahasa Indonesia, hashtag trending,
                visual AI, dan sync ke Google Calendar. Satu klik, selesai seminggu.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-14 animate-[fade-up_0.8s_ease_forwards]">
                <Link
                  to="/masuk"
                  className="group flex items-center gap-2.5 px-7 py-4 rounded-xl font-display font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    background: "var(--gold)",
                    color: "var(--gold-fg)",
                    boxShadow: "0 4px 24px rgba(245,158,11,0.32)",
                  }}
                >
                  Buat Kalender Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#cara-kerja"
                  className="flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-base transition-all"
                  style={{ color: "var(--text-2)", border: "1px solid var(--border-2)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                >
                  <Play className="w-4 h-4" />
                  Lihat Cara Kerja
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10 animate-[fade-up_0.9s_ease_forwards]">
                {[
                  { n: "500+", label: "UMKM Aktif" },
                  { n: "7.000+", label: "Konten Dibuat" },
                  { n: "4.9 / 5", label: "Rating Pengguna" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-extrabold text-3xl" style={{ color: "var(--text)" }}>{s.n}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-2)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating product preview */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative animate-[float_6s_ease-in-out_infinite]">
                {/* Gold halo */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ boxShadow: "0 0 80px 24px rgba(245,158,11,0.14), 0 0 160px 48px rgba(245,158,11,0.06)" }}
                />

                {/* Main card */}
                <div
                  className="rounded-2xl p-5 w-[340px] relative z-10"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-2)",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
                      <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>7 Hari Konten — Kopi Gayo</span>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
                    >
                      LIVE
                    </span>
                  </div>

                  {/* Day rows */}
                  {[
                    { day: 1, theme: "Edukasi", color: "var(--blue)" },
                    { day: 2, theme: "Promo", color: "var(--gold)" },
                    { day: 3, theme: "Behind The Scenes", color: "var(--green)" },
                  ].map((d) => (
                    <div
                      key={d.day}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl mb-2 last:mb-0"
                      style={{ background: "var(--bg-3)" }}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                        style={{ background: `${d.color}20`, color: d.color }}
                      >
                        {d.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>Hari {d.day} — {d.theme}</p>
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-2)" }}>Caption siap • 5 hashtag lokal</p>
                      </div>
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--green)" }} />
                    </div>
                  ))}

                  {/* Caption preview */}
                  <div className="mt-4 rounded-xl p-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                      "Tau nggak sih kenapa kopi robusta Gayo lebih enak di pagi hari? Kandungan kafeinnya 2x lebih tinggi dari kopi biasa..."
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {["#kopigayo", "#kopilokal", "#umkm"].map(t => (
                        <span key={t} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" style={{ color: "var(--blue)" }} />
                      <span className="text-[10px]" style={{ color: "var(--text-2)" }}>Sync ke Google Calendar</span>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: "var(--green)" }}>Terjadwal</span>
                  </div>
                </div>

                {/* Satellite top-right */}
                <div
                  className="absolute -top-10 -right-16 rounded-xl p-3 w-44"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "0 16px 32px rgba(0,0,0,0.3)" }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Image className="w-3 h-3" style={{ color: "var(--green)" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "var(--text-2)" }}>Gambar Promosi AI</span>
                  </div>
                  <div className="rounded-lg aspect-video" style={{ background: "var(--bg-3)" }} />
                </div>

                {/* Satellite bottom-left */}
                <div
                  className="absolute -bottom-10 -left-16 rounded-xl p-3 w-44"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "0 16px 32px rgba(0,0,0,0.3)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "var(--blue-dim)" }}>
                      <Calendar className="w-2.5 h-2.5" style={{ color: "var(--blue)" }} />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: "var(--text-2)" }}>Google Calendar</span>
                  </div>
                  <p className="text-[9px]" style={{ color: "var(--text-2)" }}>7 event ditambahkan</p>
                  <div className="w-full h-1 rounded-full mt-2" style={{ background: "var(--bg-3)" }}>
                    <div className="h-full rounded-full w-full" style={{ background: "var(--green)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(transparent, var(--bg))" }}
        />
      </section>

      {/* ══════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: <Users className="w-4 h-4" />, value: "64 Juta", label: "UMKM di Indonesia" },
              { icon: <Calendar className="w-4 h-4" />, value: "7 Hari", label: "Konten Auto per Minggu" },
              { icon: <TrendingUp className="w-4 h-4" />, value: "4 Platform", label: "IG · TikTok · FB · X" },
              { icon: <Clock className="w-4 h-4" />, value: "< 60 Detik", label: "Waktu Generate Konten" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 py-8 text-center"
                style={i > 0 ? { borderLeft: "1px solid var(--border)" } : {}}
              >
                <div style={{ color: "var(--gold)" }}>{s.icon}</div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text)" }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color: "var(--text-2)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROBLEM — 01
      ══════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <SectionLabel n="01" label="Masalah Nyata" />
              <h2
                className="font-display font-extrabold leading-[0.9] mb-6"
                style={{ fontSize: "clamp(38px, 5vw, 68px)", color: "var(--text)" }}
              >
                Habis waktu buat<br />konten, bukan<br />
                <span className="text-gradient-gold">untuk jualan.</span>
              </h2>
              <p className="text-lg leading-relaxed max-w-sm" style={{ color: "var(--text-2)" }}>
                Pemilik UMKM rata-rata menghabiskan 2–3 jam per hari hanya untuk memikirkan caption.
                Waktu yang harusnya buat produk dan pelanggan.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:pt-16">
              {[
                { icon: <LayoutGrid className="w-5 h-5" />, text: "Bingung mau posting apa setiap hari" },
                { icon: <Clock className="w-5 h-5" />, text: "Buang waktu nulis caption dari nol" },
                { icon: <TrendingUp className="w-5 h-5" />, text: "Engagement rendah karena konten tidak konsisten" },
                { icon: <Briefcase className="w-5 h-5" />, text: "Mahal hire tim konten atau social media manager" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-4 rounded-xl p-4 transition-all hover:bg-[var(--bg-3)]"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: "3px solid var(--gold)" }}
                >
                  <div className="flex-shrink-0" style={{ color: "var(--gold)" }}>{item.icon}</div>
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES — 02
      ══════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <SectionLabel n="02" label="Fitur Unggulan" />
              <h2
                className="font-display font-extrabold leading-[0.9]"
                style={{ fontSize: "clamp(38px, 5vw, 68px)", color: "var(--text)" }}
              >
                Semua yang kamu<br />butuhkan, sudah ada.
              </h2>
            </div>
            <p className="text-base leading-relaxed max-w-xs" style={{ color: "var(--text-2)" }}>
              Dari konten hingga visual AI dan jadwal posting — satu platform, beres.
            </p>
          </div>

          {/* Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Hero gold card */}
            <div
              className="lg:col-span-2 rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "var(--gold)" }}
            >
              <div
                className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-10"
                style={{ background: "var(--gold-fg)" }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(0,0,0,0.15)" }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: "var(--gold-fg)" }} />
                </div>
                <h3 className="font-display font-extrabold text-3xl mb-3" style={{ color: "var(--gold-fg)" }}>
                  AI Content Calendar Generator
                </h3>
                <p className="text-base leading-relaxed mb-6 max-w-lg opacity-70" style={{ color: "var(--gold-fg)" }}>
                  Isi profil UMKM sekali — Gemini AI buatkan 7 hari konten lengkap dengan caption Bahasa Indonesia dan hashtag trending.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Caption BI", "7 Hari", "Hashtag Lokal", "Tone Kustom"].map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(0,0,0,0.15)", color: "var(--gold-fg)" }}
                    >
                      <CheckCircle className="w-3 h-3" />{f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Blue card */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: "var(--blue)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.18)" }}>
                <Image className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Generate Gambar Promosi AI</h3>
              <p className="text-sm leading-relaxed text-white opacity-75">
                Gemini 2.5 Flash sulap ide visual jadi gambar siap pakai untuk Instagram & TikTok.
              </p>
              <div className="mt-5 rounded-xl aspect-video flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <Image className="w-8 h-8 opacity-40 text-white" />
              </div>
            </div>

            <FeatCard icon={<Video className="w-5 h-5" />} title="Video Reels AI (Veo 3.1)" desc="Video promosi audio-visual untuk Reels & TikTok tanpa kamera. Powered by Google Veo 3.1." accent="var(--red)" />
            <FeatCard icon={<Calendar className="w-5 h-5" />} title="Sync Google Calendar" desc="Jadwalkan postingan langsung ke Google Calendar dengan reminder otomatis 30 menit sebelum upload." accent="var(--blue)" />
            <FeatCard icon={<BookMarked className="w-5 h-5" />} title="Arsip Konten" desc="Simpan semua rencana konten. Load ulang kapan saja untuk referensi atau generate ulang." accent="var(--green)" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS — 03
      ══════════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-28 px-5 sm:px-8" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SectionLabel n="03" label="Cara Kerja" />
            <h2
              className="font-display font-extrabold leading-[0.9]"
              style={{ fontSize: "clamp(38px, 5vw, 68px)", color: "var(--text)" }}
            >
              3 langkah,<br />konten selesai<br />seminggu.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                n: "01", accent: "var(--gold)",
                title: "Isi Profil UMKM",
                desc: "Masukkan nama produk, target audiens, kategori bisnis, dan gaya komunikasi. Cuma 2 menit.",
                badge: "Setup Sekali",
              },
              {
                n: "02", accent: "var(--blue)",
                title: "AI Generate Kalender",
                desc: "Gemini AI rancang 7 tema konten — caption siap-posting, hashtag trending lokal, dan konsep visual.",
                badge: "< 60 Detik",
              },
              {
                n: "03", accent: "var(--green)",
                title: "Generate Visual & Jadwalkan",
                desc: "Buat gambar/video AI, jadwalkan ke Google Calendar. Tinggal terima reminder dan posting.",
                badge: "Otomatis",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderTop: `3px solid ${step.accent}` }}
              >
                <div
                  className="font-display font-extrabold select-none mb-5"
                  style={{ fontSize: "88px", lineHeight: "0.8", color: `${step.accent}20`, letterSpacing: "-0.03em" }}
                >
                  {step.n}
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4"
                  style={{ background: `${step.accent}18`, color: step.accent, border: `1px solid ${step.accent}30` }}
                >
                  {step.badge}
                </span>
                <h3 className="font-display font-bold text-xl mb-3" style={{ color: "var(--text)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — 04
      ══════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SectionLabel n="04" label="Testimoni" />
            <h2
              className="font-display font-extrabold leading-[0.9]"
              style={{ fontSize: "clamp(38px, 5vw, 68px)", color: "var(--text)" }}
            >
              UMKM<br />berbicara.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Testimonial
              quote="Sebelum pakai B-Plan, saya bisa berjam-jam cuma buat mikirin caption. Sekarang tinggal klik, langsung jadi 7 hari konten yang relevan banget sama produk saya!"
              name="Rina Kusuma"
              role="Owner, Rein Skincare Jakarta"
              initial="R"
            />
            <Testimonial
              quote="Hashtag-nya niche banget, engagement Instagram saya naik 40% dalam 2 minggu. Fitur sync Google Calendar juga bikin saya nggak pernah lupa posting lagi."
              name="Budi Santoso"
              role="Pemilik, Warung Kopi Nusantara"
              initial="B"
            />
            <Testimonial
              quote="Caption yang di-generate ternyata natural banget bahasa Indonesianya, nggak kaku kayak terjemahan. Cocok banget buat UMKM fashion kayak saya."
              name="Sari Dewi"
              role="Founder, Batik Sari Collection"
              initial="S"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TEAM — 05
      ══════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SectionLabel n="05" label="Tim Kami" />
            <h2
              className="font-display font-extrabold leading-[0.9]"
              style={{ fontSize: "clamp(38px, 5vw, 68px)", color: "var(--text)" }}
            >
              Tim di Balik<br />B-Plan.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TeamCard
              name="Abisena Rais"
              role="Project Leader"
              initial="A"
              skills={["Strategy", "Product", "Leadership"]}
              icon={<Briefcase className="w-4 h-4" />}
            />
            <TeamCard
              name="Arjuna Ragil Putera"
              role="Backend Engineer"
              initial="Ar"
              skills={["Node.js", "Firebase", "API Design"]}
              icon={<Code2 className="w-4 h-4" />}
            />
            <TeamCard
              name="M. Rahsya Nadibia"
              role="Frontend Engineer"
              initial="Ra"
              skills={["React", "TypeScript", "UI/UX"]}
              icon={<LayoutGrid className="w-4 h-4" />}
            />
            <TeamCard
              name="Sarah"
              role="AI Integration"
              initial="S"
              skills={["Gemini AI", "Prompt Eng.", "Gen AI"]}
              icon={<Cpu className="w-4 h-4" />}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — GOLD SECTION
      ══════════════════════════════════════════════ */}
      <section className="px-5 sm:px-8 py-24 sm:py-32" style={{ background: "var(--gold)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div>
              <h2
                className="font-display font-extrabold leading-[0.86]"
                style={{ fontSize: "clamp(48px, 7vw, 100px)", color: "var(--gold-fg)" }}
              >
                Mulai sekarang.<br />
                <span style={{ textDecoration: "underline", textDecorationThickness: "3px", textUnderlineOffset: "8px" }}>
                  Bisnis tumbuh.
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-start gap-5 flex-shrink-0">
              <p className="text-base leading-relaxed max-w-xs" style={{ color: "rgba(13,15,26,0.6)" }}>
                Bergabung bersama ratusan UMKM Indonesia yang sudah menyederhanakan strategi konten mereka.
              </p>
              <Link
                to="/masuk"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-display font-extrabold text-base transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-xl"
                style={{ background: "var(--gold-fg)", color: "var(--gold)" }}
              >
                <Zap className="w-5 h-5 fill-current" />
                Mulai Gratis — Pakai Google
              </Link>
              <p className="text-xs" style={{ color: "rgba(13,15,26,0.45)" }}>Gratis. Tidak perlu kartu kredit.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
