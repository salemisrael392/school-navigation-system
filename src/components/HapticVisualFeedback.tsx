import React, { useState, useEffect } from 'react';
import { Smartphone, Zap } from 'lucide-react';
import { HapticType } from '../utils/haptics';

export const HapticVisualFeedback: React.FC = () => {
  const [activeFeedback, setActiveFeedback] = useState<{
    type: HapticType;
    label: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleHapticEvent = (e: any) => {
      const type: HapticType = e.detail?.type || 'tap';
      let label = 'Tactile Pulse';
      if (type === 'start_navigation') label = 'Haptic: Navigation Started 🧭';
      if (type === 'qr_success') label = 'Haptic: QR Calibrated 📷';
      if (type === 'sos_trigger') label = 'Haptic: Emergency Alarm Pulse 🚨';
      if (type === 'arrival') label = 'Haptic: Destination Reached 🎯';
      if (type === 'turn_maneuver') label = 'Haptic: Turn Maneuver ↩️';
      if (type === 'notification') label = 'Haptic: Campus Alert Pulse 🔔';

      setActiveFeedback({
        type,
        label,
        id: Date.now(),
      });

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setActiveFeedback((current) => (current?.type === type ? null : current));
      }, 2200);
    };

    window.addEventListener('campus_haptic_feedback', handleHapticEvent);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('campus_haptic_feedback', handleHapticEvent);
    };
  }, []);

  if (!activeFeedback) return null;

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all animate-in fade-in slide-in-from-top-3 duration-200">
      <div
        className={`px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 border ${
          activeFeedback.type === 'sos_trigger'
            ? 'bg-red-600 text-white border-red-400 ring-4 ring-red-400/30 animate-pulse'
            : activeFeedback.type === 'start_navigation'
            ? 'bg-[#1a73e8] text-white border-blue-400 ring-2 ring-blue-300/30'
            : 'bg-[#000923] text-white border-slate-700'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5 animate-bounce" />
        <span>{activeFeedback.label}</span>
      </div>
    </div>
  );
};
