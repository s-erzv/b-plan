import React from "react";
import { Link } from "react-router-dom";
import { Zap, Instagram, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#06060C] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-black text-xl tracking-tight">
                <span className="text-gradient-violet">B–</span>
                <span className="text-[#F0F0F8]">Plan</span>
              </span>
            </Link>
            <p className="text-[#6B6B8A] text-sm leading-relaxed max-w-xs">
              AI Content Planner yang dirancang khusus untuk UMKM Indonesia. Konten sosmed jalan sendiri, kamu fokus berbisnis.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-[#6B6B8A] hover:text-white hover:bg-white/[0.08] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-[#6B6B8A] hover:text-white hover:bg-white/[0.08] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="font-display font-bold text-white text-sm mb-4">Produk</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Fitur", href: "/fitur" },
                { label: "Cara Kerja", href: "/#cara-kerja" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-[#6B6B8A] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-display font-bold text-white text-sm mb-4">Legal</p>
            <ul className="flex flex-col gap-3">
              {["Kebijakan Privasi", "Syarat Layanan"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#6B6B8A] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B6B8A] text-xs">
            © 2026 B-Plan. Didukung oleh Google Gemini AI & Veo 3.1
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[#6B6B8A]">Semua sistem aktif</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
