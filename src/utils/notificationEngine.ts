import { CampusNotification, ClassScheduleItem, NotificationCategory } from '../types';
import { triggerHaptic } from './haptics';

const STORAGE_KEY = 'sru_campus_notifications_v2';
const SETTINGS_STORAGE_KEY = 'sru_notification_settings_v1';

export interface NotificationSettings {
  locationAlerts: boolean;
  scheduleAlerts: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  locationAlerts: true,
  scheduleAlerts: true,
  soundEnabled: true,
  hapticEnabled: true,
};

export const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-closure-1',
    title: '⚠️ Building Closure: Central Library Level 2',
    body: 'Level 2 Reference & Periodicals hall is temporarily closed for HVAC duct maintenance until 4:00 PM. Level 1 digital lab and reading bays remain open.',
    category: 'closure',
    priority: 'high',
    timestamp: Date.now() - 15 * 60 * 1000,
    timeFormatted: '15m ago',
    buildingId: 'central-library',
    buildingName: 'Central Library',
    locationTag: 'Near Central Library',
    actionLabel: 'View Library Info',
    read: false,
    source: 'campus_broadcast',
  },
  {
    id: 'notif-event-1',
    title: '🎉 Campus Event: SRiX AI Hackathon Showcase',
    body: 'Live student prototype demonstrations & sponsor networking are now active at Block A Ground Atrium. Open to all students & faculty.',
    category: 'event',
    priority: 'normal',
    timestamp: Date.now() - 45 * 60 * 1000,
    timeFormatted: '45m ago',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    locationTag: 'Near Block A Lawns',
    actionLabel: 'Route to Block A',
    read: false,
    source: 'location_proximity',
  },
  {
    id: 'notif-schedule-1',
    title: '🎓 Class Advisory: West Elevator Servicing',
    body: 'For your upcoming CS-301 class in Block A (Room 204), please note the West elevator is undergoing periodic inspection. Use Staircase B or East elevator.',
    category: 'schedule',
    priority: 'high',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    timeFormatted: '2h ago',
    buildingId: 'srix-block-a',
    buildingName: 'Block A • CSE & IT',
    locationTag: 'Your Schedule',
    actionLabel: 'Highlight on Map',
    read: true,
    source: 'schedule_conflict',
  },
  {
    id: 'notif-advisory-1',
    title: '🌧️ Weather Advisory: Use Pergola Walkways',
    body: 'Rain showers anticipated over Warangal campus at 3:00 PM. Covered pergola routes between Hostels, Green Quadrangle, and Block A are recommended.',
    category: 'advisory',
    priority: 'normal',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    timeFormatted: '3h ago',
    locationTag: 'Campus-wide',
    actionLabel: 'View Covered Route',
    read: true,
    source: 'campus_broadcast',
  },
];

/**
 * Play a gentle, realistic mobile push notification chime using Web Audio API
 */
export const playNotificationChime = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Pleasant two-tone chime (F#5 to C#6)
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(739.99, now); // F#5
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second bell tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1108.73, now + 0.12); // C#6
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.7);
  } catch {
    // browser auto-play restrictions or uninitialized
  }
};

/**
 * Load notifications from storage
 */
export const loadNotifications = (): CampusNotification[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_NOTIFICATIONS;
};

/**
 * Save notifications
 */
export const saveNotifications = (items: CampusNotification[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

/**
 * Load settings
 */
export const loadNotificationSettings = (): NotificationSettings => {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
};

/**
 * Save settings
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
};

/**
 * Create a new contextual notification and trigger haptics + sound
 */
export const triggerPushNotification = (
  notification: Omit<CampusNotification, 'id' | 'timestamp' | 'timeFormatted' | 'read'>,
  settings: NotificationSettings
): CampusNotification => {
  const newNotif: CampusNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: Date.now(),
    timeFormatted: 'Just now',
    read: false,
  };

  if (settings.hapticEnabled) {
    triggerHaptic('notification');
  }

  if (settings.soundEnabled) {
    playNotificationChime();
  }

  return newNotif;
};

/**
 * Simulates different real-time campus alerts based on current student location & schedule
 */
export const generateContextualAlert = (
  type: 'closure' | 'event' | 'schedule' | 'advisory',
  currentLocationName: string,
  nextClass: ClassScheduleItem | null,
  settings: NotificationSettings
): CampusNotification => {
  switch (type) {
    case 'closure':
      return triggerPushNotification(
        {
          title: '🚨 Urgent Closure: Block B CNC Machining Bay',
          body: 'Heavy Machinery Lab in Block B is closed until 3:30 PM today for urgent recalibration & electrical safety audit. Students assigned to ME-101 are relocated to Design Studio 104.',
          category: 'closure',
          priority: 'urgent',
          buildingId: 'block-b',
          buildingName: 'Block B - Mech & Civil',
          locationTag: 'Near Block B',
          actionLabel: 'Reroute on Map',
          source: 'location_proximity',
        },
        settings
      );

    case 'event':
      return triggerPushNotification(
        {
          title: '🏆 Campus Event: Inter-College Drone Grand Prix',
          body: 'Robotics & UAV flight trials are taking place now at the Outdoor Sports Arena. Free student entry, refreshments, and VR flight simulators.',
          category: 'event',
          priority: 'normal',
          buildingId: 'sports-complex',
          buildingName: 'SRU Sports Complex',
          locationTag: 'Sports Complex',
          actionLabel: 'Route to Arena',
          source: 'location_proximity',
        },
        settings
      );

    case 'schedule':
      if (nextClass) {
        return triggerPushNotification(
          {
            title: `⏰ Class Schedule Alert: ${nextClass.courseCode} Starting Soon`,
            body: `Your next lecture "${nextClass.subjectName}" in ${nextClass.buildingName} (${nextClass.room}) starts at ${nextClass.startTime}. Notice: Central breezeway has floor cleaning; please use North Porch.`,
            category: 'schedule',
            priority: 'high',
            buildingId: nextClass.buildingId,
            buildingName: nextClass.buildingName,
            locationTag: nextClass.room,
            actionLabel: 'Navigate to Classroom',
            source: 'schedule_conflict',
          },
          settings
        );
      } else {
        return triggerPushNotification(
          {
            title: '🎓 Class Timetable Notice: Room Relocation',
            body: 'Department Notice: Today\'s afternoon engineering lectures in Centenary Bhavan are moved to Seminar Hall 102 due to Deanery accreditation review.',
            category: 'schedule',
            priority: 'high',
            buildingId: 'centenary-bhavan',
            buildingName: 'Centenary Bhavan',
            locationTag: 'Centenary Bhavan',
            actionLabel: 'View Building on Map',
            source: 'schedule_conflict',
          },
          settings
        );
      }

    case 'advisory':
    default:
      return triggerPushNotification(
        {
          title: '⚡ Proximity Alert: Near ' + currentLocationName,
          body: `You are currently ${currentLocationName}. High-speed 5G Wi-Fi zone 'SRU_Gigabit_West' is active here with 450 Mbps. Library quiet study pods are 80 meters away.`,
          category: 'advisory',
          priority: 'normal',
          locationTag: currentLocationName,
          actionLabel: 'Explore Nearby',
          source: 'location_proximity',
        },
        settings
      );
  }
};
