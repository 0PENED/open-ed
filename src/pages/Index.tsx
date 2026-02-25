import { useState, useCallback } from "react";
import { OpenCodeEntry } from "@/components/OpenCodeEntry";
import { MonthlyCalendar } from "@/components/MonthlyCalendar";
import { DaySchedulePanel } from "@/components/DaySchedulePanel";
import { AdminLoginDialog } from "@/components/AdminLoginDialog";
import { AdminCalendarManager } from "@/components/AdminCalendarManager";
import {
  getCalendarByCode,
  getCalendars,
  addCalendar,
  deleteCalendar,
  getSchedulesForMonth,
  getSchedulesForDate,
  addSchedule,
  deleteSchedule,
  verifyCalendarPassword,
} from "@/lib/scheduleStore";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_PASSWORD = "123.com";

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [calendarName, setCalendarName] = useState("");
  const [entryError, setEntryError] = useState("");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const handleLogin = (pw: string) => {
    if (pw === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleOpenCode = (code: string, password: string) => {
    const cal = getCalendarByCode(code);
    if (!cal) {
      setEntryError("Calendar not found. Check your OPENCODE.");
      return;
    }
    if (!verifyCalendarPassword(code, password)) {
      setEntryError("Incorrect password.");
      return;
    }
    setOpenCode(cal.openCode);
    setCalendarName(cal.name);
    setEntryError("");
  };

  const handleCreateCalendar = (code: string, name: string, password: string): boolean => {
    const existing = getCalendarByCode(code);
    if (existing) return false;
    addCalendar(code, name, password);
    refresh();
    return true;
  };

  const handlePrevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const handleAddSchedule = (data: { title: string; description: string; time?: string }) => {
    if (!openCode || !selectedDate) return;
    addSchedule(openCode, { ...data, date: selectedDate });
    refresh();
  };

  const handleDeleteSchedule = (id: string) => {
    if (!openCode) return;
    deleteSchedule(openCode, id);
    refresh();
  };

  // Admin calendar manager handlers
  const handleAdminAddCalendar = (code: string, name: string) => {
    addCalendar(code, name, "admin");
    refresh();
  };

  const handleDeleteCalendar = (code: string) => {
    deleteCalendar(code);
    if (openCode === code) {
      setOpenCode(null);
      setSelectedDate(null);
    }
    refresh();
  };

  const handleSelectCalendar = (code: string) => {
    const cal = getCalendarByCode(code);
    if (cal) {
      setOpenCode(cal.openCode);
      setCalendarName(cal.name);
    }
  };

  // Header for calendar view
  const renderHeader = () => (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setOpenCode(null); setSelectedDate(null); }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold text-foreground">{calendarName}</span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">{openCode}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isAdmin && (
            <AdminCalendarManager
              calendars={getCalendars()}
              onAdd={handleAdminAddCalendar}
              onDelete={handleDeleteCalendar}
              onSelect={handleSelectCalendar}
            />
          )}
          <AdminLoginDialog isAdmin={isAdmin} onLogin={handleLogin} onLogout={() => setIsAdmin(false)} />
        </div>
      </div>
    </header>
  );

  // OPENCODE entry screen
  if (!openCode) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute right-4 top-4 flex items-center gap-1">
          {isAdmin && (
            <AdminCalendarManager
              calendars={getCalendars()}
              onAdd={handleAdminAddCalendar}
              onDelete={handleDeleteCalendar}
              onSelect={handleSelectCalendar}
            />
          )}
          <AdminLoginDialog isAdmin={isAdmin} onLogin={handleLogin} onLogout={() => setIsAdmin(false)} />
        </div>
        <OpenCodeEntry onSubmit={handleOpenCode} onCreate={handleCreateCalendar} error={entryError} />
      </div>
    );
  }

  const monthSchedules = getSchedulesForMonth(openCode, year, month);
  const daySchedules = selectedDate ? getSchedulesForDate(openCode, selectedDate) : [];

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-[1fr_340px]">
          <MonthlyCalendar
            year={year}
            month={month}
            schedules={monthSchedules}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          {selectedDate ? (
            <DaySchedulePanel
              date={selectedDate}
              schedules={daySchedules}
              isAdmin={true}
              onAdd={handleAddSchedule}
              onDelete={handleDeleteSchedule}
              onClose={() => setSelectedDate(null)}
            />
          ) : (
            <div className="flex items-center justify-center rounded-xl border bg-card p-8 shadow-sm">
              <p className="text-center text-muted-foreground">
                Select a day to view schedules
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
