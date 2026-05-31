import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { initAuth, signInWithGoogle, logoutUser, getCachedAccessToken } from "./firebase";
import { LandingPage } from "./pages/LandingPage";
import { FiturPage } from "./pages/FiturPage";
import { MasukPage } from "./pages/MasukPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DeckPage } from "./pages/DeckPage";
import { RefreshCw, Zap } from "lucide-react";

/* ── Auth-aware routes wrapper ─────────────────────── */
function AppRoutes() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setAuthChecking(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setAuthChecking(false);
      }
    );
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    setSigningIn(true);
    setSignInError(null);
    try {
      const result = await signInWithGoogle();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setSignInError("Gagal masuk dengan Google. Pastikan mengizinkan pop-up.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
    navigate("/");
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#06060C] flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-violet-900 border-t-violet-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-5 h-5 text-violet-400 fill-current" />
          </div>
        </div>
        <p className="text-sm text-[#6B6B8A] font-medium">Memuat B-Plan...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/fitur" element={<FiturPage />} />
      <Route
        path="/masuk"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <MasukPage onSignIn={handleSignIn} isLoading={signingIn} error={signInError} />
        }
      />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          user
            ? <DashboardPage user={user} accessToken={accessToken} onLogout={handleLogout} />
            : <Navigate to="/masuk" replace />
        }
      />

      {/* Deck */}
      <Route path="/deck" element={<DeckPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
