"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calendar, Compass, Bookmark, Upload, Wrench, User as UserIcon, LogOut } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { fetchApi } from "@/lib/api";

interface NavbarProps {
  selectedCoursesCount?: number;
}

export default function Navbar({ selectedCoursesCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await fetchApi<{ id: string; email: string; full_name?: string }>("/auth/me");
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchApi("/auth/logout", { method: "POST" });
      setCurrentUser(null);
      window.location.reload();
    } catch {}
  };

  const navLinks = [
    { name: "Course Catalog", href: "/catalog", icon: Compass },
    { name: "Manual Builder", href: "/builder", icon: Wrench },
    { name: "Auto-Generator", href: "/generator", icon: Calendar, badge: selectedCoursesCount },
    { name: "Saved Schedules", href: "/dashboard", icon: Bookmark },
    { name: "Admin Ingestion", href: "/admin/ingestion", icon: Upload },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0e1712]/90 backdrop-blur-md border-b border-[#23352a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#7a6520] flex items-center justify-center text-[#0e1712] shadow-lg group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all">
              <BookOpen className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-[#f3f4f3] group-hover:text-[#D4AF37] transition-colors">
                Cursus
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#9ea8a1] font-mono-data">
                Timetable Builder
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2 transition-all relative ${
                    isActive
                      ? "bg-[#16221b] text-[#D4AF37] border border-[rgba(212,175,55,0.3)] shadow-[0_0_10px_rgba(212,175,55,0.1)] font-bold"
                      : "text-[#9ea8a1] hover:text-[#f3f4f3] hover:bg-[#16221b]/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono-data rounded-full bg-[#D4AF37] text-[#0e1712] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-data text-[#D4AF37] hidden sm:inline">
                  {currentUser.full_name || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-[#16221b] border border-[#23352a] text-[#9ea8a1] hover:text-red-400 transition-all flex items-center gap-1.5 text-xs font-mono-data"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] hover:opacity-90 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
}
