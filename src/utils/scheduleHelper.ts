import { ClassScheduleItem, DayOfWeek, Building } from '../types';
import { DEFAULT_CLASS_SCHEDULE, CAMPUS_BUILDINGS } from '../data/campusData';

const SCHEDULE_STORAGE_KEY = 'sru_student_timetable_v1';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Get current Day of Week string (Monday - Saturday)
 */
export const getCurrentDayOfWeek = (): DayOfWeek => {
  const days: DayOfWeek[] = [
    'Monday', // map Sunday to Monday for school week default
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayIdx = new Date().getDay();
  return days[dayIdx] || 'Monday';
};

/**
 * Load schedule from localStorage or fallback to defaults
 */
export const loadStudentSchedule = (): ClassScheduleItem[] => {
  if (typeof window === 'undefined') return DEFAULT_CLASS_SCHEDULE;
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_CLASS_SCHEDULE;
};

/**
 * Save schedule to localStorage
 */
export const saveStudentSchedule = (items: ClassScheduleItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

/**
 * Parse time string like "09:30 AM" or "14:15" into minutes since midnight
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const timeOnly = clean.replace(/[APM\s]/g, '');
  const [hourStr, minStr] = timeOnly.split(':');
  let hour = parseInt(hourStr || '0', 10);
  const min = parseInt(minStr || '0', 10);

  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  return hour * 60 + min;
};

/**
 * Determines the next upcoming class or current ongoing class.
 */
export const getNextUpcomingClass = (
  items: ClassScheduleItem[],
  targetDay?: DayOfWeek
): {
  item: ClassScheduleItem | null;
  building: Building | null;
  status: 'ongoing' | 'upcoming' | 'finished_for_day';
  startsInMinutes: number;
} => {
  const currentDay = targetDay || getCurrentDayOfWeek();
  const dayClasses = items
    .filter((c) => c.day === currentDay)
    .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));

  if (dayClasses.length === 0) {
    // If no classes on this day, look for the first class of the week
    const firstAny = items[0] || null;
    const building = firstAny
      ? CAMPUS_BUILDINGS.find((b) => b.id === firstAny.buildingId) || null
      : null;
    return {
      item: firstAny,
      building,
      status: 'upcoming',
      startsInMinutes: 0,
    };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Check for currently ongoing class
  for (const c of dayClasses) {
    const start = parseTimeToMinutes(c.startTime);
    const end = parseTimeToMinutes(c.endTime);
    if (currentMinutes >= start && currentMinutes <= end) {
      const building = CAMPUS_BUILDINGS.find((b) => b.id === c.buildingId) || null;
      return {
        item: c,
        building,
        status: 'ongoing',
        startsInMinutes: 0,
      };
    }
  }

  // Find next class today
  for (const c of dayClasses) {
    const start = parseTimeToMinutes(c.startTime);
    if (start > currentMinutes) {
      const building = CAMPUS_BUILDINGS.find((b) => b.id === c.buildingId) || null;
      return {
        item: c,
        building,
        status: 'upcoming',
        startsInMinutes: start - currentMinutes,
      };
    }
  }

  // If all classes for today finished, return the first class of the day as reference
  const first = dayClasses[0];
  const building = CAMPUS_BUILDINGS.find((b) => b.id === first.buildingId) || null;
  return {
    item: first,
    building,
    status: 'finished_for_day',
    startsInMinutes: 0,
  };
};
