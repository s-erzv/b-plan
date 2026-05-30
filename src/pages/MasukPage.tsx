import React from "react";
import { Link } from "react-router-dom";
import { Zap, Shield, ArrowLeft, Sparkles, Calendar, Image } from "lucide-react";
import { GoogleSignInButton } from "../components/GoogleSignInButton";

interface MasukPageProps {
  onSignIn: () => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export const MasukPage: React.FC<MasukPageProps> = ({ onSignIn, isLoading, error }) => {
  return (
    <div className="min-h-screen bg-[#06060C] text-[#F0F0F8] flex overflow-hidden">

      {/* Left: Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 relative z-10">
        {/* Back link */}
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[#6B6B8A] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/50">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight">
              <span className="text-gradient-violet">B–</span>
              <span className="text-[#F0F0F8]">Plan</span>
            </span>
          </Link>

          {/* Heading */}
          <h1 className="font-display font-black text-3xl text-white mb-2 leading-tight">
            Selamat datang.
          </h1>
          <p className="text-[#6B6B8A] text-base mb-10 leading-relaxed">
            Masuk dengan akun Google kamu untuk mulai merencanakan konten UMKM secara otomatis.
          </p>

          {/* Auth card */}
          <div className="rounded-2xl bg-[#0E0E1A] border border-white/[0.08] p-7 flex flex-col gap-5">
            <GoogleSignInButton onSignIn={onSignIn} isLoading={isLoading} />

            {error && (
              <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/25 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-[#4a4a65]">aman & terenkripsi</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Trust signals */}
            <div className="flex flex-col gap-3">
              {[
                "Login via Google OAuth 2.0 resmi",
                "Data kamu tidak pernah kami jual",
                "Kapan saja bisa cabut akses",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-[#6B6B8A]">
                  <Shield className="w-3.5 h-3.5 text-[#00E87A] flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#4a4a65] text-xs text-center mt-6 leading-relaxed">
            Dengan masuk, kamu menyetujui{" "}
            <a href="#" className="text-[#6B6B8A] hover:text-white underline transition-colors">Syarat Layanan</a>
            {" "}dan{" "}
            <a href="#" className="text-[#6B6B8A] hover:text-white underline transition-colors">Kebijakan Privasi</a>{" "}kami.
          </p>
        </div>
      </div>

      {/* Right: Visual panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-violet-900/30 to-[#06060C] border-l border-white/[0.06] flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#00E87A]/5 blur-[100px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 w-full max-w-sm space-y-4">
          {/* Feature showcase cards */}
          <div className="rounded-2xl bg-[#0E0E1A]/80 border border-white/[0.07] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-600/25 border border-violet-500/25 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-300" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">AI Content Generator</p>
                <p className="text-[#6B6B8A] text-xs">7 hari konten dalam 60 detik</p>
              </div>
            </div>
            <div className="space-y-2">
              {["Caption Hari 1 — Edukasi ✓", "Caption Hari 2 — Promo ✓", "Caption Hari 3 — BTS ✓"].map(i => (
                <div key={i} className="h-6 rounded-lg bg-white/[0.04] flex items-center px-3">
                  <span className="text-xs text-[#6B6B8A]">{i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#0E0E1A]/80 border border-white/[0.07] p-4 backdrop-blur-sm">
              <Image className="w-5 h-5 text-[#00E87A] mb-3" />
              <p className="text-white text-xs font-semibold mb-1">Gambar AI</p>
              <p className="text-[#6B6B8A] text-[10px]">Generate visual dalam detik</p>
            </div>
            <div className="rounded-xl bg-[#0E0E1A]/80 border border-white/[0.07] p-4 backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-blue-400 mb-3" />
              <p className="text-white text-xs font-semibold mb-1">Auto Jadwal</p>
              <p className="text-[#6B6B8A] text-[10px]">Sync ke Google Calendar</p>
            </div>
          </div>

          {/* Quote */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-700/20 to-transparent border border-violet-500/15 p-5">
            <p className="text-[#A0A0C0] text-sm leading-relaxed italic mb-4">
              "B-Plan menghemat 2 jam saya setiap hari. Kontennya relevan banget sama produk saya!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">R</div>
              <div>
                <p className="text-white text-xs font-semibold">Rina, Owner Skincare</p>
                <p className="text-[#6B6B8A] text-[10px]">Jakarta Selatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
