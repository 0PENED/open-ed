// Types
export interface Schedule {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  time?: string;
}

export interface CalendarData {
  openCode: string;
  name: string;
  password: string;
  schedules: Schedule[];
}

// Storage helpers
const STORAGE_KEY = "opened_calendars";

export function getCalendars(): CalendarData[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCalendars(calendars: CalendarData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calendars));
}

export function getCalendarByCode(code: string): CalendarData | undefined {
  return getCalendars().find((c) => c.openCode.toLowerCase() === code.toLowerCase());
}

export function verifyCalendarPassword(code: string, password: string): boolean {
  const cal = getCalendarByCode(code);
  if (!cal) return false;
  return cal.password === password;
}

export function addCalendar(openCode: string, name: string, password: string): CalendarData {
  const calendars = getCalendars();
  const newCal: CalendarData = { openCode, name, password, schedules: [] };
  calendars.push(newCal);
  saveCalendars(calendars);
  return newCal;
}

export function deleteCalendar(openCode: string) {
  const calendars = getCalendars().filter((c) => c.openCode !== openCode);
  saveCalendars(calendars);
}

export function addSchedule(openCode: string, schedule: Omit<Schedule, "id">): Schedule {
  const calendars = getCalendars();
  const cal = calendars.find((c) => c.openCode === openCode);
  if (!cal) throw new Error("Calendar not found");
  const newSchedule: Schedule = { ...schedule, id: crypto.randomUUID() };
  cal.schedules.push(newSchedule);
  saveCalendars(calendars);
  return newSchedule;
}

export function deleteSchedule(openCode: string, scheduleId: string) {
  const calendars = getCalendars();
  const cal = calendars.find((c) => c.openCode === openCode);
  if (!cal) return;
  cal.schedules = cal.schedules.filter((s) => s.id !== scheduleId);
  saveCalendars(calendars);
}

export function getSchedulesForDate(openCode: string, date: string): Schedule[] {
  const cal = getCalendarByCode(openCode);
  if (!cal) return [];
  return cal.schedules.filter((s) => s.date === date);
}

export function getSchedulesForMonth(openCode: string, year: number, month: number): Schedule[] {
  const cal = getCalendarByCode(openCode);
  if (!cal) return [];
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return cal.schedules.filter((s) => s.date.startsWith(prefix));
}
