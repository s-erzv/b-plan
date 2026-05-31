import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, X, Zap, Target, Lightbulb, Code2,
  Rocket, Users, CheckCircle, TrendingUp, Clock, AlertCircle,
  ArrowRight, Cpu, LayoutGrid, Briefcase, Calendar, Image,
  Video, Database, Shield, Globe, Star, Layers,
} from "lucide-react";

/* ─── Shared deck styles ───────────────────────────── */
const D = {
  bg:      "#0A0C1A",
  surf:    "#111729",
  surf2:   "#18213A",
  gold:    "#F59E0B",
  goldDim: "rgba(245,158,11,0.12)",
  blue:    "#3B82F6",
  blueDim: "rgba(59,130,246,0.12)",
  green:   "#10B981",
  red:     "#EF4444",
  text:    "#F0EFE9",
  muted:   "rgba(240,239,233,0.50)",
  border:  "rgba(255,255,255,0.08)",
};

const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = D.gold }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
    style={{ background: `${color}18`, color, border: `1px solid ${color}28` }}
  >
    {children}
  </span>
);

const SlideTitle: React.FC<{ sub: string; title: React.ReactNode }> = ({ sub, title }) => (
  <div className="mb-10">
    <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: D.gold }}>{sub}</p>
    <h2 className="font-display font-extrabold leading-[0.88]" style={{ fontSize: "clamp(36px,4.5vw,60px)", color: D.text }}>
      {title}
    </h2>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 1 — Identity & SDG
