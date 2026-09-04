/**
 * Tactile Haptic Feedback Utility
 * Uses the Web Vibration API (navigator.vibrate) with safe fallbacks.
 */

export type HapticType =
  | 'start_navigation'
  | 'qr_success'
  | 'sos_trigger'
  | 'tap'
  | 'arrival'
  | 'turn_maneuver'
  | 'notification';

export const triggerHaptic = (type: HapticType = 'tap'): boolean => {
  if (typeof window === 'undefined' || !navigator) return false;

  let pattern: number | number[] = 50;

  switch (type) {
    case 'start_navigation':
      // Distinct double pulse welcoming navigation start
      pattern = [60, 40, 120];
      break;

    case 'qr_success':
      // Quick crisp confirm pulse
      pattern = [80, 50, 100];
      break;

    case 'sos_trigger':
      // Urgent, heavy alarm vibration pattern
      pattern = [250, 80, 250, 80, 500];
      break;

    case 'arrival':
      // Celebration arrival pulse
      pattern = [100, 60, 100, 60, 250];
      break;

    case 'turn_maneuver':
      // Turn alert
      pattern = [80, 40, 80];
      break;

    case 'notification':
      // Distinct push notification arrival chime pulse
      pattern = [70, 50, 70, 50, 140];
      break;

    case 'tap':
    default:
      pattern = 35;
      break;
  }

  // Dispatch custom event for visual on-screen haptic indicator (great for desktop preview)
  window.dispatchEvent(
    new CustomEvent('campus_haptic_feedback', {
      detail: { type, pattern },
    })
  );

  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  return false;
};
