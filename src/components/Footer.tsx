import React from "react";
import { Link } from "react-router-dom";
import { Zap, Instagram, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer
      className="pt-16 pb-10"
      style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--violet)" }}
              >
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-display font-black text-xl tracking-tight" style={{ color: "var(--text)" }}>
                B–Plan
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-2)" }}>
              AI Content Planner yang dirancang khusus untuk UMKM Indonesia. Konten sosmed
              jalan sendiri, kamu fokus berbisnis.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: "var(--bg-3)",
                    border: "1px solid var(--border)",
                    color: "var(--text-2)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-2)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-2)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-3)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="font-display font-bold text-sm mb-4" style={{ color: "var(--text)" }}>
              Produk
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Fitur", href: "/fitur" },
                { label: "Cara Kerja", href: "/#cara-kerja" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-2)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-display font-bold text-sm mb-4" style={{ color: "var(--text)" }}>
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {["Kebijakan Privasi", "Syarat Layanan"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-2)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-2)" }}>
            © 2026 B-Plan. Didukung oleh Google Gemini AI & Veo 3.1
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "var(--text-2)" }}>
              Semua sistem aktif
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
