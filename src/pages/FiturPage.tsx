import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Sparkles, Image, Video, Calendar, BookMarked,
  CheckCircle, ArrowRight, Zap, Globe, Clock,
  Hash, PenLine, LayoutGrid
} from "lucide-react";

const FeatureSection: React.FC<{
  tag: string;
  tagStyle: string;
  tagIcon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
  accentColor: string;
}> = ({ tag, tagStyle, tagIcon, title, description, bullets, visual, reverse = false, accentColor }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
    <div className={reverse ? "lg:order-2" : ""}>
      <span className={`tag ${tagStyle} mb-5 inline-flex items-center gap-1.5`}>
        {tagIcon}{tag}
      </span>
      <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight mb-5">
        {title}
      </h2>
      <p className="text-[#6B6B8A] text-lg leading-relaxed mb-8">
        {description}
      </p>
      <ul className="flex flex-col gap-3">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-[#A0A0C0] text-sm">
            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accentColor}`} />
            {b}
          </li>
        ))}
      </ul>
    </div>
    <div className={`rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0E0E1A] min-h-64 flex items-center justify-center p-8 ${reverse ? "lg:order-1" : ""}`}>
      {visual}
    </div>
  </div>
);

const MockCaption: React.FC = () => (
  <div className="w-full max-w-sm space-y-3">
    <div className="rounded-xl bg-[#161625] border border-white/[0.07] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-violet-500" />
        <span className="text-xs text-violet-300 font-semibold">Hari 1 — Edukasi</span>
      </div>
      <p className="text-white text-xs leading-relaxed">
        "Tau gak sih bedanya kopi arabika vs robusta? ☕ Robusta punya kadar kafein 2x lebih tinggi, cocok banget buat kamu yang butuh boost energi pagi hari! 💪"
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {["#kopinusantara", "#kopilokal", "#umkm"].map(t => (
          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400">{t}</span>
        ))}
      </div>
    </div>
    <div className="rounded-xl bg-[#161625] border border-white/[0.07] p-4 opacity-60">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-rose-400" />
        <span className="text-xs text-rose-300 font-semibold">Hari 2 — Promo</span>
      </div>
      <p className="text-white text-xs leading-relaxed">
        "⚡ FLASH SALE! Beli 2 pack kopi Gayo, gratis 1 tumbler eksklusif senilai 75K! Berlaku hari ini aja..."
      </p>
    </div>
    <div className="rounded-xl bg-[#161625] border border-white/[0.07] p-4 opacity-30">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs text-amber-300 font-semibold">Hari 3 — BTS</span>
      </div>
      <div className="h-3 rounded bg-white/10 w-3/4" />
    </div>
  </div>
);

const MockImageGen: React.FC = () => (
  <div className="w-full max-w-xs text-center">
    <div className="rounded-xl border border-[#00E87A]/20 bg-gradient-to-br from-[#00E87A]/10 to-transparent aspect-square flex items-center justify-center mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent" />
      <div className="relative z-10 text-center">
        <Image className="w-12 h-12 text-[#00E87A] mx-auto mb-2 opacity-70" />
        <p className="text-[11px] text-[#6B6B8A]">Preview gambar AI</p>
        <p className="text-[9px] text-[#6B6B8A] mt-1">1:1 • 9:16 • 16:9 • 4:3</p>
      </div>
    </div>
    <div className="rounded-lg bg-[#161625] border border-white/[0.07] p-3 text-left">
      <p className="text-[10px] text-[#6B6B8A] mb-1">Prompt visual:</p>
      <p className="text-xs text-white/70 italic">"Flat lay produk kopi premium dengan background kayu..."</p>
    </div>
  </div>
);

const MockVideoGen: React.FC = () => (
  <div className="w-full max-w-xs text-center">
    <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-900/15 to-transparent aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 to-transparent" />
      <div className="relative z-10 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-2">
          <Video className="w-5 h-5 text-rose-300" />
        </div>
        <p className="text-[11px] text-[#6B6B8A]">Video 9:16 atau 16:9</p>
        <span className="tag tag-amber text-[9px] mt-2 inline-flex">Veo 3.1 by Google</span>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 rounded-lg bg-[#161625] border border-white/[0.07] p-2.5 text-center">
        <p className="text-[10px] text-[#6B6B8A]">9:16</p>
        <p className="text-[9px] text-[#4a4a65]">Reels / TikTok</p>
      </div>
      <div className="flex-1 rounded-lg bg-[#161625] border border-white/[0.07] p-2.5 text-center">
        <p className="text-[10px] text-[#6B6B8A]">16:9</p>
        <p className="text-[9px] text-[#4a4a65]">YouTube / FB</p>
      </div>
    </div>
  </div>
);

const MockCalendar: React.FC = () => (
  <div className="w-full max-w-sm space-y-3">
    {[
      { day: "Sen, 2 Jun", theme: "Edukasi", time: "09:00", color: "bg-violet-500" },
      { day: "Sel, 3 Jun", theme: "Promo Flash", time: "18:00", color: "bg-rose-500" },
      { day: "Rab, 4 Jun", theme: "Behind the Scene", time: "12:00", color: "bg-amber-500" },
      { day: "Kam, 5 Jun", theme: "Testimoni", time: "19:00", color: "bg-emerald-500" },
    ].map((e) => (
      <div key={e.day} className="flex items-center gap-3 rounded-xl bg-[#161625] border border-white/[0.07] p-3">
        <div className={`w-2 h-10 rounded-full ${e.color} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">[B-Plan] {e.theme}</p>
          <p className="text-[#6B6B8A] text-[10px]">{e.day} • {e.time}</p>
        </div>
        <Calendar className="w-4 h-4 text-[#6B6B8A] flex-shrink-0" />
      </div>
    ))}
  </div>
);

