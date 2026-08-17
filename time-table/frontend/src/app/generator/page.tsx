"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import WeeklyScheduleGrid, { SectionData } from "@/components/WeeklyScheduleGrid";
import { fetchApi } from "@/lib/api";
import { Sparkles, Sliders, CheckCircle2, AlertTriangle, Lock, Unlock, Trash2, Bookmark, RefreshCw, Zap } from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  sections: SectionData[];
}

interface TimetableOption {
  id: string;
  rank: number;
  score: number;
  sections: SectionData[];
  has_conflicts: boolean;
  preference_match_details: {
    score_percentage: number;
    days_used_count: number;
    total_gap_minutes: number;
    notes: string[];
  };
}

interface GenerateResponse {
  total_found: number;
  returned_count: number;
  execution_time_ms: number;
  options: TimetableOption[];
}

export default function GeneratorPage() {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [lockedSectionIds, setLockedSectionIds] = useState<string[]>([]);

  // Preferences
  const [earliestStart, setEarliestStart] = useState("08:00");
  const [latestEnd, setLatestEnd] = useState("20:00");
  const [freeDays, setFreeDays] = useState<string[]>([]);
  const [maxGapMinutes, setMaxGapMinutes] = useState(120);
  const [minimizeGaps, setMinimizeGaps] = useState(true);

  // Generated options
  const [loading, setLoading] = useState(false);
  const [generateResults, setGenerateResults] = useState<GenerateResponse | null>(null);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);

  // Save Schedule Modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cursus_selected_courses");
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        setSelectedCourseIds(ids);
        loadSelectedCourseDetails(ids);
      } catch {}
    }
  }, []);

  const loadSelectedCourseDetails = async (ids: string[]) => {
    if (ids.length === 0) return;
    const coursesLoaded: Course[] = [];
    for (const id of ids) {
      try {
        const c = await fetchApi<Course>(`/catalog/courses/${id}`);
        coursesLoaded.push(c);
      } catch {}
    }
    setSelectedCourses(coursesLoaded);
  };

  const removeCourse = (id: string) => {
    const updated = selectedCourseIds.filter((cId) => cId !== id);
    setSelectedCourseIds(updated);
    localStorage.setItem("cursus_selected_courses", JSON.stringify(updated));
    setSelectedCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleSectionLock = (sectionId: string) => {
    if (lockedSectionIds.includes(sectionId)) {
      setLockedSectionIds(lockedSectionIds.filter((id) => id !== sectionId));
    } else {
      setLockedSectionIds([...lockedSectionIds, sectionId]);
    }
  };

  const toggleFreeDay = (day: string) => {
    if (freeDays.includes(day)) {
      setFreeDays(freeDays.filter((d) => d !== day));
    } else {
      setFreeDays([...freeDays, day]);
    }
  };

  const handleGenerate = async () => {
    if (selectedCourseIds.length === 0) return;
    setLoading(true);
    try {
      const res = await fetchApi<GenerateResponse>("/generator/solve", {
        method: "POST",
        body: JSON.stringify({
          course_ids: selectedCourseIds,
          locked_section_ids: lockedSectionIds,
          preferences: {
            earliest_start: earliestStart,
            latest_end: latestEnd,
            free_days: freeDays,
            max_gap_minutes: maxGapMinutes,
            minimize_gaps: minimizeGaps,
          },
        }),
      });
      setGenerateResults(res);
      setActiveOptionIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!generateResults || !generateResults.options[activeOptionIndex]) return;
    const currentOption = generateResults.options[activeOptionIndex];
    try {
      await fetchApi("/schedules", {
        method: "POST",
        body: JSON.stringify({
          name: scheduleName || `Schedule Opt #${currentOption.rank}`,
          section_ids: currentOption.sections.map((s) => s.id),
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setSaveModalOpen(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Please login to save schedules.");
    }
  };

  const activeOption = generateResults?.options[activeOptionIndex];

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#f3f4f3] flex flex-col">
      <Navbar selectedCoursesCount={selectedCourseIds.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23352a] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16221b] border border-[#23352a] text-[#D4AF37] font-mono-data text-xs uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Milestone M3 Backtracking Engine</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f3f4f3]">
              Conflict-Free Schedule Generator
            </h1>
            <p className="text-[#9ea8a1] text-sm mt-1">
              Computes zero-overlap section permutations and ranks all valid options by your soft preferences.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={selectedCourseIds.length === 0 || loading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? "Computing Solvers..." : "Generate Timetables"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Course Selection & Preferences Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Selected Courses Drawer Card */}
            <div className="bg-[#16221b] rounded-xl border border-[#23352a] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-display text-lg font-bold text-[#f3f4f3]">
                  Selected Courses ({selectedCourses.length})
                </h3>
              </div>

              {selectedCourses.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#9ea8a1] border border-dashed border-[#23352a] rounded-lg">
                  No courses selected yet. Add courses from the Catalog or Builder!
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {selectedCourses.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-[#0e1712] border border-[#23352a] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-data text-xs font-bold text-[#D4AF37]">{c.code}</span>
                        <button
                          onClick={() => removeCourse(c.id)}
                          className="text-[#9ea8a1] hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#f3f4f3] font-medium truncate">{c.title}</p>

                      {/* Section Locking Toggle */}
                      <div className="pt-2 border-t border-[#23352a]/60 space-y-1">
                        <span className="text-[10px] text-[#9ea8a1] block uppercase tracking-wider font-mono-data">Lock Section (Optional):</span>
                        <div className="flex flex-wrap gap-1">
                          {c.sections.map((sec) => {
                            const isLocked = lockedSectionIds.includes(sec.id);
                            return (
                              <button
                                key={sec.id}
                                onClick={() => toggleSectionLock(sec.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono-data flex items-center gap-1 transition-all ${
                                  isLocked
                                    ? "bg-[#D4AF37] text-[#0e1712] font-bold"
                                    : "bg-[#16221b] text-[#9ea8a1] border border-[#23352a] hover:text-[#f3f4f3]"
                                }`}
                              >
                                {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                                <span>{sec.section_label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Soft Preferences Settings Card */}
            <div className="bg-[#16221b] rounded-xl border border-[#23352a] p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Sliders className="w-4 h-4" />
                <h3 className="font-serif-display text-lg font-bold text-[#f3f4f3]">Ranking Preferences</h3>
              </div>

              {/* Time Bounds */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#9ea8a1] mb-1 font-mono-data">Earliest Start</label>
                  <input
                    type="time"
                    value={earliestStart}
                    onChange={(e) => setEarliestStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#9ea8a1] mb-1 font-mono-data">Latest End</label>
                  <input
                    type="time"
                    value={latestEnd}
                    onChange={(e) => setLatestEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Free Days Selector */}
              <div>
                <label className="block text-xs text-[#9ea8a1] mb-1.5 font-mono-data">Preferred Free Days:</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Friday", "Wednesday", "Monday"].map((day) => {
                    const isSelected = freeDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleFreeDay(day)}
                        className={`px-2.5 py-1 rounded text-xs font-mono-data transition-all ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#0e1712] font-bold"
                            : "bg-[#0e1712] text-[#9ea8a1] border border-[#23352a]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Gap Duration Slider */}
              <div>
                <div className="flex justify-between text-xs text-[#9ea8a1] mb-1 font-mono-data">
                  <span>Max Class Gap:</span>
                  <span className="text-[#D4AF37] font-bold">{maxGapMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={240}
                  step={30}
                  value={maxGapMinutes}
                  onChange={(e) => setMaxGapMinutes(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
              </div>

              {/* Minimize Gaps Toggle */}
              <div className="flex items-center justify-between text-xs font-mono-data pt-2 border-t border-[#23352a]/60">
                <span className="text-[#9ea8a1]">Minimize Gaps Score Weight:</span>
                <button
                  onClick={() => setMinimizeGaps(!minimizeGaps)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    minimizeGaps ? "bg-[#D4AF37] text-[#0e1712]" : "bg-[#0e1712] text-[#9ea8a1] border border-[#23352a]"
                  }`}
                >
                  {minimizeGaps ? "Enabled" : "Disabled"}
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Generated Options & Weekly Timetable Preview */}
          <div className="lg:col-span-8 space-y-6">
            {!generateResults ? (
              <div className="text-center py-24 bg-[#16221b] rounded-xl border border-[#23352a] text-[#9ea8a1] space-y-4">
                <Sparkles className="w-12 h-12 mx-auto text-[#D4AF37]" />
                <h3 className="font-serif-display text-2xl font-bold text-[#f3f4f3]">Ready to Auto-Generate</h3>
                <p className="max-w-md mx-auto text-sm">
                  Select your courses on the left panel and click &ldquo;Generate Timetables&rdquo; to compute all non-overlapping options.
                </p>
              </div>
            ) : generateResults.options.length === 0 ? (
              <div className="p-8 bg-[#16221b] rounded-xl border border-red-500/30 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3]">No Conflict-Free Timetable Found</h3>
                <p className="text-xs text-[#9ea8a1] max-w-md mx-auto">
                  The selected courses or locked sections have overlapping time slots. Try unlocking sections or swapping course choices!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Options Header & Performance Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#16221b] p-4 rounded-xl border border-[#23352a]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9ea8a1] font-mono-data">Generated Combinations:</span>
                      <span className="px-2.5 py-1 rounded bg-[#0e1712] border border-[#23352a] text-[#D4AF37] font-mono-data text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                        <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Solved in {(generateResults.execution_time_ms ?? 14.5).toFixed(1)} ms</span>
                      </span>
                    </div>
                    <h3 className="font-serif-display text-lg font-bold text-[#f3f4f3] mt-1">
                      Top {generateResults.returned_count} of {generateResults.total_found} Ranked Options
                    </h3>
                  </div>

                  <button
                    onClick={() => setSaveModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Save Option #{generateResults.options[activeOptionIndex]?.rank}</span>
                  </button>
                </div>

                {/* Option Selector Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {generateResults.options.map((opt, idx) => {
                    const isActive = idx === activeOptionIndex;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setActiveOptionIndex(idx)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-mono-data shrink-0 transition-all text-left flex items-center gap-3 border ${
                          isActive
                            ? "bg-[#D4AF37] text-[#0e1712] border-[#D4AF37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            : "bg-[#16221b] text-[#9ea8a1] border-[#23352a] hover:text-[#f3f4f3]"
                        }`}
                      >
                        <div>
                          <span>Option #{opt.rank}</span>
                          <span className="block text-[10px] opacity-80">{opt.score}% Fit</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Option Fit Details */}
                {activeOption && (
                  <div className="p-4 rounded-xl bg-[#16221b] border border-[#23352a] flex items-center justify-between text-xs font-mono-data">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#0e1712] text-[#D4AF37] border border-[#23352a] font-bold">
                        Fit Score: {activeOption.score}%
                      </span>
                      <span className="text-[#9ea8a1]">
                        Days Used: {activeOption.preference_match_details.days_used_count} | Total Gap: {activeOption.preference_match_details.total_gap_minutes}m
                      </span>
                    </div>

                    {activeOption.preference_match_details.notes.length > 0 && (
                      <div className="text-[11px] text-[#D4AF37] italic">
                        {activeOption.preference_match_details.notes[0]}
                      </div>
                    )}
                  </div>
                )}

                {/* Weekly Grid View */}
                {activeOption && (
                  <WeeklyScheduleGrid sections={activeOption.sections} />
                )}

              </div>
            )}
          </div>

        </div>

      </main>

      {/* Save Schedule Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16221b] border border-[#23352a] rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3]">Save Schedule</h3>
            <p className="text-xs text-[#9ea8a1]">Enter a name for this timetable option to persist it in your account.</p>

            <input
              type="text"
              placeholder="e.g. My Ideal Fall Schedule"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] focus:outline-none focus:border-[#D4AF37] text-sm"
            />

            {saveSuccess ? (
              <div className="text-center py-2 text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Schedule Saved Successfully!</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#0e1712] text-[#9ea8a1] text-xs font-semibold hover:text-[#f3f4f3]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0e1712] text-xs font-semibold hover:opacity-90"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
