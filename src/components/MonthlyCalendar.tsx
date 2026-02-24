import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Schedule } from "@/lib/scheduleStore";

interface MonthlyCalendarProps {
  year: number;
  month: number;
  schedules: Schedule[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function MonthlyCalendar({
  year, month, schedules, selectedDate,
  onSelectDate, onPrevMonth, onNextMonth,
}: MonthlyCalendarProps) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const { days, startDay } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return {
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay: firstDay,
    };
  }, [year, month]);

  const scheduleDates = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach((s) => set.add(s.date));
    return set;
  }, [schedules]);

  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4 md:p-6 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onPrevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-display text-xl font-semibold text-card-foreground">
          {MONTHS[month]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = toDateStr(year, month, day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasSchedule = scheduleDates.has(dateStr);

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
            className={`
                relative flex flex-col items-center justify-center rounded-lg p-2 sm:p-2.5 text-sm min-h-[40px] sm:min-h-[44px] transition-all
                hover:bg-accent active:scale-95
                ${isToday && !isSelected ? "bg-calendar-today font-semibold" : ""}
                ${isSelected ? "bg-calendar-selected text-primary-foreground font-semibold shadow-sm" : "text-card-foreground"}
              `}
            >
              {day}
              {hasSchedule && (
                <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-schedule-dot"}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
