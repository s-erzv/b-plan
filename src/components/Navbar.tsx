import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDashboard = location.pathname === "/dashboard";

  const navLinks = [
    { label: "Fitur", href: "/fitur" },
    { label: "Cara Kerja", href: "/#cara-kerja" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isDashboard
          ? "bg-[#06060C]/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/2.png" alt="B-Plan Logo" className="h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {!isDashboard && navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === link.href
                  ? "text-white bg-white/[0.07]"
                  : "text-[#6B6B8A] hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#A78BFA] hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Dashboard
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-white/[0.08]">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || ""}
                    className="w-7 h-7 rounded-full ring-1 ring-white/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-xs font-bold text-white">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="text-xs text-[#6B6B8A] hover:text-red-400 transition-colors font-medium"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/masuk"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#6B6B8A] hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/masuk"
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-violet-900/40 hover:-translate-y-px"
              >
                Mulai Gratis →
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#6B6B8A] hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0E0E1A] border-t border-white/[0.06] px-5 py-4 flex flex-col gap-2">
          {!isDashboard && navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-semibold text-[#6B6B8A] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg bg-violet-600 text-white text-sm font-bold text-center">
                  Dashboard
                </Link>
                <button onClick={onLogout} className="px-4 py-3 rounded-lg text-sm font-medium text-red-400 text-center">
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/masuk" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold text-[#6B6B8A] text-center">
                  Masuk
                </Link>
                <Link to="/masuk" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg bg-violet-600 text-white text-sm font-bold text-center">
                  Mulai Gratis →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