══════════════════════════════════════════════════════ */
const Slide1 = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8" style={{ background: D.bg }}>
    {/* Orbs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
    </div>

    <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: D.gold, boxShadow: `0 0 40px rgba(245,158,11,0.3)` }}>
          <Zap className="w-7 h-7 fill-current" style={{ color: D.bg }} />
        </div>
        <span className="font-display font-extrabold text-5xl tracking-tight" style={{ color: D.text }}>B–Plan</span>
      </div>

      {/* Tagline */}
      <div className="px-5 py-2.5 rounded-full text-sm font-bold" style={{ background: D.goldDim, color: D.gold, border: `1px solid ${D.gold}30` }}>
        AI Social Media Planner untuk UMKM Indonesia
      </div>

      {/* Elevator pitch */}
      <p className="text-xl leading-relaxed max-w-2xl" style={{ color: D.muted }}>
        B-Plan membantu pemilik UMKM membuat kalender konten 7 hari secara otomatis menggunakan{" "}
        <span style={{ color: D.gold }}>Google Gemini AI</span> — lengkap dengan caption, hashtag, visual AI, dan sync ke Google Calendar.
      </p>

      {/* SDG Badges */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: D.surf, border: `1px solid ${D.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-lg" style={{ background: "#E63B2E", color: "white" }}>4</div>
          <div className="text-left">
            <p className="text-xs font-bold" style={{ color: D.text }}>SDG 4</p>
            <p className="text-[10px]" style={{ color: D.muted }}>Quality Education</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: D.surf, border: `1px solid ${D.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-lg" style={{ background: "#F59E0B", color: D.bg }}>8</div>
          <div className="text-left">
            <p className="text-xs font-bold" style={{ color: D.text }}>SDG 8</p>
            <p className="text-[10px]" style={{ color: D.muted }}>Decent Work & Economic Growth</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 2 — Problem Statement
══════════════════════════════════════════════════════ */
const Slide2 = () => (
  <div className="flex flex-col h-full px-12 py-10" style={{ background: D.bg }}>
    <SlideTitle sub="02 — Problem" title={<>78% UMKM Tidak Punya<br /><span style={{ color: D.gold }}>Strategi Konten</span></>} />

    <div className="grid grid-cols-2 gap-6 flex-1">
      {/* Left: Pain points */}
      <div className="flex flex-col gap-4">
        {[
          { icon: <Clock className="w-5 h-5" />, title: "Buang 2–3 Jam/Hari", desc: "Hanya untuk mikirin caption dan posting schedule" },
          { icon: <TrendingUp className="w-5 h-5" />, title: "Engagement Rendah", desc: "Konten tidak konsisten, algoritma tidak berpihak" },
          { icon: <AlertCircle className="w-5 h-5" />, title: "Tidak Punya Strategi", desc: "Post acak-acakan tanpa tema dan tujuan yang jelas" },
          { icon: <Briefcase className="w-5 h-5" />, title: "Biaya SM Manager Mahal", desc: "Rp 3–8 juta/bulan untuk hire social media manager" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: D.surf, border: `1px solid ${D.border}`, borderLeft: `3px solid ${D.gold}` }}>
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: D.goldDim, color: D.gold }}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-bold mb-0.5" style={{ color: D.text }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: D.muted }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Stat + comparison */}
      <div className="flex flex-col gap-4">
        {/* Big stat */}
        <div className="rounded-2xl p-6 flex-shrink-0" style={{ background: `${D.gold}15`, border: `1px solid ${D.gold}30` }}>
          <p className="font-display font-extrabold" style={{ fontSize: "64px", lineHeight: "1", color: D.gold }}>78%</p>
          <p className="text-sm font-semibold mt-2" style={{ color: D.text }}>UMKM tidak punya strategi konten media sosial yang konsisten</p>
          <p className="text-xs mt-1" style={{ color: D.muted }}>Sumber: Kemenkominfo 2024</p>
        </div>

        {/* Comparison */}
        <div className="rounded-2xl p-5 flex-1" style={{ background: D.surf, border: `1px solid ${D.border}` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: D.muted }}>Kompetitor vs B-Plan</p>
          <div className="flex flex-col gap-2">
            {[
              { name: "Canva", focus: "Template visual saja", check: false },
              { name: "Buffer", focus: "Scheduling saja, tidak AI", check: false },
              { name: "Hootsuite", focus: "Mahal, bukan untuk UMKM", check: false },
              { name: "B-Plan", focus: "AI generate + visual + jadwal, khusus UMKM BI", check: true },
            ].map((row) => (
              <div key={row.name} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: row.check ? `${D.gold}12` : "transparent", border: row.check ? `1px solid ${D.gold}25` : "1px solid transparent" }}>
                <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: row.check ? D.gold : D.text }}>{row.name}</span>
                <span className="text-xs flex-1" style={{ color: D.muted }}>{row.focus}</span>
                {row.check
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: D.green }} />
                  : <X className="w-4 h-4 flex-shrink-0" style={{ color: D.red }} />
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 3 — Solution & User Journey
══════════════════════════════════════════════════════ */
const Slide3 = () => (
  <div className="flex flex-col h-full px-12 py-10" style={{ background: D.bg }}>
    <SlideTitle sub="03 — Solution" title={<>Flow 4 Langkah,<br /><span style={{ color: D.gold }}>Konten Selesai.</span></>} />

    <div className="flex flex-col gap-6 flex-1">
      {/* Flow */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { n: "01", icon: <Briefcase className="w-6 h-6" />, label: "Input", desc: "Nama produk, target audiens, kategori, tone", color: D.gold },
          { n: "02", icon: <Cpu className="w-6 h-6" />, label: "AI Generate", desc: "Gemini merancang 7 hari konten dalam < 60 detik", color: D.blue },
          { n: "03", icon: <LayoutGrid className="w-6 h-6" />, label: "Review", desc: "Edit caption, generate gambar/video AI per hari", color: D.green },
          { n: "04", icon: <Calendar className="w-6 h-6" />, label: "Schedule", desc: "Tambah semua ke Google Calendar sekaligus", color: "#A78BFA" },
        ].map((step, i) => (
          <React.Fragment key={step.n}>
            <div className="rounded-2xl p-5 flex flex-col gap-3 relative" style={{ background: D.surf, border: `1px solid ${step.color}28`, borderTop: `3px solid ${step.color}` }}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${step.color}18`, color: step.color }}>
                  {step.icon}
                </div>
                <span className="font-display font-extrabold text-2xl" style={{ color: `${step.color}30` }}>{step.n}</span>
              </div>
              <div>
                <p className="font-display font-bold text-base mb-1" style={{ color: D.text }}>{step.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: D.muted }}>{step.desc}</p>
              </div>
            </div>
            {i < 3 && (
              <div className="hidden" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Output per day */}
      <div className="rounded-2xl p-5 flex-1" style={{ background: D.surf, border: `1px solid ${D.border}` }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: D.muted }}>Output per Hari — Contoh Hari 1</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Tema Konten", value: "Edukasi Produk", tags: ["Behind the scenes", "Tips & Trik", "Fakta Menarik"], color: D.blue },
            { label: "Caption + CTA", value: '"Tau gak sih kenapa kopi Gayo..."', tags: ["BI Natural", "300+ kata", "CTA kuat"], color: D.gold },
            { label: "Hashtag Lokal", value: "15–20 hashtag relevan", tags: ["#kopigayo", "#kopinusantara", "#umkmkopi"], color: D.green },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-4" style={{ background: D.surf2, border: `1px solid ${item.color}22` }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: item.color }}>{item.label}</p>
              <p className="text-xs font-semibold mb-3" style={{ color: D.text }}>{item.value}</p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${item.color}15`, color: item.color }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 4 — Technical Proof / MVP Screens
══════════════════════════════════════════════════════ */
const Slide4 = () => (
  <div className="flex flex-col h-full px-12 py-10" style={{ background: D.bg }}>
    <SlideTitle sub="04 — MVP" title={<>6 Screen MVP,<br /><span style={{ color: D.gold }}>Sudah Live.</span></>} />

    <div className="grid grid-cols-3 gap-4 flex-1">
      {[
        {
          icon: <Briefcase className="w-5 h-5" />, title: "Form Profil UMKM",
          desc: "Input nama produk, audiens, kategori bisnis, tone, USP, promo, dan keywords. Compact horizontal grid di atas dashboard.",
          color: D.gold, badge: "Input"
        },
        {
          icon: <Cpu className="w-5 h-5" />, title: "AI Loading State",
          desc: "Animated spinner + 7 rotating loading messages saat Gemini memproses prompt. Real-time progress feedback ke user.",
          color: D.blue, badge: "Processing"
        },
        {
          icon: <LayoutGrid className="w-5 h-5" />, title: "Calendar View (7 Hari)",
          desc: "Grid 7 kartu konten dengan tema, caption, hashtag, dan visual concept. Responsive 2–4 kolom per screen size.",
          color: D.green, badge: "Output"
        },
        {
          icon: <Video className="w-5 h-5" />, title: "Veo 3.1 Video Gen",
          desc: "Pilih rasio 9:16 / 16:9, klik generate, polling tiap 7 detik sampai video selesai render. Download langsung.",
          color: "#A78BFA", badge: "Media AI"
        },
        {
          icon: <Image className="w-5 h-5" />, title: "Gemini 2.5 Image Gen",
          desc: "4 rasio tersedia (1:1, 9:16, 16:9, 4:3). Generate gambar promosi siap pakai untuk feed Instagram & TikTok.",
          color: D.green, badge: "Media AI"
        },
        {
          icon: <Calendar className="w-5 h-5" />, title: "Google Calendar Sync",
          desc: "Tombol 'Tambah Semua ke Calendar' untuk 7 event sekaligus. Per-event date/time picker juga tersedia.",
          color: D.blue, badge: "Integration"
        },
      ].map((card, i) => (
        <div key={i} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: D.surf, border: `1px solid ${card.color}22`, borderTop: `3px solid ${card.color}` }}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}18`, color: card.color }}>
              {card.icon}
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${card.color}15`, color: card.color }}>
              {card.badge}
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-sm mb-2" style={{ color: D.text }}>{card.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: D.muted }}>{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 5 — Tech Stack & Code Snippet
══════════════════════════════════════════════════════ */
const Slide5 = () => (
  <div className="flex flex-col h-full px-12 py-10" style={{ background: D.bg }}>
    <SlideTitle sub="05 — Tech Stack" title={<>Built on<br /><span style={{ color: D.gold }}>Google Technology.</span></>} />

    <div className="grid grid-cols-2 gap-6 flex-1">
      {/* Stack list */}
      <div className="flex flex-col gap-3">
        {[
          { icon: <Cpu className="w-4 h-4" />, name: "Gemini 3.5 Flash", desc: "Content calendar generation (JSON schema)", color: D.blue },
          { icon: <Image className="w-4 h-4" />, name: "Gemini 2.5 Flash Image", desc: "AI promotional image generation", color: D.green },
          { icon: <Video className="w-4 h-4" />, name: "Google Veo 3.1", desc: "AI video generation for Reels & TikTok", color: "#A78BFA" },
          { icon: <Shield className="w-4 h-4" />, name: "Firebase Auth", desc: "Google OAuth 2.0 sign-in", color: D.gold },
          { icon: <Database className="w-4 h-4" />, name: "Cloud Firestore", desc: "Realtime profile & calendar persistence", color: D.gold },
          { icon: <Calendar className="w-4 h-4" />, name: "Google Calendar API", desc: "Event creation + reminder scheduling", color: D.blue },
          { icon: <Globe className="w-4 h-4" />, name: "Vite + React + TypeScript", desc: "Frontend — fast, typed, production-ready", color: D.muted as string },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: D.surf, border: `1px solid ${D.border}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18`, color: item.color }}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: D.text }}>{item.name}</p>
              <p className="text-[10px]" style={{ color: D.muted }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Code snippet */}
      <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "#0D1117", border: `1px solid ${D.border}` }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${D.border}`, background: "#161B22" }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
          </div>
          <span className="text-[10px] font-mono" style={{ color: D.muted }}>server.ts — /api/generate-calendar</span>
        </div>
        <pre
          className="flex-1 p-4 text-[10px] leading-relaxed overflow-auto font-mono"
          style={{ color: "#E6EDF3" }}
        >{`const response = await ai.models
  .generateContent({
    model: "gemini-3.5-flash",
    contents: promptText,
    config: {
      responseMimeType:
        "application/json",
      systemInstruction:
        \`You are an expert social
        media manager for Indonesian
        UMKM (small businesses)...\`,
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day:    { type: Type.INTEGER },
            theme:  { type: Type.STRING  },
            caption:{ type: Type.STRING  },
            hashtags:{
              type: Type.ARRAY,
              items:{ type: Type.STRING }
            },
          },
        },
      },
    },
  });`}</pre>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 6 — Innovation & Roadmap
══════════════════════════════════════════════════════ */
const Slide6 = () => (
  <div className="flex flex-col h-full px-12 py-10" style={{ background: D.bg }}>
    <SlideTitle sub="06 — Innovation" title={<>Apa yang Beda?<br /><span style={{ color: D.gold }}>Roadmap Kami.</span></>} />

    <div className="grid grid-cols-2 gap-6 flex-1">
      {/* Differentiators */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: D.muted }}>4 Keunggulan vs Kompetitor</p>
        {[
          { n: "01", title: "Bahasa Indonesia Nativ", desc: "Caption tidak terasa seperti terjemahan — natural, pakai slang lokal yang tepat", color: D.gold },
          { n: "02", title: "All-in-One Pipeline", desc: "Text AI + Image AI + Video AI + Calendar Sync dalam 1 platform, bukan 4 tool berbeda", color: D.blue },
          { n: "03", title: "UMKM-First Design", desc: "UI dirancang untuk pemilik UMKM non-teknis: form simpel, output langsung siap pakai", color: D.green },
          { n: "04", title: "Google Ecosystem Native", desc: "Firebase + Calendar API + Gemini + Veo — semua terhubung tanpa friction", color: "#A78BFA" },
        ].map((item) => (
          <div key={item.n} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: D.surf, border: `1px solid ${item.color}22`, borderLeft: `3px solid ${item.color}` }}>
            <span className="font-display font-extrabold text-lg flex-shrink-0" style={{ color: `${item.color}50` }}>{item.n}</span>
            <div>
              <p className="text-sm font-bold mb-0.5" style={{ color: D.text }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: D.muted }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: D.muted }}>Product Roadmap</p>
        {[
          {
            phase: "Phase 1", label: "MVP — Selesai", done: true, color: D.green,
            items: ["AI Content Calendar Generator", "Gemini 2.5 Image Generation", "Veo 3.1 Video Generation", "Google Calendar Sync", "Firebase Auth + Firestore"],
          },
          {
            phase: "Phase 2", label: "Q3 2026", done: false, color: D.blue,
            items: ["Auto-post to Instagram via API", "Analitik engagement terintegrasi", "Template library by kategori bisnis"],
          },
          {
            phase: "Phase 3", label: "Q1 2027", done: false, color: D.gold,
            items: ["Multi-user team collaboration", "AI A/B testing caption", "WhatsApp Business broadcast"],
          },
        ].map((phase) => (
          <div key={phase.phase} className="rounded-xl p-4" style={{ background: D.surf, border: `1px solid ${phase.color}22` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${phase.color}18`, color: phase.color }}>{phase.phase}</span>
              <span className="text-xs font-semibold" style={{ color: phase.done ? D.green : D.muted }}>{phase.label}</span>
              {phase.done && <CheckCircle className="w-3.5 h-3.5" style={{ color: D.green }} />}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phase.items.map(item => (
                <span key={item} className="text-[9px] px-2 py-1 rounded-lg" style={{ background: D.surf2, color: D.muted }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    SLIDE 7 — Team
══════════════════════════════════════════════════════ */
const Slide7 = () => (
  <div className="flex flex-col h-full px-12 py-10" style={{ background: D.bg }}>
    <SlideTitle sub="07 — Team" title={<>Tim yang<br /><span style={{ color: D.gold }}>Membangun B-Plan.</span></>} />

    <div className="grid grid-cols-4 gap-5 flex-1">
      {[
        {
          initial: "A", name: "Abisena Rais", role: "Project Leader",
          desc: "Memimpin arah produk, strategi, dan koordinasi tim end-to-end.",
          skills: ["Product Strategy", "Project Management", "Leadership"],
          icon: <Briefcase className="w-4 h-4" />, color: D.gold,
        },
        {
          initial: "Ar", name: "Arjuna Ragil Putera", role: "Backend Engineer",
          desc: "Membangun server Express.js, API routes, dan integrasi semua Google services.",
          skills: ["Node.js", "Express", "Firebase", "API Design"],
          icon: <Code2 className="w-4 h-4" />, color: D.blue,
        },
        {
          initial: "Ra", name: "M. Rahsya Nadibia", role: "Frontend Engineer",
          desc: "Merancang dan membangun seluruh UI React — dari landing page hingga dashboard.",
          skills: ["React", "TypeScript", "Tailwind", "UI/UX"],
          icon: <LayoutGrid className="w-4 h-4" />, color: D.green,
        },
        {
          initial: "S", name: "Sarah", role: "AI Integration",
          desc: "Merancang prompt engineering, integrasi Gemini, image gen, dan Veo 3.1.",
          skills: ["Gemini AI", "Prompt Eng.", "Veo 3.1", "Gen AI"],
          icon: <Cpu className="w-4 h-4" />, color: "#A78BFA",
        },
      ].map((member) => (
        <div
          key={member.name}
          className="rounded-2xl p-6 flex flex-col gap-4 h-full"
          style={{ background: D.surf, border: `1px solid ${member.color}22`, borderTop: `3px solid ${member.color}` }}
        >
          <div className="flex items-start justify-between">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-xl"
              style={{ background: member.color, color: member.color === D.gold ? D.bg : "white" }}
            >
              {member.initial}
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: D.surf2, color: member.color }}>
              {member.icon}
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-base" style={{ color: D.text }}>{member.name}</h3>
            <p className="text-xs font-semibold mt-0.5" style={{ color: member.color }}>{member.role}</p>
            <p className="text-xs leading-relaxed mt-2" style={{ color: D.muted }}>{member.desc}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3" style={{ borderTop: `1px solid ${D.border}` }}>
            {member.skills.map((s) => (
              <span key={s} className="text-[9px] font-semibold px-2 py-1 rounded-lg" style={{ background: D.surf2, color: D.muted }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
    DECK NAVIGATOR
══════════════════════════════════════════════════════ */
const SLIDES = [
  { id: 1, component: <Slide1 />, title: "Identity & SDG" },
  { id: 2, component: <Slide2 />, title: "Problem Statement" },
  { id: 3, component: <Slide3 />, title: "Solution & Journey" },
  { id: 4, component: <Slide4 />, title: "MVP Screens" },
  { id: 5, component: <Slide5 />, title: "Tech Stack" },
  { id: 6, component: <Slide6 />, title: "Innovation & Roadmap" },
  { id: 7, component: <Slide7 />, title: "Team" },
];

export const DeckPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx < 0 || idx >= SLIDES.length) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 180);
  }, [transitioning]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") window.location.href = "/";
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [goNext, goPrev]);

  const slide = SLIDES[current];

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{ background: D.bg, fontFamily: '"DM Sans", sans-serif', color: D.text }}
    >
      {/* ── Top bar ─────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: `1px solid ${D.border}`, background: D.surf }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: D.gold }}>
            <Zap className="w-3.5 h-3.5 fill-current" style={{ color: D.bg }} />
          </div>
          <span className="font-display font-extrabold text-base" style={{ color: D.text }}>B–Plan</span>
          <div className="h-4 w-px mx-1" style={{ background: D.border }} />
          <span className="text-sm font-medium" style={{ color: D.muted }}>{slide.title}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Slide dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? "24px" : "6px",
                  height: "6px",
                  background: i === current ? D.gold : D.border,
                }}
              />
            ))}
          </div>

          <span className="text-xs font-bold" style={{ color: D.muted }}>
            {current + 1} / {SLIDES.length}
          </span>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg"
            style={{ color: D.muted, background: D.surf2 }}
          >
            <X className="w-3.5 h-3.5" />
            Keluar
          </Link>
        </div>
      </div>

      {/* ── Slide area ──────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Slide content */}
        <div
          className="absolute inset-0 transition-opacity duration-180"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          <div className="h-full relative" style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
            {slide.component}
          </div>
        </div>

        {/* Left click zone */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-0 h-full w-16 flex items-center justify-start pl-3 z-20 group"
          disabled={current === 0}
          style={{ opacity: current === 0 ? 0 : 1 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
            style={{ background: D.surf, border: `1px solid ${D.border}`, color: D.muted }}
          >
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>

        {/* Right click zone */}
        <button
          onClick={goNext}
          className="absolute right-0 top-0 h-full w-16 flex items-center justify-end pr-3 z-20 group"
          disabled={current === SLIDES.length - 1}
          style={{ opacity: current === SLIDES.length - 1 ? 0 : 1 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
            style={{ background: D.surf, border: `1px solid ${D.border}`, color: D.muted }}
          >
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* ── Bottom bar ──────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderTop: `1px solid ${D.border}`, background: D.surf }}
      >
        <p className="text-[10px] font-medium" style={{ color: D.muted }}>
          Navigasi: Panah kiri/kanan · Spasi = next · Esc = keluar
        </p>
        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
            style={{ background: D.surf2, color: D.text, border: `1px solid ${D.border}` }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>
          <button
            onClick={goNext}
            disabled={current === SLIDES.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
            style={{ background: D.gold, color: D.bg }}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
