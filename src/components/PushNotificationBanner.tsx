import React, { useEffect, useState } from 'react';
import { X, Navigation, AlertTriangle, Sparkles, Clock, Info, ChevronRight, BellRing } from 'lucide-react';
import { CampusNotification } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface PushNotificationBannerProps {
  notification: CampusNotification | null;
  onDismiss: () => void;
  onActionClick: (notification: CampusNotification) => void;
  onOpenNotificationsModal: () => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  notification,
  onDismiss,
  onActionClick,
  onOpenNotificationsModal,
}) => {
  const [progress, setProgress] = useState<number>(100);
  const onDismissRef = React.useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!notification) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 8000; // 8 seconds display
    const intervalMs = 100;
    const startTime = Date.now();

    // Auto-dismiss after duration finishes
    const dismissTimer = setTimeout(() => {
      onDismissRef.current();
    }, duration);

    // Progress bar interval update (pure state update only)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);
    }, intervalMs);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [notification?.id]);

  if (!notification) return null;

  const getCategoryStyles = () => {
    switch (notification.category) {
      case 'closure':
        return {
          badgeBg: 'bg-red-500/20 text-red-200 border-red-500/40',
          accentColor: 'border-red-500',
          icon: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />,
          label: 'Building Closure',
          glow: 'shadow-red-950/50',
        };
      case 'event':
        return {
          badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
          accentColor: 'border-purple-500',
          icon: <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />,
          label: 'Campus Event',
          glow: 'shadow-purple-950/50',
        };
      case 'schedule':
        return {
          badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
          accentColor: 'border-amber-500',
          icon: <Clock className="w-4 h-4 text-amber-400 shrink-0" />,
          label: 'Class Schedule Alert',
          glow: 'shadow-amber-950/50',
        };
      case 'advisory':
      default:
        return {
          badgeBg: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
          accentColor: 'border-blue-500',
          icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
          label: 'Location Advisory',
          glow: 'shadow-blue-950/50',
        };
    }
  };

  const style = getCategoryStyles();

  return (
    <div
      id="push-notification-banner"
      className="fixed top-2.5 left-2.5 right-2.5 sm:left-auto sm:right-4 sm:w-[410px] z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto"
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#000923]/95 backdrop-blur-md border border-slate-700/80 text-white shadow-2xl ${style.glow} transition-all`}
      >
        {/* Top Progress bar timer */}
        <div className="w-full h-1 bg-slate-800/80 overflow-hidden">
          <div
            className={`h-full transition-all ease-linear ${
              notification.category === 'closure'
                ? 'bg-red-500'
                : notification.category === 'event'
                ? 'bg-purple-400'
                : notification.category === 'schedule'
                ? 'bg-amber-400'
                : 'bg-blue-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-3 sm:p-3.5 space-y-2">
          {/* Header metadata row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-bold text-[11px] text-white border border-white/10">
                sru
              </div>
              <span className="text-[11px] font-bold text-slate-200 tracking-wide">
                SRU SafeAlert
              </span>
              <span className="text-slate-500 text-[10px]">•</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.badgeBg}`}>
                {style.label}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Just now</span>
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onDismiss();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Alert Title & Body */}
          <div className="flex items-start gap-2.5 pt-0.5">
            <div className="mt-0.5 p-1 rounded-lg bg-white/5 border border-white/10">
              {style.icon}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white leading-snug">
                {notification.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                {notification.body}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={() => {
                triggerHaptic('tap');
                onOpenNotificationsModal();
              }}
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <BellRing className="w-3 h-3" />
              All Notices
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onDismiss();
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Dismiss
              </button>

              <button
                onClick={() => {
                  triggerHaptic('start_navigation');
                  onActionClick(notification);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
                  notification.category === 'closure'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : notification.category === 'event'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : notification.category === 'schedule'
                    ? 'bg-amber-500 hover:bg-amber-400 text-[#000923]'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <Navigation className="w-3 h-3 fill-current" />
                <span>{notification.actionLabel || 'View on Map'}</span>
                <ChevronRight className="w-3 h-3 opacity-80" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
