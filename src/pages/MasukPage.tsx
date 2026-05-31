import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Sparkles, Calendar, Image, Zap, CheckCircle } from "lucide-react";
import { GoogleSignInButton } from "../components/GoogleSignInButton";

interface MasukPageProps {
  onSignIn: () => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export const MasukPage: React.FC<MasukPageProps> = ({ onSignIn, isLoading, error }) => {
  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Left: Auth Panel ─────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 relative">

        {/* Back */}
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "var(--text-2)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gold)" }}>
              <Zap className="w-5 h-5 fill-current" style={{ color: "var(--gold-fg)" }} />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight" style={{ color: "var(--text)" }}>B–Plan</span>
          </Link>

          {/* Heading */}
          <h1 className="font-display font-extrabold text-4xl mb-2 leading-tight" style={{ color: "var(--text)" }}>
            Selamat datang.
          </h1>
          <p className="text-base mb-10 leading-relaxed" style={{ color: "var(--text-2)" }}>
            Masuk dengan akun Google kamu untuk mulai merencanakan konten UMKM secara otomatis.
          </p>

          {/* Auth card */}
          <div
            className="rounded-2xl p-7 flex flex-col gap-5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
          >
            <GoogleSignInButton onSignIn={onSignIn} isLoading={isLoading} />

            {error && (
              <div
                className="p-4 rounded-xl text-sm text-center"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
              >
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-2)" }}>aman & terenkripsi</span>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            <div className="flex flex-col gap-3">
              {[
                "Login via Google OAuth 2.0 resmi",
                "Data kamu tidak pernah kami jual",
                "Kapan saja bisa cabut akses",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs" style={{ color: "var(--text-2)" }}>
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--green)" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: "var(--text-2)", opacity: 0.7 }}>
            Dengan masuk, kamu menyetujui{" "}
            <a href="#" className="underline transition-colors" style={{ color: "var(--text-2)" }}>Syarat Layanan</a>
            {" "}dan{" "}
            <a href="#" className="underline transition-colors" style={{ color: "var(--text-2)" }}>Kebijakan Privasi</a>{" "}kami.
          </p>
        </div>
      </div>

      {/* ── Right: Visual Panel ──────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[46%] flex-col items-center justify-center p-16 relative overflow-hidden"
        style={{ background: "var(--bg-2)", borderLeft: "1px solid var(--border)" }}
      >
        {/* Gold orb */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }}
        />
        {/* Blue orb */}
        <div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: 0.5,
          }}
        />

        <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
          {/* AI Content card */}
          <div className="rounded-2xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gold-dim)", border: "1px solid rgba(245,158,11,0.25)" }}>
                <Sparkles className="w-4 h-4" style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>AI Content Generator</p>
                <p className="text-xs" style={{ color: "var(--text-2)" }}>7 hari konten dalam 60 detik</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Hari 1 — Edukasi", done: true },
                { label: "Hari 2 — Promo", done: true },
                { label: "Hari 3 — Behind The Scenes", done: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between h-8 rounded-lg px-3" style={{ background: "var(--bg-3)" }}>
                  <span className="text-xs" style={{ color: "var(--text-2)" }}>{item.label}</span>
                  {item.done && <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--green)" }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <Image className="w-5 h-5 mb-3" style={{ color: "var(--green)" }} />
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Gambar AI</p>
              <p className="text-xs" style={{ color: "var(--text-2)" }}>Visual promosi dalam detik</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <Calendar className="w-5 h-5 mb-3" style={{ color: "var(--blue)" }} />
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Auto Jadwal</p>
              <p className="text-xs" style={{ color: "var(--text-2)" }}>Sync ke Google Calendar</p>
            </div>
          </div>

          {/* Testimonial */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--gold)",
            }}
          >
            <p className="text-sm leading-relaxed italic mb-4" style={{ color: "var(--text-2)" }}>
              "B-Plan menghemat 2 jam saya setiap hari. Kontennya relevan banget sama produk saya!"
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--gold)", color: "var(--gold-fg)" }}
              >
                R
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>Rina, Owner Skincare</p>
                <p className="text-[10px]" style={{ color: "var(--text-2)" }}>Jakarta Selatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
