import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bp-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bp-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isDashboard = location.pathname === "/dashboard";

  const navLinks = [
    { label: "Fitur", href: "/fitur" },
    { label: "Cara Kerja", href: "/#cara-kerja" },
  ];

  const scrolledStyle: React.CSSProperties = {
    background: "var(--bg-nav)",
    borderBottom: "1px solid var(--border)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled || isDashboard ? scrolledStyle : {}}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/2.png" alt="B-Plan" className="h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {!isDashboard &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: location.pathname === link.href ? "var(--text)" : "var(--text-2)",
                  background: location.pathname === link.href ? "var(--bg-3)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
            style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ color: "var(--gold)" }}
              >
                Dashboard
              </button>
              <div className="flex items-center gap-2 pl-3" style={{ borderLeft: "1px solid var(--border)" }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full ring-1" style={{ ringColor: "var(--border)" }} referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--gold)", color: "var(--gold-fg)" }}>
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <button onClick={onLogout} className="text-xs font-medium transition-colors hover:text-red-400" style={{ color: "var(--text-2)" }}>
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/masuk" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: "var(--text-2)" }}>
                Masuk
              </Link>
              <Link
                to="/masuk"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-px hover:shadow-lg"
                style={{ background: "var(--gold)", color: "var(--gold-fg)", boxShadow: "0 0 0 0 rgba(245,158,11,0)" }}
              >
                Mulai Gratis →
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--bg-3)", color: "var(--text-2)", border: "1px solid var(--border)" }}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button className="p-2 transition-colors" style={{ color: "var(--text-2)" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-5 py-4 flex flex-col gap-2" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
          {!isDashboard && navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium" style={{ color: "var(--text-2)" }}>
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2" style={{ borderTop: "1px solid var(--border)" }}>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-center" style={{ background: "var(--gold)", color: "var(--gold-fg)" }}>Dashboard</Link>
                <button onClick={onLogout} className="px-4 py-3 rounded-lg text-sm font-medium text-red-400 text-center">Keluar</button>
              </>
            ) : (
              <>
                <Link to="/masuk" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-center" style={{ color: "var(--text-2)" }}>Masuk</Link>
                <Link to="/masuk" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-center" style={{ background: "var(--gold)", color: "var(--gold-fg)" }}>Mulai Gratis →</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
