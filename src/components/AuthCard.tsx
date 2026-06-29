import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Key, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";

interface AuthCardProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export default function AuthCard({ onLoginSuccess }: AuthCardProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        onLoginSuccess(data.token, data.user);
      } else if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        onLoginSuccess(data.token, data.user);
      } else {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Reset request failed");
        setInfo(data.message);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // Mock Google popup login auth
      const mockGoogleUser = {
        email: "demo@navigator.ai",
        name: "Demo Student",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=user"
      };

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGoogleUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google authentication failed");
      
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-container" className="w-full max-w-md mx-auto bg-[#1F2833] border border-[#45A29E]/20 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0B0C10] text-[#66FCF1] mb-3">
            <Key className="w-6 h-6" id="auth-icon-logo" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight" id="auth-title">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Your Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-sm text-[#C5C6C7]/80 mt-1">
            {mode === "login" && "Enter details to access your career dashboard"}
            {mode === "signup" && "Sign up to begin your personalized career roadmap"}
            {mode === "forgot" && "Enter your email to receive recovery instructions"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-950/20 text-red-400 text-sm border border-red-500/20 animate-pulse">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}



        {info && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-950/20 text-emerald-400 text-sm border border-emerald-500/20">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{info}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#C5C6C7]/80 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0C10] border border-[#45A29E]/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] transition-colors placeholder-[#C5C6C7]/30"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#C5C6C7]/80 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B0C10] border border-[#45A29E]/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] transition-colors placeholder-[#C5C6C7]/30"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-[#C5C6C7]/80 uppercase tracking-wider">Password</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-[#66FCF1] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0C10] border border-[#45A29E]/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#66FCF1]/20 focus:border-[#66FCF1] transition-colors placeholder-[#C5C6C7]/30"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#66FCF1] hover:bg-[#45A29E] disabled:bg-[#45A29E]/40 text-[#0B0C10] font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#66FCF1] focus:ring-offset-2"
          >
            <span>{loading ? "Processing..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#45A29E]/20"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1F2833] px-3 text-[#C5C6C7]/60 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          id="auth-google-btn"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B0C10] hover:bg-[#1F2833] text-white font-medium border border-[#45A29E]/30 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.37 1 3.4 3.66 1.45 7.55l3.77 2.92C6.12 7.11 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.65 2.83c2.13-1.97 3.37-4.87 3.37-8.5z"
            />
            <path
              fill="#FBBC05"
              d="M5.22 14.77c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.45 7.31C.52 9.17 0 11.26 0 13.5s.52 4.33 1.45 6.19l3.77-2.92z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.3 1.08-4.31 1.08-3.16 0-5.88-2.07-6.78-5.43l-3.77 2.92C3.4 20.34 7.37 23 12 23z"
            />
          </svg>
          Google One-Tap Login (Demo)
        </button>

        <div className="text-center mt-6">
          {mode === "login" ? (
            <p className="text-sm text-[#C5C6C7]/80">
              Don't have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-[#66FCF1] font-semibold hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-sm text-[#C5C6C7]/80">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-[#66FCF1] font-semibold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
