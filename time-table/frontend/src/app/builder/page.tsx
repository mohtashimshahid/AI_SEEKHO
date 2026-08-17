"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import WeeklyScheduleGrid, { SectionData } from "@/components/WeeklyScheduleGrid";
import { fetchApi } from "@/lib/api";
import { Wrench, AlertTriangle, CheckCircle2, Trash2, Plus, Bookmark, RefreshCw, Calendar, MapPin, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  code: string;
  title: string;
  department?: string;
  sections: SectionData[];
}

interface ConflictDetail {
  section1_id: string;
  section1_label: string;
  course1_code: string;
  section2_id: string;
  section2_label: string;
  course2_code: string;
  day: string;
  overlap_start: string;
  overlap_end: string;
  message: string;
}

interface ConflictCheckResponse {
  has_conflicts: boolean;
  conflicting_section_ids: string[];
  conflicts: ConflictDetail[];
}

export default function BuilderPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // Manually selected section IDs: courseId -> sectionId
  const [manuallySelectedSections, setManuallySelectedSections] = useState<Record<string, string>>({});

  // Conflict state
  const [conflictReport, setConflictReport] = useState<ConflictCheckResponse | null>(null);

  // Save Modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadAllCourses();
  }, []);

  const loadAllCourses = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<{ courses: Course[] }>("/catalog/courses?limit=100");
      setCourses(res.courses);

      // Default select first 4 courses for quick demo
      const initialCourses = res.courses.slice(0, 4);
      const initialIds = initialCourses.map((c) => c.id);
      setSelectedCourseIds(initialIds);
      setSelectedCourses(initialCourses);

      // Default select section 0 for each course
      const initialSections: Record<string, string> = {};
      initialCourses.forEach((c) => {
        if (c.sections.length > 0) {
          initialSections[c.id] = c.sections[0].id;
        }
      });
      setManuallySelectedSections(initialSections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run Conflict Detection whenever selected sections change
  useEffect(() => {
    const activeSectionIds = Object.values(manuallySelectedSections);
    if (activeSectionIds.length === 0) {
      setConflictReport(null);
      return;
    }

    fetchApi<ConflictCheckResponse>("/generator/detect-conflicts", {
      method: "POST",
      body: JSON.stringify({ section_ids: activeSectionIds }),
    })
      .then(setConflictReport)
      .catch((err) => console.error(err));
  }, [manuallySelectedSections]);

  const toggleCourseSelection = (course: Course) => {
    if (selectedCourseIds.includes(course.id)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== course.id));
      setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
      const updatedSecs = { ...manuallySelectedSections };
      delete updatedSecs[course.id];
      setManuallySelectedSections(updatedSecs);
    } else {
      setSelectedCourseIds([...selectedCourseIds, course.id]);
      setSelectedCourses([...selectedCourses, course]);
      if (course.sections.length > 0) {
        setManuallySelectedSections({
          ...manuallySelectedSections,
          [course.id]: course.sections[0].id,
        });
      }
    }
  };

  const selectSectionForCourse = (courseId: string, sectionId: string) => {
    setManuallySelectedSections({
      ...manuallySelectedSections,
      [courseId]: sectionId,
    });
  };

  // Build section objects for Weekly Grid preview
  const gridSections = selectedCourses
    .map((c) => {
      const selectedSecId = manuallySelectedSections[c.id];
      const sec = c.sections.find((s) => s.id === selectedSecId);
      if (!sec) return null;
      return {
        ...sec,
        course_code: c.code,
        course_title: c.title,
      };
    })
    .filter(Boolean) as SectionData[];

  const handleSaveSchedule = async () => {
    const sectionIds = Object.values(manuallySelectedSections);
    if (sectionIds.length === 0) return;
    try {
      await fetchApi("/schedules", {
        method: "POST",
        body: JSON.stringify({
          name: scheduleName || "Manual Custom Schedule",
          section_ids: sectionIds,
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

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#f3f4f3] flex flex-col">
      <Navbar selectedCoursesCount={selectedCourseIds.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23352a] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16221b] border border-[#23352a] text-[#D4AF37] font-mono-data text-xs uppercase tracking-wider mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Milestone M2 Feature</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f3f4f3]">
              Manual Schedule Builder & Conflict Detector
            </h1>
            <p className="text-[#9ea8a1] text-sm mt-1">
              Select specific sections for your courses, test section swaps, and get instant visual conflict detection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSaveModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] font-semibold text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save Manual Schedule</span>
            </button>
          </div>
        </div>

        {/* Real-Time Conflict Warning Banner */}
        {conflictReport?.has_conflicts && (
          <div className="p-5 rounded-xl bg-red-950/60 border-2 border-red-500/80 text-red-200 space-y-3 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
              <h3 className="font-serif-display text-lg font-bold">
                Time Conflict Detected ({conflictReport.conflicts.length})
              </h3>
            </div>

            <ul className="space-y-1.5 font-mono-data text-xs pl-9">
              {conflictReport.conflicts.map((conf, idx) => (
                <li key={idx} className="list-disc text-red-300">
                  {conf.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Course & Section Selector */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#16221b] rounded-xl border border-[#23352a] p-5 space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-[#f3f4f3]">
                Course & Section Selector
              </h3>
              <p className="text-xs text-[#9ea8a1]">
                Pick your courses below and choose a specific section for each.
              </p>

              {loading ? (
                <div className="text-center py-8 text-xs text-[#9ea8a1]">Loading courses...</div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {courses.map((course) => {
                    const isCourseSelected = selectedCourseIds.includes(course.id);
                    const activeSectionId = manuallySelectedSections[course.id];

                    return (
                      <div
                        key={course.id}
                        className={`p-4 rounded-xl border transition-all space-y-3 ${
                          isCourseSelected ? "bg-[#0e1712] border-[#D4AF37]" : "bg-[#0e1712]/50 border-[#23352a]"
                        }`}
                      >
                        {/* Course Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono-data text-xs font-bold text-[#D4AF37] block">
                              {course.code}
                            </span>
                            <span className="text-xs text-[#f3f4f3] font-medium block truncate max-w-[180px]">
                              {course.title}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleCourseSelection(course)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                              isCourseSelected
                                ? "bg-[#D4AF37] text-[#0e1712]"
                                : "bg-[#16221b] text-[#9ea8a1] border border-[#23352a] hover:text-[#f3f4f3]"
                            }`}
                          >
                            {isCourseSelected ? <Trash2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{isCourseSelected ? "Remove" : "Select"}</span>
                          </button>
                        </div>

                        {/* Section Selection Radio Pills */}
                        {isCourseSelected && (
                          <div className="pt-2 border-t border-[#23352a]/60 space-y-2">
                            <span className="text-[10px] uppercase font-mono-data text-[#9ea8a1] block">
                              Choose Section:
                            </span>

                            <div className="space-y-1.5">
                              {course.sections.map((sec) => {
                                const isSecSelected = activeSectionId === sec.id;
                                const isConflictingSec = conflictReport?.conflicting_section_ids.includes(sec.id);

                                return (
                                  <div
                                    key={sec.id}
                                    onClick={() => selectSectionForCourse(course.id, sec.id)}
                                    className={`p-2.5 rounded-lg border text-xs font-mono-data cursor-pointer transition-all ${
                                      isSecSelected
                                        ? isConflictingSec
                                          ? "bg-red-950/80 border-red-500 text-red-200 font-bold"
                                          : "bg-[#16221b] border-[#D4AF37] text-[#D4AF37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                                        : "bg-[#0e1712] border-[#23352a] text-[#9ea8a1] hover:text-[#f3f4f3]"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${isSecSelected ? (isConflictingSec ? "bg-red-500" : "bg-[#D4AF37]") : "bg-[#23352a]"}`} />
                                        <span>{sec.section_label}</span>
                                      </span>
                                      {sec.instructor && (
                                        <span className="text-[10px] text-[#9ea8a1]">{sec.instructor}</span>
                                      )}
                                    </div>

                                    {/* Time Slots */}
                                    <div className="mt-1 text-[10px] text-[#9ea8a1] space-y-0.5 pl-3 border-l border-[#23352a]">
                                      {sec.time_slots.map((t) => (
                                        <div key={t.id}>
                                          {t.day}: {t.start_time} - {t.end_time} ({t.room || "TBD"})
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Weekly Timetable Preview with Conflict Highlighting */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Status Indicator */}
            <div className="flex items-center justify-between bg-[#16221b] p-4 rounded-xl border border-[#23352a] text-xs font-mono-data">
              <div className="flex items-center gap-2">
                <span>Selected Sections: {gridSections.length}</span>
              </div>

              <div>
                {conflictReport?.has_conflicts ? (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Conflicts Present</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Schedule Clear & Conflict-Free</span>
                  </span>
                )}
              </div>
            </div>

            {/* Weekly Schedule Grid */}
            <WeeklyScheduleGrid
              sections={gridSections}
              conflictingSectionIds={conflictReport?.conflicting_section_ids || []}
            />

          </div>

        </div>

      </main>

      {/* Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16221b] border border-[#23352a] rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3]">Save Manual Schedule</h3>
            <p className="text-xs text-[#9ea8a1]">Enter a name for this custom manual timetable.</p>

            <input
              type="text"
              placeholder="e.g. Manual Schedule Fall 2026"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] focus:outline-none focus:border-[#D4AF37] text-sm"
            />

            {saveSuccess ? (
              <div className="text-center py-2 text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Manual Schedule Saved!</span>
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