export const FiturPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06060C] text-[#F0F0F8] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-700/12 blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="tag tag-violet mb-6 inline-flex">
            <Sparkles className="w-3 h-3" />
            Platform Lengkap
          </span>
          <h1 className="font-display font-black text-5xl sm:text-6xl text-white leading-tight mb-5">
            Fitur yang memang<br />
            <span className="text-gradient-green">bikin beda.</span>
          </h1>
          <p className="text-[#6B6B8A] text-lg leading-relaxed max-w-xl mx-auto">
            B-Plan bukan sekedar generator teks — ini platform end-to-end untuk UMKM yang ingin punya kehadiran digital yang konsisten dan profesional.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 flex flex-col gap-32">

        <FeatureSection
          tag="AI Content Generator"
          tagStyle="tag-violet"
          tagIcon={<Sparkles className="w-3 h-3" />}
          title="7 Hari Konten Siap Posting, Otomatis."
          description="Cukup masukkan nama produk, target audiens, dan gaya komunikasimu — Gemini AI akan merancang 7 hari konten yang relevan, berbahasa Indonesia alami, dan siap langsung diposting."
          bullets={[
            "Caption bahasa Indonesia dengan marketing hooks yang terbukti efektif",
            "7 tema konten berbeda: edukasi, promo, BTS, testimoni, dll",
            "Hashtag trending lokal Indonesia yang niche dan relevan",
            "Tone of voice kustom: casual, profesional, humoris, estetik, persuasif",
            "Konsep visual lengkap sebagai panduan foto atau desain",
            "Adaptasi untuk F&B, Fashion, Kecantikan, Kerajinan, dan Jasa",
          ]}
          visual={<MockCaption />}
          accentColor="text-violet-400"
        />

        <FeatureSection
          tag="AI Image Generator"
          tagStyle="tag-green"
          tagIcon={<Image className="w-3 h-3" />}
          title="Gambar Promosi Profesional dalam Detik."
          description="Tidak perlu photographer atau designer. Gemini 2.5 Flash mengubah konsep visual dari kalender kontenmu menjadi gambar promosi berkualitas tinggi yang siap diposting."
          bullets={[
            "Powered by Google Gemini 2.5 Flash Image Generation",
            "4 pilihan rasio aspek: 1:1, 9:16, 16:9, 4:3",
            "Otomatis menyesuaikan konsep visual dari kalender konten",
            "Kualitas foto studio profesional dengan lighting optimal",
            "Download langsung dalam format PNG",
          ]}
          visual={<MockImageGen />}
          reverse
          accentColor="text-emerald-400"
        />

        <FeatureSection
          tag="AI Video Generator"
          tagStyle="tag-amber"
          tagIcon={<Video className="w-3 h-3" />}
          title="Reels & TikTok Tanpa Kamera."
          description="Teknologi Veo 3.1 terbaru dari Google mengubah ide visual menjadi video promosi audio-visual yang siap tayang di Reels Instagram atau TikTok — tanpa perlu shooting."
          bullets={[
            "Didukung Google Veo 3.1 (model video AI terkini)",
            "Format 9:16 (Reels/TikTok) dan 16:9 (YouTube/Facebook)",
            "Audio narasi dan musik otomatis dihasilkan AI",
            "Konsep visual dari kalender konten jadi prompt otomatis",
            "Download video MP4 langsung dari dashboard",
          ]}
          visual={<MockVideoGen />}
          accentColor="text-amber-400"
        />

        <FeatureSection
          tag="Google Calendar Sync"
          tagStyle="tag-violet"
          tagIcon={<Calendar className="w-3 h-3" />}
          title="Jadwal Terorganisir, Tidak Pernah Lupa Posting."
          description="Setiap konten dalam kalender 7 harimu bisa langsung dijadwalkan ke Google Calendar dengan sekali klik. Ada reminder otomatis 30 menit sebelum waktu posting."
          bullets={[
            "Integrasi langsung via Google OAuth — aman dan terpercaya",
            "Set tanggal dan jam posting per konten",
            "Reminder otomatis 30 menit sebelum waktu upload",
            "Caption dan hashtag lengkap tersimpan di event Calendar",
            "Warna event custom untuk membedakan jenis konten",
          ]}
          visual={<MockCalendar />}
          reverse
          accentColor="text-blue-400"
        />

      </div>

      {/* Quick comparison */}
      <section className="py-24 px-5 sm:px-8 bg-[#0A0A14]/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-black text-4xl text-white mb-3">B-Plan vs Cara Lama</h2>
            <p className="text-[#6B6B8A]">Lihat bedanya.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without */}
            <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.07] p-8">
              <p className="font-display font-bold text-[#6B6B8A] text-sm mb-6 uppercase tracking-wider">Tanpa B-Plan</p>
              <ul className="flex flex-col gap-4">
                {[
                  "2–3 jam/hari mikirin konten",
                  "Caption sering generik dan tidak menarik",
                  "Hashtag sama terus, reach stagnan",
                  "Sering lupa posting karena sibuk",
                  "Harus bayar desainer untuk visual",
                  "Data konten tersebar, susah dilacak",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#6B6B8A] text-sm">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* With */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-700/20 to-violet-900/10 border border-violet-500/25 p-8">
              <p className="font-display font-bold text-violet-300 text-sm mb-6 uppercase tracking-wider">Dengan B-Plan</p>
              <ul className="flex flex-col gap-4">
                {[
                  "7 hari konten siap dalam < 60 detik",
                  "Caption BI natural dengan hook yang terbukti",
                  "Hashtag niche dan trending sesuai produk",
                  "Reminder otomatis di Google Calendar",
                  "Gambar & video promosi AI tanpa biaya tambahan",
                  "Semua tersimpan rapi di arsip dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white text-sm">
                    <CheckCircle className="w-4 h-4 text-[#00E87A] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 sm:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Siap coba semua fiturnya?
          </h2>
          <p className="text-[#6B6B8A] text-lg mb-8">
            Mulai gratis sekarang. Tidak perlu kartu kredit.
          </p>
          <Link
            to="/masuk"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-base transition-all hover:shadow-xl hover:shadow-violet-900/40 hover:-translate-y-0.5"
          >
            <Zap className="w-5 h-5 fill-current" />
            Mulai Gratis dengan Google
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
