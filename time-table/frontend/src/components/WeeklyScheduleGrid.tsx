"use client";

import { useMemo } from "react";
import { Clock, MapPin, User as UserIcon, AlertTriangle } from "lucide-react";

export interface TimeSlotData {
  id: string;
  section_id: string;
  day: string;
  start_time: string;
  end_time: string;
  room?: string;
}

export interface SectionData {
  id: string;
  course_id: string;
  section_label: string;
  instructor?: string;
  course_code?: string;
  course_title?: string;
  time_slots: TimeSlotData[];
}

interface WeeklyScheduleGridProps {
  sections: SectionData[];
  conflictingSectionIds?: string[];
  onRemoveSection?: (sectionId: string) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const START_HOUR = 8; // 8:00 AM
const END_HOUR = 20; // 8:00 PM
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const COURSE_COLORS = [
  { bg: "bg-[#1f382b]", border: "border-[#D4AF37]", text: "text-[#D4AF37]" },
  { bg: "bg-[#2d2217]", border: "border-[#e09b53]", text: "text-[#e09b53]" },
  { bg: "bg-[#182a38]", border: "border-[#5bb0e6]", text: "text-[#5bb0e6]" },
  { bg: "bg-[#331c2d]", border: "border-[#e06ab7]", text: "text-[#e06ab7]" },
  { bg: "bg-[#2b2b1a]", border: "border-[#d1d149]", text: "text-[#d1d149]" },
];

export default function WeeklyScheduleGrid({ sections, conflictingSectionIds = [] }: WeeklyScheduleGridProps) {
  const courseColorMap = useMemo(() => {
    const map = new Map<string, number>();
    let colorIdx = 0;
    sections.forEach((sec) => {
      const code = sec.course_code || sec.course_id;
      if (!map.has(code)) {
        map.set(code, colorIdx % COURSE_COLORS.length);
        colorIdx++;
      }
    });
    return map;
  }, [sections]);

  const timeToMinutes = (t: string) => {
    const parts = t.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const conflictSet = useMemo(() => new Set(conflictingSectionIds), [conflictingSectionIds]);

  return (
    <div className="w-full bg-[#16221b] border border-[#23352a] rounded-xl overflow-hidden shadow-2xl">
      {/* Grid Header Days */}
      <div className="grid grid-cols-8 border-b border-[#23352a] bg-[#0e1712] text-xs font-mono-data uppercase tracking-wider text-[#9ea8a1]">
        <div className="p-3 text-center border-r border-[#23352a]">Time</div>
        {DAYS.map((day) => (
          <div key={day} className="p-3 text-center border-r border-[#23352a] last:border-r-0 font-bold text-[#f3f4f3]">
            {day.substring(0, 3)}
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="relative grid grid-cols-8 divide-x divide-[#23352a]/60">
        {/* Time Sidebar */}
        <div className="divide-y divide-[#23352a]/40 bg-[#0e1712]/50 text-xs font-mono-data text-[#9ea8a1]">
          {HOURS.map((hr) => (
            <div key={hr} className="h-16 p-2 text-right flex items-start justify-end">
              {`${hr.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {DAYS.map((day) => {
          const daySlots: { slot: TimeSlotData; section: SectionData }[] = [];
          sections.forEach((sec) => {
            sec.time_slots.forEach((slot) => {
              if (slot.day.toLowerCase() === day.toLowerCase()) {
                daySlots.push({ slot, section: sec });
              }
            });
          });

          return (
            <div key={day} className="relative h-[768px] border-r border-[#23352a]/40 last:border-r-0">
              {/* Hourly Grid Background Lines */}
              {HOURS.map((hr) => (
                <div key={hr} className="h-16 border-b border-[#23352a]/20" />
              ))}

              {/* Positioned Time Slot Blocks */}
              {daySlots.map(({ slot, section }) => {
                const startMin = timeToMinutes(slot.start_time);
                const endMin = timeToMinutes(slot.end_time);

                const gridStartMin = START_HOUR * 60;
                const totalGridMin = (END_HOUR - START_HOUR) * 60;

                const topPercent = Math.max(0, ((startMin - gridStartMin) / totalGridMin) * 100);
                const heightPercent = Math.min(100, ((endMin - startMin) / totalGridMin) * 100);

                const code = section.course_code || "COURSE";
                const isConflicting = conflictSet.has(section.id);
                const colorScheme = COURSE_COLORS[courseColorMap.get(code) || 0];

                return (
                  <div
                    key={slot.id}
                    style={{ top: `${topPercent}%`, height: `${heightPercent}%` }}
                    className={`absolute inset-x-1 p-2 rounded-md border shadow-md overflow-hidden transition-all hover:scale-[1.02] hover:z-30 group ${
                      isConflicting
                        ? "bg-red-950/90 border-2 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
                        : `${colorScheme.bg} ${colorScheme.border}`
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className={`font-mono-data text-xs font-bold flex items-center justify-between ${isConflicting ? "text-red-300" : colorScheme.text}`}>
                          <span className="flex items-center gap-1">
                            {isConflicting && <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />}
                            <span>{code}</span>
                          </span>
                          <span className={`text-[9px] px-1 rounded ${isConflicting ? "bg-red-900 text-red-200" : "bg-[#0e1712]"}`}>
                            {section.section_label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#f3f4f3] font-medium truncate">{section.course_title}</p>
                      </div>

                      <div className="text-[9px] font-mono-data text-[#9ea8a1] space-y-0.5 pt-1 border-t border-white/10">
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                        {slot.room && (
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{slot.room}</span>
                          </div>
                        )}
                        {section.instructor && (
                          <div className="flex items-center gap-1 truncate">
                            <UserIcon className="w-2.5 h-2.5" />
                            <span>{section.instructor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
