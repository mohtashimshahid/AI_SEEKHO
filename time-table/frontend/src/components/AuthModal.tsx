"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { X, Lock, Mail, User as UserIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
      }

      // Login sets HttpOnly JWT session cookie in browser
      const loginRes = await fetchApi<{ user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      onSuccess(loginRes.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#16221b] border border-[#23352a] rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#0e1712] text-[#9ea8a1] hover:text-[#f3f4f3] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-[#f3f4f3]">
            {isRegister ? "Create Cursus Account" : "Sign In to Cursus"}
          </h2>
          <p className="text-xs text-[#9ea8a1] mt-1">
            {isRegister
              ? "Register to save custom timetables, sync calendar .ics, and manage schedule backups."
              : "Access your saved timetables, custom locks, and exported calendars."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/80 text-red-200 text-xs flex items-center gap-2 font-mono-data">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-mono-data text-[#9ea8a1] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[#9ea8a1]" />
                <input
                  type="text"
                  required
                  placeholder="Jane Student"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono-data text-[#9ea8a1] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#9ea8a1]" />
              <input
                type="email"
                required
                placeholder="student@univ.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-data text-[#9ea8a1] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[#9ea8a1]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] font-semibold text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:opacity-90 transition-all"
          >
            {loading ? "Authenticating..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-[#9ea8a1] pt-2 border-t border-[#23352a]/60">
          <span>{isRegister ? "Already have an account?" : "Don't have an account?"}</span>{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#D4AF37] font-semibold hover:underline"
          >
            {isRegister ? "Sign In" : "Register Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
