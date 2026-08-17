"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";
import { Search, Filter, BookOpen, User, Clock, MapPin, Plus, Check, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

interface TimeSlot {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  room?: string;
}

interface Section {
  id: string;
  course_id: string;
  section_label: string;
  instructor?: string;
  time_slots: TimeSlot[];
}

interface Course {
  id: string;
  code: string;
  title: string;
  department?: string;
  sections: Section[];
}

interface CourseListResponse {
  total: number;
  page: number;
  limit: number;
  courses: Course[];
}

export default function CatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  // Selected courses for timetable generator
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    // Load stored selected course IDs from localStorage
    const saved = localStorage.getItem("cursus_selected_courses");
    if (saved) {
      try {
        setSelectedCourseIds(JSON.parse(saved));
      } catch {}
    }

    // Load department dropdown list
    fetchApi<string[]>("/catalog/departments")
      .then(setDepartments)
      .catch(() => {});
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (selectedDept) queryParams.set("department", selectedDept);
      if (selectedDay) queryParams.set("day", selectedDay);

      const data = await fetchApi<CourseListResponse>(`/catalog/courses?${queryParams.toString()}`);
      setCourses(data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCourses();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedDept, selectedDay]);

  const toggleCourseSelection = (courseId: string) => {
    let updated: string[];
    if (selectedCourseIds.includes(courseId)) {
      updated = selectedCourseIds.filter((id) => id !== courseId);
    } else {
      updated = [...selectedCourseIds, courseId];
    }
    setSelectedCourseIds(updated);
    localStorage.setItem("cursus_selected_courses", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#f3f4f3] flex flex-col">
      <Navbar selectedCoursesCount={selectedCourseIds.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23352a] pb-6">
          <div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f3f4f3]">
              Course Catalog & Sections
            </h1>
            <p className="text-[#9ea8a1] text-sm mt-1">
              Search courses, inspect section times/rooms, and add courses to your schedule generator list.
            </p>
          </div>

          <Link
            href="/generator"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] font-semibold text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:opacity-90 transition-all self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Schedule ({selectedCourseIds.length})</span>
          </Link>
        </div>

        {/* Search Bar & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#16221b] p-4 rounded-xl border border-[#23352a]">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ea8a1]" />
            <input
              type="text"
              placeholder="Search by course code or title (e.g. CS101, Calculus)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] placeholder-[#9ea8a1] focus:outline-none focus:border-[#D4AF37] text-sm"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] focus:outline-none focus:border-[#D4AF37] text-sm"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1712] border border-[#23352a] text-[#f3f4f3] focus:outline-none focus:border-[#D4AF37] text-sm"
            >
              <option value="">All Days</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#9ea8a1] space-y-3">
            <BookOpen className="w-8 h-8 mx-auto animate-pulse text-[#D4AF37]" />
            <p className="font-mono-data text-sm">Loading course database...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-[#16221b] rounded-xl border border-[#23352a] text-[#9ea8a1] space-y-3">
            <Filter className="w-8 h-8 mx-auto text-[#9ea8a1]" />
            <h3 className="font-serif-display text-lg font-bold text-[#f3f4f3]">No Courses Found</h3>
            <p className="text-sm">Try broadening your search term or department filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => {
              const isSelected = selectedCourseIds.includes(course.id);

              return (
                <div
                  key={course.id}
                  className={`bg-[#16221b] rounded-xl border transition-all p-6 flex flex-col justify-between space-y-4 shadow-lg ${
                    isSelected ? "border-[#D4AF37] gold-glow" : "border-[#23352a] hover:border-[#D4AF37]/50"
                  }`}
                >
                  {/* Course Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded bg-[#0e1712] border border-[#23352a] text-[#D4AF37] font-mono-data font-bold text-xs uppercase tracking-wider mb-2">
                          {course.code}
                        </span>
                        <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3] leading-snug">
                          {course.title}
                        </h3>
                        {course.department && (
                          <p className="text-xs text-[#9ea8a1] font-mono-data mt-1">{course.department}</p>
                        )}
                      </div>

                      {/* Add to List Button */}
                      <button
                        onClick={() => toggleCourseSelection(course.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                          isSelected
                            ? "bg-[#D4AF37] text-[#0e1712]"
                            : "bg-[#0e1712] text-[#f3f4f3] border border-[#23352a] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add Course</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Section Count Badge */}
                    <div className="mt-4 pt-3 border-t border-[#23352a] flex items-center justify-between text-xs text-[#9ea8a1]">
                      <span>{course.sections.length} Section{course.sections.length > 1 ? "s" : ""} Available</span>
                    </div>
                  </div>

                  {/* Section List Cards */}
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {course.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-3 rounded-lg bg-[#0e1712] border border-[#23352a]/80 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-mono-data">
                          <span className="font-bold text-[#D4AF37]">{sec.section_label}</span>
                          {sec.instructor && (
                            <span className="text-[#9ea8a1] flex items-center gap-1">
                              <User className="w-3 h-3 text-[#D4AF37]" />
                              {sec.instructor}
                            </span>
                          )}
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-1 pt-1 border-t border-[#23352a]/40 text-[#9ea8a1] font-mono-data">
                          {sec.time_slots.map((slot) => (
                            <div key={slot.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-[#D4AF37]" />
                                <span className="font-semibold text-[#f3f4f3]">{slot.day}:</span>
                                <span>{slot.start_time} - {slot.end_time}</span>
                              </div>
                              {slot.room && (
                                <span className="flex items-center gap-1 text-[11px]">
                                  <MapPin className="w-3 h-3 text-[#9ea8a1]" />
                                  {slot.room}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
