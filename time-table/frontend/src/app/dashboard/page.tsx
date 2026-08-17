"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import WeeklyScheduleGrid, { SectionData } from "@/components/WeeklyScheduleGrid";
import { fetchApi } from "@/lib/api";
import { Bookmark, Download, Image as ImageIcon, FileText, Trash2, Calendar, Lock, Sparkles, UserCheck, AlertCircle } from "lucide-react";
import html2canvas from "html2canvas";

interface SavedSchedule {
  id: string;
  name: string;
  section_ids: string[];
  sections: SectionData[];
  created_at: string;
}

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<SavedSchedule[]>([]);
  const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSavedSchedules();
  }, []);

  const loadSavedSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<SavedSchedule[]>("/schedules");
      setSchedules(data);
      setActiveScheduleIndex(0);
    } catch (err: any) {
      setError(err.message || "Please sign in to view your saved schedules.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved schedule?")) return;
    try {
      await fetchApi(`/schedules/${id}`, { method: "DELETE" });
      const updated = schedules.filter((s) => s.id !== id);
      setSchedules(updated);
      if (activeScheduleIndex >= updated.length) {
        setActiveScheduleIndex(Math.max(0, updated.length - 1));
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete schedule.");
    }
  };

  const activeSchedule = schedules[activeScheduleIndex];

  // Export RFC 5545 .ics Calendar
  const handleExportICS = async () => {
    if (!activeSchedule) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/schedules/${activeSchedule.id}/export/ics`, {
        headers: {
          "Accept": "text/calendar",
        },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeSchedule.name.replace(/\s+/g, "_")}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to export .ics calendar file.");
    }
  };

  // Export PNG High-Res Image
  const handleExportPNG = async () => {
    if (!gridRef.current || !activeSchedule) return;
    try {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: "#0e1712",
        scale: 2, // High DPI resolution
      });
      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `${activeSchedule.name.replace(/\s+/g, "_")}_schedule.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to export PNG image.");
    }
  };

  // Export PDF Document
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#f3f4f3] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23352a] pb-6 print:hidden">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16221b] border border-[#23352a] text-[#D4AF37] font-mono-data text-xs uppercase tracking-wider mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Milestone M4 Dashboard & Exporter</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f3f4f3]">
              Saved Schedules & Exporter
            </h1>
            <p className="text-[#9ea8a1] text-sm mt-1">
              Manage your saved timetables and export them as .ics calendar files, PNG images, or PDF documents.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        {loading ? (
          <div className="text-center py-20 text-xs text-[#9ea8a1] font-mono-data">
            Loading your saved schedules...
          </div>
        ) : error ? (
          <div className="p-8 bg-[#16221b] border border-[#23352a] rounded-xl text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif-display text-xl font-bold">Authentication Required</h3>
            <p className="text-xs text-[#9ea8a1]">{error}</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-20 bg-[#16221b] rounded-xl border border-[#23352a] text-[#9ea8a1] space-y-4">
            <Bookmark className="w-12 h-12 mx-auto text-[#D4AF37]" />
            <h3 className="font-serif-display text-2xl font-bold text-[#f3f4f3]">No Saved Schedules Yet</h3>
            <p className="max-w-md mx-auto text-sm">
              Save your generated options from the Auto-Generator or Manual Builder to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Saved Schedules List */}
            <div className="lg:col-span-4 space-y-4 print:hidden">
              <h3 className="font-serif-display text-lg font-bold text-[#f3f4f3] flex items-center justify-between">
                <span>Your Schedules</span>
                <span className="text-xs font-mono-data text-[#D4AF37]">({schedules.length})</span>
              </h3>

              <div className="space-y-3">
                {schedules.map((sched, idx) => {
                  const isActive = idx === activeScheduleIndex;
                  return (
                    <div
                      key={sched.id}
                      onClick={() => setActiveScheduleIndex(idx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                        isActive
                          ? "bg-[#16221b] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                          : "bg-[#0e1712] border-[#23352a] hover:border-[#9ea8a1]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif-display font-bold text-sm text-[#f3f4f3] truncate">
                          {sched.name}
                        </h4>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSchedule(sched.id);
                          }}
                          className="text-[#9ea8a1] hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono-data text-[#9ea8a1]">
                        <span>{sched.sections.length} Sections</span>
                        <span>{new Date(sched.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Schedule Grid Preview & Exporter Controls */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Exporter Controls Header */}
              {activeSchedule && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16221b] p-4 rounded-xl border border-[#23352a] print:hidden">
                  <div>
                    <h2 className="font-serif-display text-xl font-bold text-[#f3f4f3]">
                      {activeSchedule.name}
                    </h2>
                    <span className="text-xs font-mono-data text-[#9ea8a1]">
                      Created {new Date(activeSchedule.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleExportICS}
                      className="px-3 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono-data flex items-center gap-1.5 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>.ICS Calendar</span>
                    </button>

                    <button
                      onClick={handleExportPNG}
                      className="px-3 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono-data flex items-center gap-1.5 transition-all"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>PNG Image</span>
                    </button>

                    <button
                      onClick={handleExportPDF}
                      className="px-3 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono-data flex items-center gap-1.5 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Weekly Timetable Grid Node */}
              {activeSchedule && (
                <div ref={gridRef} className="bg-[#0e1712] p-2 rounded-xl">
                  <WeeklyScheduleGrid sections={activeSchedule.sections} />
                </div>
              )}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
